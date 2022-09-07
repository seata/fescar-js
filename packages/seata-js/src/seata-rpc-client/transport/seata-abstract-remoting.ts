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

import { genNextId } from '../seata-id'
import prot from '../../seata-protocol/protocol-constants'
import { RpcMessage } from '../../seata-protocol/rpc-message'
import { Socket } from 'net'
import { HeartbeatMessage } from '../../seata-protocol/heartbeat-message'
import { ProtocolV1Encoder } from '../v1/protocol-v1-encoder'

export default class AbstractSeataRemoting {
  protected transport: Socket

  constructor(transport: Socket) {
    this.transport = transport
  }

  protected buildRequestMessage(msg: Object, messageType: number) {
    const rpcMessage = new RpcMessage()
    rpcMessage.setId(genNextId())
    rpcMessage.setMessageType(messageType)
    rpcMessage.setCodec(prot.CONFIGURED_CODEC)
    rpcMessage.setCompressor(prot.CONFIGURED_COMPRESSOR)
    rpcMessage.setBody(msg)
    return rpcMessage
  }

  protected buildResponseMessage(
    rpcMessage: RpcMessage,
    msg: Object,
    messageType: number,
  ) {
    const rpcMsg = new RpcMessage()
    rpcMsg.setMessageType(messageType)
    rpcMsg.setCodec(rpcMessage.getCodec()) // same with request
    rpcMsg.setCompressor(rpcMessage.getCompressor())
    rpcMsg.setBody(msg)
    rpcMsg.setId(rpcMessage.getId())
    return rpcMsg
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
