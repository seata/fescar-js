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
import { isNil } from '../../seata-common'

export interface ByteBufferProp {
  buffer?: Buffer
  defaultAllocSize?: number
  enableFollowRead?: boolean
}

export interface ReadWriteProp {
  offset?: number
  unsigned?: boolean
  endian?: 'LE' | 'BE'
  len?: number
}

const DEFAULT_ALLOC_SIZE = 1024

export default class ByteBuffer {
  private buff: Buffer

  private offset: number
  private capacity: number
  private defaultAllocSize: number
  private enableFollowRead: boolean

  /**
   * constructor
   *
   * @param prop
   */
  constructor(prop?: ByteBufferProp) {
    prop ||= {}

    this.defaultAllocSize = prop.defaultAllocSize || DEFAULT_ALLOC_SIZE
    this.enableFollowRead = Boolean(
      isNil(prop.enableFollowRead) ? true : prop.enableFollowRead,
    )

    if (prop.buffer) {
      this.buff = prop.buffer
      this.offset = this.buff.length
      this.capacity = this.buff.length
    } else {
      this.buff = Buffer.alloc(this.defaultAllocSize)
      this.offset = 0
      this.capacity = this.defaultAllocSize
    }
  }

  private defaultReadWriteProp(prop?: ReadWriteProp): Required<ReadWriteProp> {
    prop || (prop = {})

    prop.offset ||= this.offset
    prop.endian ||= 'BE'
    prop.unsigned ||= false
    prop.len ||= this.buff.length

    return prop as Required<ReadWriteProp>
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
   * @param val
   * @param prop
   * @returns
   */
  writeByte(val: number, prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)
    const next = opt.offset + 1
    this.checkCapacity(next)

    this.buff.writeUInt8(val, opt.offset)

    if (next > this.offset) {
      this.offset = next
    }

    return this
  }

  /**
   * read one byte from buffer
   * @param prop offset
   */
  readByte(prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)
    const val = this.buff.readUInt8(opt.offset)

    if (this.enableFollowRead) {
      this.offset += 1
    }

    return val
  }

  /**
   * add two bytes to buffer
   * @param val number
   * @param prop offset
   * @returns
   */
  writeShort(val: number, prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)
    const next = opt.offset + 2
    this.checkCapacity(next)

    if (opt.endian === 'BE') {
      opt.unsigned
        ? this.buff.writeInt16BE(val, opt.offset)
        : this.buff.writeUInt16BE(val, opt.offset)
    } else {
      opt.unsigned
        ? this.buff.writeInt16LE(val, opt.offset)
        : this.buff.writeUint16LE(val, opt.offset)
    }

    if (next > this.offset) {
      this.offset = next
    }

    return this
  }

  /**
   * read two byte and convert to unsigned short
   * @param prop offset
   * @returns
   */
  readShort(prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)

    let val
    if (opt.endian === 'BE') {
      val = opt.unsigned
        ? this.buff.readUInt16BE(opt.offset)
        : this.buff.readInt16BE(opt.offset)
    } else {
      val = opt.unsigned
        ? this.buff.readUint16LE(opt.offset)
        : this.buff.readInt16LE(opt.offset)
    }

    if (this.enableFollowRead) {
      this.offset += 2
    }

    return val
  }

  /**
   * add four bytes to buffer
   * @param val number
   * @returns
   */
  writeInt(val: number, prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)
    const next = opt.offset + 4
    this.checkCapacity(next)

    if (opt.endian === 'BE') {
      opt.unsigned
        ? this.buff.writeUInt32BE(val, opt.offset)
        : this.buff.writeInt32BE(val, opt.offset)
    } else {
      opt.unsigned
        ? this.buff.writeUInt32LE(val, opt.offset)
        : this.buff.writeInt32LE(val, opt.offset)
    }

    if (next > this.offset) {
      this.offset = next
    }

    return this
  }

  /**
   * read four bytes and convert to unsigned int
   * @returns
   */
  readInt(prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)

    let val

    if (opt.endian === 'BE') {
      val = opt.unsigned
        ? this.buff.readUInt32BE(opt.offset)
        : this.buff.readInt32BE(opt.offset)
    } else {
      val = opt.unsigned
        ? this.buff.readUInt32LE(opt.offset)
        : this.buff.readInt32LE(opt.offset)
    }

    if (this.enableFollowRead) {
      this.offset += 4
    }

    return val
  }

  /**
   * add bytes to buffer
   * @param val
   * @returns
   */
  writeBytes(val: Buffer, prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)
    const next = opt.offset + val.length

    this.checkCapacity(next)
    val.copy(this.buff, opt.offset, 0)

    if (next > this.offset) {
      this.offset = next
    }

    return this
  }

  /**
   * read bytes from buffer
   *
   * @returns
   */
  readBytes(prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)
    const readEnd = Math.min(opt.offset + opt.len, this.buff.length)
    const val = this.buff.subarray(opt.offset, readEnd)

    if (this.enableFollowRead) {
      this.offset = readEnd
    }

    return val
  }

  /**
   * add string to buffer
   * @param val
   * @returns
   */
  writeString(val: string, prop?: ReadWriteProp) {
    const buf = Buffer.from(val)
    return this.writeBytes(buf, prop)
  }

  /**
   * read string from buffer
   * @returns
   */
  readString(prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)
    const val = this.readBytes(opt)
    return val.toString()
  }

  /**
   * get buffer
   *
   * @returns buffer
   */
  buffer() {
    return this.buff.subarray(0, this.offset)
  }

  /**
   * offset
   *
   * @returns offset
   */
  getOffset() {
    return this.offset
  }

  /**
   * set offset = 0
   */
  resetOffset() {
    this.offset = 0
    return this
  }

  /**
   * is offset is end
   */
  isEnd() {
    return this.offset >= this.buff.length
  }
}
