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

import { HessianSerializer } from './serializer-fst'
import { FstSerializer } from './serializer-hessian'
import { KryoSerializer } from './serializer-kryo'
import { ProtoBufSerializer } from './serializer-protobuf'
import { SeataSerializer } from './serializer-seata'
import { SerializerType } from './serializer'

export default class SerializerFactory {
  private static serialMapping = {
    [SerializerType[SerializerType.FST]!]: new FstSerializer(),
    [SerializerType[SerializerType.HESSIAN]!]: new HessianSerializer(),
    [SerializerType[SerializerType.KRYO]!]: new KryoSerializer(),
    [SerializerType[SerializerType.PROTOBUF]!]: new ProtoBufSerializer(),
    [SerializerType[SerializerType.SEATA]!]: new SeataSerializer()
  }

  static getSerializer(code: SerializerType) {
    const serializer = SerializerFactory.serialMapping[code]
    if (serializer === undefined) {
      throw new Error(`could not support serializer with ${code}`)
    }
    return serializer
  }
}
