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

import { CompressorType } from '../../seata-compressor/compressor'
import { SerializerType } from '../../seata-serializer/serializer'
import { RpcMessage } from '../../seata-protocol/rpc-message'
import { ProtocolV1Encoder } from './protocol-v1-encoder'

describe(`test protocol v1 encoder`, () => {
  it(`test encode rpc message`, () => {
    const msg = new RpcMessage()
      .setId(12345)
      .setMessageType(1)
      .setCodec(SerializerType.HESSIAN)
      .setCompressor(CompressorType.NONE)
      .setHeadMap(
        new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
        ]),
      )
      .setBody({ body: 'body' })
    const buffer = ProtocolV1Encoder.encode(msg)
    expect(buffer).toBeTruthy()
  })
})
