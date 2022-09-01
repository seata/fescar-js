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

export type SeataReqStatus = 'WAITING' | 'SENDED'

export class SeataContext {
  public readonly msg: RpcMessage
  public readonly resolve: Function
  public readonly reject: Function
  public status: SeataReqStatus

  private timeoutManager!: NodeJS.Timeout

  constructor(
    msg: RpcMessage,
    resolve: Function,
    reject: Function,
    status: SeataReqStatus,
  ) {
    this.msg = msg
    this.resolve = resolve
    this.reject = reject
    this.status = status
  }

  get id() {
    return this.msg.getId()
  }

  setMaxTimeout(cb: Function) {
    this.timeoutManager = setTimeout(() => cb(), config.MAX_REQ_TIME_OUT)
    return this
  }

  clearTimeout() {
    clearTimeout(this.timeoutManager)
    return this
  }
}
