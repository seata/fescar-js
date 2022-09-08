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
import { genNextId } from '../seata-id'
import prot from '../../seata-protocol/protocol-constants'
import { RpcMessage } from '../../seata-protocol/rpc-message'
import { ProtocolV1Encoder } from '../v1/protocol-v1-encoder'
import { HeartbeatMessage } from '../../seata-protocol/heartbeat-message'

export default abstract class AbstractSeataRemoting {
  protected transport: Socket

  constructor(transport: Socket) {
    this.transport = transport
  }

  protected buildRequestMessage(msg: Object, messageType: number) {
    return new RpcMessage()
      .setId(genNextId())
      .setMessageType(messageType)
      .setCodec(prot.CONFIGURED_CODEC)
      .setCompressor(prot.CONFIGURED_COMPRESSOR)
      .setBody(msg)
  }

  protected buildResponseMessage(
    rpcMessage: RpcMessage,
    msg: Object,
    messageType: number,
  ) {
    return new RpcMessage()
      .setMessageType(messageType)
      .setCodec(rpcMessage.getCodec()) // same with request
      .setCompressor(rpcMessage.getCompressor())
      .setBody(msg)
      .setId(rpcMessage.getId())
  }

  protected send(msg: Object) {
    if (!this.transport) {
      return
    }

    const rpcMessage = this.buildRequestMessage(
      msg,
      msg instanceof HeartbeatMessage
        ? prot.MSGTYPE_HEARTBEAT_REQUEST
        : prot.MSGTYPE_RESQUEST_ONEWAY,
    )
    // if (rpcMessage.getBody() instanceof MergeMessage) {
    //     mergeMsgMap.put(rpcMessage.getId(), (MergeMessage) rpcMessage.getBody());
    // }
    this.transport.write(ProtocolV1Encoder.encode(rpcMessage))
  }
}
