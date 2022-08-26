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
  buffer?: Buffer
  defaultAllocSize?: number
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
  private length: number
  private capacity: number

  private readonly defaultAllocSize: number

  /**
   * constructor
   *
   * @param prop
   */
  constructor(prop?: ByteBufferProp) {
    prop ||= {}

    this.defaultAllocSize = prop.defaultAllocSize || DEFAULT_ALLOC_SIZE

    if (prop.buffer) {
      this.buff = prop.buffer

      this.offset = 0
      this.length = this.buff.length
      this.capacity = Math.max(this.buff.length, this.defaultAllocSize)
    } else {
      this.buff = Buffer.alloc(this.defaultAllocSize)

      this.offset = 0
      this.length = 0
      this.capacity = this.defaultAllocSize
    }
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

    this.offset = next
    if (next > this.length) {
      this.length = next
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
    this.offset += 1

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

    this.offset = next
    if (next > this.length) {
      this.length = next
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

    this.offset += 2

    return val
  }

  /**
   * add four bytes to buffer
   * @param val number
   * @param prop
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

    this.offset = next
    if (next > this.length) {
      this.length = next
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

    this.offset += 4

    return val
  }

  /**
   * add bytes to buffer
   * @param val
   * @param prop
   * @returns
   */
  writeBytes(val: Buffer, prop?: ReadWriteProp) {
    const opt = this.defaultReadWriteProp(prop)
    const next = opt.offset + val.length

    this.checkCapacity(next)
    val.copy(this.buff, opt.offset, 0)

    this.offset = next
    if (next > this.length) {
      this.length = next
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

    this.offset = readEnd

    return val
  }

  /**
   * add string to buffer
   * @param val
   * @param prop
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
   * get val index
   *
   * @param val
   */
  indexOf(val: number) {
    return this.buff.indexOf(val)
  }

  /**
   * slice buffer
   * @param start
   * @param end
   */
  slice(start: number, end?: number) {
    return this.buff.subarray(start, end)
  }

  splice(start: number, end?: number) {
    end ||= this.length
    if (end > this.capacity) {
      end = this.capacity
    }

    const val = this.buff.subarray(start, end)
    this.buff = Buffer.concat([
      this.buff.subarray(0, start),
      this.buff.subarray(end, this.capacity),
    ])
    this.length -= end - start
    this.offset = start

    return val
  }

  /**
   * get buffer
   *
   * @returns buffer
   */
  buffer() {
    return this.buff.subarray(0, this.length)
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
   * set offset
   */
  resetOffset(offset?: number) {
    this.offset = offset || 0
    return this
  }

  /**
   * current buffer write length
   * @returns length
   */
  getLength() {
    return this.length
  }

  /**
   * buffer capacity
   *
   * @returns total buffer length
   */
  getCapacity() {
    return this.capacity
  }

  /**
   * set default read write prop
   *
   * @param prop
   * @returns
   */
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
}
