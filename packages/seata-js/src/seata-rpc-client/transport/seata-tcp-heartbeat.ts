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
import { HeartbeatMessage } from '../../seata-protocol/heartbeat-message'
import AbstractSeataRemoting from './seata-abstract-remoting'

const log = debug('seata:heartbeat~')
// reference: NettyBasicConfig.java
const DEFAULT_WRITE_IDLE_SECONDS = 5_000

export class SeataHeartBeat extends AbstractSeataRemoting {
  private readonly heartBeatTimer: NodeJS.Timer
  private lastActivityTime: number

  constructor(transport: Socket) {
    super(transport)
    this.lastActivityTime = 0

    // init transport
    this.transport.on('data', () => {
      this.lastActivityTime = Date.now()
    })

    // init heartbeat timer
    this.heartBeatTimer = setInterval(
      this.handleHeartBeat,
      DEFAULT_WRITE_IDLE_SECONDS,
    )
  }

  setLastActivityTime(lastActivityTime: number) {
    this.lastActivityTime = lastActivityTime
  }

  /**
   * handle heartbeat
   */
  handleHeartBeat = () => {
    const now = Date.now()
    if (now - this.lastActivityTime > DEFAULT_WRITE_IDLE_SECONDS) {
      this.send(HeartbeatMessage.PING)
      this.lastActivityTime = now
    }
  }

  /**
   * receive heartbeat response message
   */
  receive() {
    this.lastActivityTime = Date.now()
    log(`receive heartbeat pong`)
  }

  destroy() {
    clearInterval(this.heartBeatTimer)
    this.transport = null as unknown as Socket
    this.lastActivityTime = 0
  }
}
