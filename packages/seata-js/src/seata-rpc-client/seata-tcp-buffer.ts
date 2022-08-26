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
  private transport: Socket
  private buff: ByteBuffer

  private readonly remoteAddr: string
  private subscriber: Function

  constructor(transport: Socket) {
    const { remoteAddress, remotePort } = transport
    log('create new tcp buff with transport %s', remoteAddress)

    this.transport = transport
    this.remoteAddr = remoteAddress + ':' + remotePort

    this.buff = new ByteBuffer()
    this.subscriber = noop

    process.nextTick(() => {
      this.transport
        .on('data', (data: Buffer) => this.receive(data))
        .on('close', () => {
          log('transport %s closed', this.remoteAddr)
          // @ts-ignore
          this.buff = null
        })
    })
  }

  receive(data: Buffer) {
    log('receive data from %s', this.remoteAddr)
    // get current length
    const len = this.buff.getLength()

    // append mode
    this.buff.writeBytes(data, { offset: len - 1 })

    while (len >= prot.V1_HEAD_LENGTH) {
      const magicHighIndex = this.buff.indexOf(prot.MAGIC_HIGH)
      const magicLowIndex = this.buff.indexOf(prot.MAGIC_LOW)

      if (magicHighIndex !== 0 && magicLowIndex !== 1) {
        log(
          'magic code invalid with (magicHigh#%d, magicLow#%d), discard buff',
          magicHighIndex,
          magicLowIndex,
        )

        // find first right magic code
        if (magicLowIndex - magicHighIndex === 1) {
          // clear buffer until magic high code
          this.buff.splice(0, magicHighIndex)

          if (this.buff.getLength() < prot.V1_HEAD_LENGTH) {
            return
          }
        }
      }

      // read full length
      const fullLength = this.buff.readInt({ unsigned: true, offset: 3 })
      const buff = this.buff.splice(0, fullLength)

      this.subscriber(buff)
    }
  }

  subscribe(subscriber: SeataTcpBufferSubscriber) {
    this.subscriber = subscriber
    return this
  }
}
