/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Socket } from 'net'
import { Buffer } from 'node:buffer'
import debug from 'debug'

import { noop } from '../seata-common/util'
import ByteBuffer from '../seata-common/byte-buffer'
import prot from '../seata-protocol/protocol-constants'

export interface SeataTcpBufferSubscriber {
  (data: Buffer): void
}

const log = debug('seata:tcp-buffer')

/**
 * 在并发的tcp数据传输中，会出现少包，粘包的现象
 * 好在tcp的传输是可以保证顺序的
 * 我们需要抽取一个buffer来统一处理这些数据
 */
export default class SeataTcpBuffer {
  private readonly remoteAddr: string

  private transport: Socket
  private buff: ByteBuffer

  private subscriber: Function

  constructor(transport: Socket) {
    this.transport = transport
    const { remoteAddress, remotePort } = this.transport
    this.remoteAddr = remoteAddress + ':' + remotePort
    log('create new tcp buff with transport %s', remoteAddress)

    this.subscriber = noop
    this.buff = new ByteBuffer()

    process.nextTick(() => {
      this.transport
        .on('data', (data: Buffer) => this.receive(data))
        .on('close', () => {
          log('transport %s closed', this.remoteAddr)
        })
    })
  }

  private receive(data: Buffer) {
    log('receive data from %s', this.remoteAddr)
    // concat data into buffer
    this.buff.writeBytes(data)

    while (this.buff.getLength() >= prot.V1_HEAD_LENGTH) {
      const magicCodeIndex = this.buff.indexOf(
        Buffer.from([prot.MAGIC_HIGH, prot.MAGIC_LOW]),
      )
      log('magic code index %d', magicCodeIndex)

      // check magic code
      if (magicCodeIndex === -1) {
        return
      }

      // resolve wrong magic position
      if (magicCodeIndex != 0) {
        this.buff.splice(0, magicCodeIndex)
        if (this.buff.getLength() < prot.V1_HEAD_LENGTH) {
          return
        }
      }

      // read full length
      const fullLength = this.buff.readInt({ unsigned: true, index: 3 })
      // check full length
      if (fullLength > this.buff.getLength()) {
        //waiting
        log(
          'fullLength %d > buffer length %d',
          fullLength,
          this.buff.getLength(),
        )
        return
      }

      // splice buff
      const buff = this.buff.splice(0, fullLength)
      this.subscriber(buff)
    }
  }

  subscribe(subscriber: SeataTcpBufferSubscriber) {
    this.subscriber = subscriber
    return this
  }
}
