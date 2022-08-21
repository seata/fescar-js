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

import { MessageType } from './message-type'

export class HeartbeatMessage {
  /**
   * The constant PING.
   */
  static PING: HeartbeatMessage = new HeartbeatMessage(true)
  /**
   * The constant PONG.
   */
  static PONG: HeartbeatMessage = new HeartbeatMessage(false)

  private ping: boolean = true

  private constructor(ping: boolean) {
    this.ping = ping
  }

  getTypeCode() {
    return MessageType.TYPE_HEARTBEAT_MSG
  }

  isPing() {
    return this.ping
  }

  setPing(ping: boolean) {
    this.ping = ping
  }

  toString() {
    return this.ping ? 'services ping' : 'services pong'
  }
}
