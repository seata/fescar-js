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

import ByteBuffer from './byte-buffer'

describe('byte buffer test suite', () => {
  it('test write some thing..', () => {
    const buf = new ByteBuffer()
      .addByte(10)
      .addShort(0xdada)
      .addInt(0x01010101)
      .buffer()

    expect(buf.length).toEqual(7)
  })

  it('test write custom offset', () => {
    const buf = new ByteBuffer()
      .addBytes(Buffer.from('123'))
      .addByte(10, 10)
      .addByte(9, 8)
      .addString('abc')
      .addBytes(Buffer.alloc(5).fill(1), 0)
      .buffer()
    expect(buf.length).toEqual(19)
    expect(buf.subarray(11, 14).toString()).toEqual('abc')
    expect(buf[8]).toEqual(9)
  })

  it('test custom default alloc size', () => {
    const buf = new ByteBuffer({ defaultAllocSize: 5 })
    expect((buf as any).capacity).toEqual(5)
    buf.addString(`abcdefg`)
    // expand default alloc size
    expect((buf as any).capacity).toEqual(10)
    buf.addString(`hijklmnoprst`)
    // expand Offset - this.capacity
    expect((buf as any).capacity).toEqual(19)
  })
})
