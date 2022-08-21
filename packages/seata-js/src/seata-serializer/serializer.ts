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

export interface Serializer {
  /**
   * encode T to bytes
   * @param obj
   */
  serialize<T>(obj: T): Buffer

  /**
   * decode bytes to Te
   * @param buf
   */
  deserialize<T>(buf: Buffer): T
}

export enum SerializerType {
  /**
   * The seata.
   * <p>
   * Math.pow=2, 0
   */
  SEATA = 0x1,

  /**
   * The protobuf, 'io.seata:seata-serializer-protobuf' dependency must be referenced manually.
   * <p>
   * Math.pow=2, 1
   */
  PROTOBUF = 0x2,

  /**
   * The kryo.
   * <p>
   * Math.pow=2, 2
   */
  KRYO = 0x4,

  /**
   * The fst.
   * <p>
   * Math.pow=2, 3
   */
  FST = 0x8,

  /**
   * The hessian.
   * <p>
   * Math.pow=2, 4
   */
  HESSIAN = 0x16,
}
