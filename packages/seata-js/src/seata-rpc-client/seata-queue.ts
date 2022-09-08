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

import debug from 'debug'
import { noop } from '../seata-common/util'
import config from '../seata-config/config'
import { RpcMessage } from '../seata-protocol/rpc-message'
import { SeataContext } from './seata-context'

// init log
const log = debug('seata:rpc:seata-queue')

export type SeataQueueId = number
export type SeataRpcResponse = {
  err: Error | null
  res: any
}
export type SeataQueueSubscribe = (id: SeataQueueId, msg: SeataContext) => void

/**
 * seata-rpc-queue
 */
export class SeataQueue {
  private subscriber: SeataQueueSubscribe
  private readonly queue: Map<SeataQueueId, SeataContext>

  constructor() {
    this.queue = new Map()
    this.subscriber = noop
  }

  /**
   * push message to queue
   * @param msg
   * @returns
   */
  push = <T>(msg: RpcMessage): Promise<T> => {
    return new Promise((resolve, reject) => {
      const ctx = new SeataContext(msg, resolve, reject, 'WAITING')
      const id = ctx.id

      // set max timeout handle
      ctx.setMaxTimeout(() => {
        log('request %d timeout', id)
        this.clear(id)
        reject(
          new Error(`request ${id} timeout with ${config.MAX_REQ_TIME_OUT}ms`),
        )
      })

      // add queue
      this.queue.set(id, ctx)
      // notify subscriber
      this.subscriber(id, ctx)
    })
  }

  /**
   * consume queue
   * @param id req id
   * @param param
   * @returns
   */
  consume(id: SeataQueueId, { err, res }: SeataRpcResponse) {
    log(`get ctx by request id %d`, id)
    // get ctx by request id
    const ctx = this.queue.get(id)

    // check ctx
    if (!ctx) {
      log(`ctx not found by request id %d`, id)
      return
    }

    // clear timeout
    ctx.clearTimeout()
    // clear queue
    this.clear(id)
    // resolve or reject
    if (err) {
      ctx.reject(err)
    } else {
      ctx.resolve(res)
    }
  }

  /**
   * clear queue
   * @param id req id
   */
  clear(id: SeataQueueId) {
    log('clear queue %d', id)
    this.queue.delete(id)
  }

  /**
   * subscribe queue
   * @param subscribe
   * @returns
   */
  subscribe(subscribe: SeataQueueSubscribe) {
    this.subscriber = subscribe
    return this
  }

  /**
   * current queue is wether empty or not
   * @returns boolean
   */
  isEmpty() {
    return this.size() === 0
  }

  /**
   * get current queue size
   * @returns number
   */
  size() {
    return !this.queue ? 0 : this.queue.size
  }
}
