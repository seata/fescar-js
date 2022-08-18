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

import { Buffer } from 'node:buffer'
import { RpcMessage } from '../../seata-protocol/rpc-message'
import prot from '../../seata-protocol/protocol-constants'
import SerializerFactory from '../../seata-serializer'

/**
 * <pre>
 * 0     1     2     3     4     5     6     7     8     9    10     11    12    13    14    15    16
 * +-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+-----+
 * |   magic   |Proto|     Full length       |    Head   | Msg |Seria|Compr|     RequestId         |
 * |   code    |colVer|    (head+body)      |   Length  |Type |lizer|ess  |                       |
 * +-----------+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
 * |                                                                                               |
 * |                                   Head Map [Optional]                                         |
 * +-----------+-----------+-----------+-----------+-----------+-----------+-----------+-----------+
 * |                                                                                               |
 * |                                         body                                                  |
 * |                                                                                               |
 * |                                        ... ...                                                |
 * +-----------------------------------------------------------------------------------------------+
 * </pre>
 * <p>
 * <li>Full Length: include all data </li>
 * <li>Head Length: include head data from magic code to head map. </li>
 * <li>Body Length: Full Length - Head Length</li>
 * </p>
 * https://github.com/seata/seata/issues/893
 */

export class ProtocolV1Encoder {
  encode(msg: RpcMessage) {
    // check msg type
    if (!(msg instanceof RpcMessage)) {
      throw new Error(`Not support this class:` + msg)
    }

    const msgType = msg.getMessageType()

    let offset = 0
    const buf = Buffer.alloc(1023)
    // write magic code
    offset += buf.writeUInt16BE(prot.MAGIC_CODE_S, offset)
    // write version
    offset += buf.writeInt8(prot.VERSION, offset)
    // full length
    // header length
    offset += buf.writeInt16BE(prot.V1_HEAD_LENGTH, offset)
    offset += buf.writeInt8(msgType, offset)
    // serializer
    offset += buf.writeInt8(msg.getCodec(), offset)
    // compress
    offset += buf.writeInt8(msg.getCompressor(), offset)
    // request id
    offset += buf.writeUInt32BE(msg.getId(), offset)

    // optional map
    const headMap = msg.getHeadMap()
    if (headMap != null && headMap.size > 0) {
      // write
    }

    // body exclude heartbeat request and response
    if (
      msgType != prot.MSGTYPE_HEARTBEAT_REQUEST &&
      msgType != prot.MSGTYPE_HEARTBEAT_RESPONSE
    ) {
      // serialize body
      const serializer = SerializerFactory[msg.getCodec()]
      const bytes = serializer?.serialize(msg.getBody())
      // Compressor compressor = CompressorFactory.getCompressor(rpcMessage.getCompressor());
      // bodyBytes = compressor.compress(bodyBytes);
    }
  }
}
