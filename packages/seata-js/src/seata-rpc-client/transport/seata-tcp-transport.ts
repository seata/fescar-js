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
import debug from 'debug'
import { RpcMessage } from '../../seata-protocol/rpc-message'
import { ProtocolV1Decoder } from '../v1/protocol-v1-decoder'
import { ProtocolV1Encoder } from '../v1/protocol-v1-encoder'
import SeataTcpBuffer from './seata-tcp-buffer'
import { SeataHeartBeat } from './seata-tcp-heartbeat'
import { SeataTransport } from './transport'

type id = number

interface SeataTransportPromise {
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}

const log = debug(`seata:rpc:transport`)

export class SeataTcpTransport implements SeataTransport {
  private readonly requestQueue: Map<id, SeataTransportPromise>
  private readonly transport: Socket
  private readonly host: string

  private heartBeat: SeataHeartBeat

  constructor(hostname: string, port: number) {
    this.host = `${hostname}:${port}`
    this.requestQueue = new Map()

    // set transport
    this.transport = new Socket()
    this.transport.setNoDelay()
    this.transport
      .connect(port, hostname, this.handleSocketConnected)
      .on('error', this.handleSocketErr)
      .on('close', this.handleSocketClose)

    // set tcp buffer
    new SeataTcpBuffer(this.transport).subscribe(this.handleTcpBuffer)

    // set heartbeat
    this.heartBeat = new SeataHeartBeat(this.transport)
  }

  send(msg: RpcMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = msg.getId()
      this.requestQueue.set(id, { resolve, reject })
      this.transport.write(ProtocolV1Encoder.encode(msg))
      this.heartBeat.setLastActivityTime(Date.now())
    })
  }

  private handleSocketConnected = () => {
    log('tcp-transport = connecting => %s', this.host)
  }
  private handleSocketErr = () => {}
  private handleSocketClose = () => {}

  private handleTcpBuffer = (data: Buffer) => {
    // decode message
    const msg = ProtocolV1Decoder.decode(data)

    // 是不是心跳
    if (msg.isHeartBeat()) {
      this.heartBeat.receive()
      return
    }

    const val = this.requestQueue.get(msg.getId())
    if (val !== undefined) {
      if (!msg.isHeartBeat()) {
        val.resolve(msg)
      }
      this.requestQueue.delete(msg.getId())
    }
  }
}
