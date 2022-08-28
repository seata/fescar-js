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
import { RpcMessage } from '../seata-protocol/rpc-message'

export type SeataQueueId = number
export type SeataQueueSubscribe = (id: SeataQueueId, msg: RpcMessage) => void
export interface SeataQueueValue {
  msg: RpcMessage
  resolve: Function
  reject: Function
}

const log = debug('seata:rpc:seata-queue')

export class SeataQueue {
  private subscriber: SeataQueueSubscribe
  private readonly queue: Map<SeataQueueId, SeataQueueValue>

  constructor() {
    this.queue = new Map()
    this.subscriber = noop
  }

  async push(id: SeataQueueId, msg: RpcMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.set(id, { msg, resolve, reject })
      // TODO set max timeout
      this.subscriber(id, msg)
    })
  }

  consume(id: SeataQueueId) {
    this.queue.get(id)
  }

  clear(id: SeataQueueId) {
    log('clear queue %d', id)
    this.queue.delete(id)
  }

  subscribe(subscribe: SeataQueueSubscribe) {
    this.subscriber = subscribe
    return this
  }
}
