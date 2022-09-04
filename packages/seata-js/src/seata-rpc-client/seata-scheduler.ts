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
import { SeataQueue } from './seata-queue'

const log = debug(`seata:rpc:scheduler`)

export class SeataScheduler {
  private queue: SeataQueue

  constructor(tcServers: Set<string>, queue: SeataQueue) {
    // init seata-cluster
    log(`init scheduler with: %s`, [...tcServers])

    this.queue = queue.subscribe((ctx) => {
      console.log(ctx)
    })
  }

  updateTcServers(tcServers: Set<string>) {
    console.log(tcServers)
  }
}
