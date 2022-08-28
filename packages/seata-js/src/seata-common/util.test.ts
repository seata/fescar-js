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

import { isEmptyMap, isNil, sleep } from './util'

describe('util test suites', () => {
  it('test isEmptyMap', () => {
    expect(isEmptyMap(new Map())).toBe(true)
    expect(isEmptyMap(new Map([['a', 'b']]))).toBe(false)
    expect(isEmptyMap(undefined as unknown as Map<any, any>)).toBe(true)
    expect(isEmptyMap(null as unknown as Map<any, any>)).toBe(true)
  })

  it('test isNil', () => {
    expect(isNil(undefined)).toBe(true)
    expect(isNil(null)).toBe(true)
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
    expect(isNil([])).toBe(false)
    expect(isNil({})).toBe(false)
  })

  it('test sleep', async () => {
    const start = Date.now()
    await sleep()
    const end = Date.now()
    expect(end - start < 1005).toEqual(true)
  })
})
