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

const HEART_BEAT = 30000

export class SeataHeartBeat {
  private transport: Socket
  private lastActivityTime: number
  private heartBeatTimer: NodeJS.Timer

  constructor(transport: Socket) {
    this.lastActivityTime = 0

    this.transport = transport
    this.transport.on('data', () => {
      this.lastActivityTime = Date.now()
    })

    this.heartBeatTimer = setInterval(this.manageHeartBeat, HEART_BEAT)
  }

  setLastActivityTime(lastActivityTime: number) {
    this.lastActivityTime = lastActivityTime
  }

  manageHeartBeat = () => {
    const now = Date.now()
    if (now - this.lastActivityTime > HEART_BEAT) {
      this.send()
    }
  }

  /**
   * send heartbeat message
   */
  async send(): Promise<void> {
    this.lastActivityTime = Date.now()
  }

  /**
   * receive heartbeat response message
   */
  async receive(): Promise<void> {
    this.lastActivityTime = Date.now()
  }

  /**
   * encode heartbeat message
   */
  encode() {}

  destroy() {
    clearInterval(this.heartBeatTimer)
    this.transport = null as unknown as Socket
    this.lastActivityTime = -1
  }
}
