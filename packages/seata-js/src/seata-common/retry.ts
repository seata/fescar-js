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
import { noop } from './util'

const MAX_RETRIES = 10
const dlog = debug('seata-common:retry~')

export interface RetryProps {
  initialDelay?: number
  period?: number
  maxRetry?: number
  onFailedEnd?: Function
  run: (onSuccess: Function, onFailed: Function) => void
}

export class Retry {
  private retryTime: number
  private readonly initialDelay: number
  private readonly period: number
  private readonly maxRetryCount: number

  private run: (onSuccess: Function, onFailed: Function) => void
  private onFailedEnd: Function

  static from(props: RetryProps) {
    return new Retry(props)
  }

  constructor(props: RetryProps) {
    this.maxRetryCount = props.maxRetry || MAX_RETRIES
    this.retryTime = this.maxRetryCount

    this.initialDelay = props.initialDelay || 0
    this.period = props.period || 1000

    dlog(`init props: %j`, {
      initialDelay: this.initialDelay,
      period: this.period,
      maxRetry: this.maxRetryCount,
    })

    this.run = props.run
    this.onFailedEnd = props.onFailedEnd || noop
  }

  start() {
    dlog(`starting retry, current retry num:%d`, this.retryTime)

    // first run
    if (this.retryTime === this.maxRetryCount) {
      setTimeout(() => {
        this.run(this.onSuccess, this.onFailed)
        this.retryTime--
      }, this.initialDelay)
      return
    }

    // stop retry
    if (this.retryTime === 0) {
      this.onFailedEnd()
      return
    }

    // retry
    setTimeout(() => {
      this.run(this.onSuccess, this.onFailed)
      this.retryTime--
    }, this.period)
  }

  reset() {
    dlog('reset')
    this.retryTime = this.maxRetryCount
  }

  private onSuccess() {
    this.reset()
  }

  private onFailed() {
    this.start()
  }
}
