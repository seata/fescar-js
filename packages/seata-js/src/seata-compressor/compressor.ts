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

export interface Compressor {
  /**
   * compress byte[] to byte[].
   * @param bytes the bytes
   * @return the byte[]
   */
  compress(bytes: Buffer): Buffer

  /**
   * decompress byte[] to byte[].
   * @param bytes the bytes
   * @return the byte[]
   */
  decompress(bytes: Buffer): Buffer
}

export enum CompressorType {
  /**
   * Not compress
   */
  NONE = 0,

  /**
   * The gzip.
   */
  GZIP = 1,

  /**
   * The zip.
   */
  ZIP = 2,

  /**
   * The sevenz.
   */
  SEVENZ = 3,

  /**
   * The bzip2.
   */
  BZIP2 = 4,

  /**
   * The lz4.
   */
  LZ4 = 5,

  /**
   * The deflater.
   */
  DEFLATER = 6,

  /**
   * The zstd.
   */
  ZSTD = 7,
}
