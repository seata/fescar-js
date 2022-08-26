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

import { isEmptyMap, isNil } from '../../seata-common/util'
import ByteBuffer from '../../seata-common/byte-buffer'

export class HeadMapSerializer {
  static encode(map: Map<string, string>, buff: ByteBuffer) {
    // check map
    if (isEmptyMap(map)) {
      return 0
    }

    const start = buff.getOffset()
    for (let [k, v] of map) {
      if (!isNil(k)) {
        HeadMapSerializer.writeString(buff, k)
        HeadMapSerializer.writeString(buff, v)
      }
    }
    return buff.getOffset() - start
  }

  static decode(buff: ByteBuffer, len: number): Map<string, string> {
    const map = new Map<string, string>()
    if (isNil(buff) || buff.getOffset() === buff.getLength() || len <= 0) {
      return map
    }
    const start = buff.getOffset()

    while (buff.getOffset() - start < len) {
      const k = HeadMapSerializer.readString(buff)
      const v = HeadMapSerializer.readString(buff)
      if (!isNil(k)) {
        map.set(k, v)
      }
    }

    return map
  }

  private static writeString(out: ByteBuffer, str: string) {
    if (str == null) {
      out.writeShort(-1)
    } else if (str.length === 0) {
      out.writeShort(0)
    } else {
      const bs = Buffer.from(str, 'utf8')
      out.writeShort(bs.length)
      out.writeBytes(bs)
    }
  }

  private static readString(buf: ByteBuffer) {
    const len = buf.readShort()
    if (len <= 0) {
      return ''
    } else {
      return buf.readBytes({ len }).toString('utf8')
    }
  }
}
