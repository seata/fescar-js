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
import { RpcMessage } from '../../seata-protocol/rpc-message'
import prot from '../../seata-protocol/protocol-constants'
import SerializerFactory from '../../seata-serializer'
import { CompressorFactory } from '../../seata-compressor'
import { HeadMapSerializer } from './headmap-serializer'

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

const log = debug(`seata:prot:v1:encoder`)

export class ProtocolV1Encoder {
  static encode(msg: RpcMessage) {
    log(`encode rpc message %j`, msg)
    // check msg type
    if (!(msg instanceof RpcMessage)) {
      throw new Error(`Not support this class:` + msg)
    }

    let headLength = prot.V1_HEAD_LENGTH

    const buff = new ByteBuffer()
      .writeShort(prot.MAGIC_CODE_S)
      .writeByte(prot.VERSION)
      // place hold full length,it will fix in the end
      .writeInt(0)
      // place hold head length,it will fix in the end
      .writeShort(0)
      .writeByte(msg.getMessageType())
      .writeByte(msg.getCodec())
      .writeByte(msg.getCompressor())
      .writeInt(msg.getId())

    // optional map
    headLength += HeadMapSerializer.encode(msg.getHeadMap(), buff)

    // body exclude heartbeat request and response
    // heartbeat no body
    if (!msg.isHeartBeatType()) {
      // serialize body
      const serializer = SerializerFactory.getSerializer(msg.getCodec())
      let body = serializer.serialize(msg.getBody())
      const compressor = CompressorFactory.getCompressor(msg.getCompressor())
      body = compressor.compress(body)
      buff.writeBytes(body)
    }

    // write head length and full length
    log(`write head length: ${headLength} and full length: ${buff.getLength()}`)
    // fixed full length
    buff.writeInt(buff.getLength(), { index: 3, unsigned: true })
    // fixed head length
    buff.writeShort(headLength, { index: 7, unsigned: true })

    return buff.buffer()
  }
}
