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

import config from '../seata-config/config'
import { RpcMessage } from '../seata-protocol/rpc-message'
import { SeataQueue } from './seata-queue'

describe('seata queue test suites', () => {
  // set max req timeout
  config.MAX_REQ_TIME_OUT = 100

  it('test queue with 100ms timeout', async () => {
    const queue = new SeataQueue()

    try {
      const msg = new RpcMessage().setId(1).setBody('hello world')
      await queue.push(msg)
    } catch (err) {
      expect((err as Error).message).toEqual(`request 1 timeout with 100ms`)
    }
    expect(queue.isEmpty()).toBeTruthy()
    expect(queue.size()).toBe(0)
  })

  it('test queue with resolve', async () => {
    const response = { err: null, res: 'ok' }
    const queue = new SeataQueue()
    const msg = new RpcMessage().setId(1).setBody('hello world')

    queue.subscribe((id, ctx) => {
      expect(id).toEqual(ctx.msg.getId())
      expect(ctx.msg).toEqual(msg)
      setTimeout(() => {
        queue.consume(id, response)
      }, 10)
    })

    const res = await queue.push(msg)
    expect(res).toEqual(response.res)
    expect(queue.isEmpty()).toBeTruthy()
    expect(queue.size()).toBe(0)
  })

  it('test queue with resolve', async () => {
    const response = { err: Error(`failed`), res: null }
    const queue = new SeataQueue()
    const msg = new RpcMessage().setId(1).setBody('hello world')

    queue.subscribe((id, ctx) => {
      expect(id).toEqual(ctx.msg.getId())
      expect(ctx.msg).toEqual(msg)
      setTimeout(() => {
        queue.consume(id, response)
      }, 10)
    })

    const err = await queue.push(msg).catch((err) => err)
    expect(err).toEqual(response.err)
    expect(queue.isEmpty()).toBeTruthy()
    expect(queue.size()).toBe(0)
  })
})
