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
import { SeataTransport } from './transport'
import SeataTcpBuffer from './seata-tcp-buffer'
import { Retry } from '../../seata-common/retry'
import { SeataHeartBeat } from './seata-tcp-heartbeat'
import { RpcMessage } from '../../seata-protocol/rpc-message'
import { ProtocolV1Decoder } from '../v1/protocol-v1-decoder'
import { ProtocolV1Encoder } from '../v1/protocol-v1-encoder'
import { TransportStatus } from './seata-transport-status'

const log = debug(`seata:rpc:transport`)

type id = number
interface SeataTransportPromise {
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}

export class SeataTcpTransport implements SeataTransport {
  private readonly host: string
  private readonly requestQueue: Map<id, SeataTransportPromise>
  private status: TransportStatus
  private transport: Socket
  private heartBeat!: SeataHeartBeat

  constructor(hostname: string, port: number) {
    this.host = `${hostname}:${port}`
    this.status = TransportStatus.PADDING
    this.transport = new Socket()
    this.requestQueue = new Map()

    Retry.from({
      initialDelay: 0,
      maxRetry: 100,
      period: 100, // 100ms
      run: async (onSuccess, onFailed) => {
        try {
          await this.initTransport(hostname, port)
          onSuccess()
        } catch (err) {
          onFailed()
        }
      },
      onFailedEnd: () => {
        // TODO emit status
        this.status = TransportStatus.CLOSED
      },
    })
  }

  getStatus() {
    return this.status
  }

  send(msg: RpcMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      const id = msg.getId()
      this.requestQueue.set(id, { resolve, reject })
      this.transport.write(ProtocolV1Encoder.encode(msg), (err) => {
        log(`write error %s`, err)
      })
      this.heartBeat.setLastActivityTime(Date.now())
    })
  }

  private initTransport(hostname: string, port: number) {
    return new Promise((resolve, reject) => {
      // set transport
      this.transport.setNoDelay()
      this.transport
        .connect(port, hostname, () => {
          this.handleSocketConnected()
          resolve(null)
        })
        .on('error', (err) => {
          this.handleSocketErr(err)
          reject(err)
        })
        .on('close', this.handleSocketClose)
    })
  }

  private handleSocketConnected = () => {
    log('tcp-transport = connected => %s', this.host)
    this.status = TransportStatus.CONNECTED
    // stop retry
    this.heartBeat = new SeataHeartBeat(this.transport)
    // set tcp buffer
    new SeataTcpBuffer(this.transport).subscribe(this.handleTcpBuffer)
  }

  private handleSocketErr = (err: Error) => {
    log(`connecting => ${this.host} error %s`, err)
    this.status = TransportStatus.RETRY
  }

  private handleSocketClose = () => {
    log(`socket transport close => ${this.host}`)
  }

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
