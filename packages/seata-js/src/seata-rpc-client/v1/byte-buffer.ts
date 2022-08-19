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

export interface ByteBufferProp {
  defaultAllocSize?: number
}

const DEFAULT_ALLOC_SIZE = 1024

export default class ByteBuffer {
  private buff: Buffer

  private offset: number
  private capacity: number
  private defaultAllocSize: number

  /**
   * constructor
   * @param prop
   */
  constructor(prop?: ByteBufferProp) {
    prop ||= { defaultAllocSize: DEFAULT_ALLOC_SIZE }

    this.offset = 0
    this.defaultAllocSize = prop.defaultAllocSize!
    this.capacity = this.defaultAllocSize
    this.buff = Buffer.alloc(this.capacity)
  }

  /**
   * check capacity and auto expand capacity
   *
   * @param nextOffset
   * @returns
   */
  private checkCapacity(nextOffset: number) {
    if (nextOffset < this.capacity) {
      return
    }

    // expand capacity
    this.capacity += Math.max(nextOffset - this.capacity, this.defaultAllocSize)
    const buff = Buffer.alloc(this.capacity)
    this.buff.copy(buff, 0, 0, this.offset)
    this.buff = buff
  }

  /**
   * add one byte to buffer
   *
   * @param val
   * @param offset
   * @returns
   */
  addByte(val: number, offset?: number) {
    offset ||= this.offset
    const next = offset + 1

    this.checkCapacity(next)
    this.buff.writeUInt8(val, offset)

    if (next > this.offset) {
      this.offset = next
    }

    return this
  }

  /**
   * add two bytes to buffer
   *
   * @param val number
   * @param offset offset
   * @param endian 'big' | 'little'
   * @returns
   */
  addShort(val: number, offset?: number, endian: 'big' | 'little' = 'big') {
    offset ||= this.offset
    const next = offset + 2
    this.checkCapacity(next)

    const isSign = val >= -32768 && val <= 32767
    if (endian === 'big') {
      isSign
        ? this.buff.writeInt16BE(val, offset)
        : this.buff.writeUInt16BE(val, offset)
    } else {
      isSign
        ? this.buff.writeInt16LE(val, offset)
        : this.buff.writeUint16LE(val, offset)
    }

    if (next > this.offset) {
      this.offset = next
    }

    return this
  }

  /**
   * add four bytes to buffer
   *
   * @param val number
   * @param offset offset
   * @param endian 'big' | 'little'
   * @returns
   */
  addInt(val: number, offset?: number, endian: 'big' | 'little' = 'big') {
    offset ||= this.offset
    const next = offset + 4
    this.checkCapacity(next)

    const isSign = val >= -2147483648 && val <= 2147483647
    if (endian === 'big') {
      isSign
        ? this.buff.writeInt32BE(val, next)
        : this.buff.writeUInt32BE(val, next)
    } else {
      isSign
        ? this.buff.writeInt32LE(val, next)
        : this.buff.writeUint32LE(val, next)
    }

    if (next > this.offset) {
      this.offset = next
    }

    return this
  }

  /**
   * add bytes to buffer
   * @param val
   * @param offset
   * @returns
   */
  addBytes(val: Buffer, offset?: number) {
    offset ||= this.offset
    const next = offset + val.length

    this.checkCapacity(next)
    val.copy(this.buff, offset, 0)

    if (next > this.offset) {
      this.offset = next
    }

    return this
  }

  /**
   * add string to buffer
   * @param val
   * @param offset
   * @returns
   */
  addString(val: string, offset?: number) {
    const buf = Buffer.from(val)

    offset ||= this.offset
    const next = offset + buf.length
    this.checkCapacity(next)
    buf.copy(this.buff, offset, 0)

    if (next > this.offset) {
      this.offset = next
    }

    return this
  }

  /**
   * get buffer
   *
   * @returns buffer
   */
  buffer() {
    return this.buff.subarray(0, this.offset)
  }
}
