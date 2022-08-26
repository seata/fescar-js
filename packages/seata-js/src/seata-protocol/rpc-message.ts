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

import prot from './protocol-constants'
import { HeartbeatMessage } from './heartbeat-message'

export class RpcMessage {
  private id: number
  private messageType: number
  private codec: number
  private compressor: number
  private headMap: Map<string, string>
  private body: Object | null

  constructor() {
    this.id = 0
    this.messageType = 0
    this.codec = 0
    this.compressor = 0
    this.headMap = new Map()
    this.body = null
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~ getter && setter ~~~~~~~~~~~~~~~~~~~~~~~
  getId() {
    return this.id
  }

  setId(id: number) {
    this.id = id
    return this
  }

  getMessageType() {
    return this.messageType
  }

  setMessageType(messageType: number) {
    this.messageType = messageType
    return this
  }

  getCodec() {
    return this.codec
  }

  setCodec(codec: number) {
    this.codec = codec
    return this
  }

  getCompressor() {
    return this.compressor
  }

  setCompressor(compressor: number) {
    this.compressor = compressor
    return this
  }

  getHeadMap() {
    return this.headMap
  }

  setHeadMap(headMap: Map<string, string>) {
    this.headMap = headMap
    return this
  }

  getBody() {
    return this.body
  }

  setBody(body: Object) {
    this.body = body
    return this
  }

  isHeartBeatType() {
    return (
      this.messageType === prot.MSGTYPE_HEARTBEAT_REQUEST ||
      this.messageType === prot.MSGTYPE_HEARTBEAT_RESPONSE
    )
  }

  isHeartBeat() {
    return this.getBody() === HeartbeatMessage.PONG
  }
}
