import { CompressorType } from './compressor'
import { Bzip2Compressor } from './compressor-bzip2'
import { DeflaterCompressor } from './compressor-deflater'
import { GzipCompressor } from './compressor-gzip'

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

export class CompressorFactory {
  private static compressorMap = {
    [CompressorType[CompressorType.BZIP2]!]: new Bzip2Compressor(),
    [CompressorType[CompressorType.DEFLATER]!]: new DeflaterCompressor(),
    [CompressorType[CompressorType.GZIP]!]: new GzipCompressor()
  }

  static getCompressor(t: CompressorType) {
    const compressor = CompressorFactory.compressorMap[t]
    if (compressor === undefined) {
      throw new Error(`Could not find compressor with ${t}`)
    }
    return compressor
  }
}
