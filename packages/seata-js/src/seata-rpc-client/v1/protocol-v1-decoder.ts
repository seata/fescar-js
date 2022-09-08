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

import debug from 'debug'
import ByteBuffer from '../../seata-common/byte-buffer'
import prot from '../../seata-protocol/protocol-constants'
import { RpcMessage } from '../../seata-protocol/rpc-message'
import { HeadMapSerializer } from './headmap-serializer'
import { HeartbeatMessage } from '../../seata-protocol/heartbeat-message'
import { CompressorFactory } from '../../seata-compressor'
import SerializerFactory from '../../seata-serializer'

const log = debug(`prot:v1:decoder`)

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

export class ProtocolV1Decoder {
  static decode(buffer: Buffer) {
    const frame = new ByteBuffer({ buffer })

    // read magic
    const magic = frame.readShort({ unsigned: true })
    if (magic !== prot.MAGIC_CODE_S) {
      throw new Error('Unknown magic code: ' + magic)
    }

    const version = frame.readByte()
    // TODO version check
    log('protocol version: %d', version)

    const fullLength = frame.readInt({ unsigned: true })
    const headLength = frame.readShort({ unsigned: true })
    const messageType = frame.readByte()
    const codecType = frame.readByte()
    const compressorType = frame.readByte()
    const requestId = frame.readInt({ unsigned: true })

    const msg = new RpcMessage()
      .setMessageType(messageType)
      .setCodec(codecType)
      .setCompressor(compressorType)
      .setId(requestId)

    // head map
    const headMapLen = headLength - prot.V1_HEAD_LENGTH
    if (headMapLen > 0) {
      const headMap = HeadMapSerializer.decode(frame, headMapLen)
      msg.setHeadMap(headMap)
    }

    // body
    if (messageType === prot.MSGTYPE_HEARTBEAT_REQUEST) {
      msg.setBody(HeartbeatMessage.PING)
    } else if (messageType === prot.MSGTYPE_HEARTBEAT_RESPONSE) {
      msg.setBody(HeartbeatMessage.PONG)
    } else {
      const len = fullLength - headLength
      let body = CompressorFactory.getCompressor(compressorType).decompress(
        frame.readBytes({ len }),
      )
      msg.setBody(SerializerFactory.getSerializer(codecType).deserialize(body))
    }

    return msg
  }
}
