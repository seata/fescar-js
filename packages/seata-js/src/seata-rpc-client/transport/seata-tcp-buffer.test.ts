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
import { EventEmitter } from 'events'

import SeataTcpBuffer from './seata-tcp-buffer'
import { RpcMessage } from '../../seata-protocol/rpc-message'
import { MessageType } from '../../seata-protocol/message-type'
import { SerializerType } from '../../seata-serializer/serializer'
import { CompressorType } from '../../seata-compressor/compressor'
import { ProtocolV1Encoder } from '../v1/protocol-v1-encoder'

class TcpTransport extends EventEmitter {
  remoteAddress: string
  remotePort: number

  constructor() {
    super()
    this.remoteAddress = 'localhost'
    this.remotePort = 20880
  }
}

describe('seata-tcp-buffer test suites', () => {
  let transport: TcpTransport
  let encoder: Buffer

  beforeAll(() => {
    const msg = new RpcMessage()
      .setId(100)
      .setMessageType(MessageType.TYPE_GLOBAL_BEGIN)
      .setCodec(SerializerType.HESSIAN)
      .setCompressor(CompressorType.NONE)
      .setBody({ body: 'body' })
    encoder = ProtocolV1Encoder.encode(msg)
    transport = new TcpTransport()
  })

  it('test emit once right encoder', async () => {
    // send encoder to transport
    setTimeout(() => {
      transport.emit('data', encoder)
    })

    await new Promise((resolve) => {
      new SeataTcpBuffer(transport as unknown as Socket).subscribe((buff) => {
        expect(buff).toBeTruthy()
        expect(buff.length).toBe(encoder.length)
        expect(buff.compare(encoder)).toBe(0)
        resolve(null)
      })
    })
  })

  it('test emit wrong encoder', async () => {
    // send encoder to transport
    setTimeout(() => {
      transport.emit('data', Buffer.concat([Buffer.alloc(10), encoder]))
    })

    await new Promise((resolve) => {
      new SeataTcpBuffer(transport as unknown as Socket).subscribe((buff) => {
        expect(buff).toBeTruthy()
        expect(buff.length).toBe(encoder.length)
        expect(buff.compare(encoder)).toBe(0)
        resolve(null)
      })
    })
  })

  it('test multiple emit encoder', async () => {
    // send encoder to transport
    setTimeout(() => {
      transport.emit(
        'data',
        Buffer.concat([encoder, Buffer.alloc(10), encoder]),
      )
    })
    let counter = 0
    await new Promise((resolve) => {
      new SeataTcpBuffer(transport as unknown as Socket).subscribe((buff) => {
        expect(buff).toBeTruthy()
        expect(buff.length).toBe(encoder.length)
        expect(buff.compare(encoder)).toBe(0)
        counter++
        if (counter === 2) {
          resolve(null)
        }
      })
    })
  })
})
