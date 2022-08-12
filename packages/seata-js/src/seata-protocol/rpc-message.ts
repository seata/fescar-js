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
  }

  getMessageType() {
    return this.messageType
  }

  setMessageType(messageType: number) {
    this.messageType = messageType
  }

  getCodec() {
    return this.codec
  }

  setCodec(codec: number) {
    this.codec = codec
  }

  getCompressor() {
    return this.compressor
  }

  setCompressor(compressor: number) {
    this.compressor = compressor
  }

  getHeadMap() {
    return this.headMap
  }

  setHeadMap(headMap: Map<string, string>) {
    this.headMap = headMap
  }

  getBody() {
    return this.body
  }

  setBody(body: Object) {
    this.body = body
  }
}
