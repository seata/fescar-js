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

import { MessageType } from './message-type'
import { RegisterRMRequest } from './register-rm-request'

describe('test register rm request test suites', () => {
  it('get and set resource ids', () => {
    const req = new RegisterRMRequest()
    const resourceIds = 'r1,r2'
    req.setResourceIds(resourceIds)
    expect(resourceIds).toEqual(req.getResourceIds())
  })

  it('get type code', () => {
    const req = new RegisterRMRequest()
    expect(MessageType.TYPE_REG_RM).toEqual(req.getTypeCode())
  })

  it('build RegisterRMRequest', () => {
    const req = new RegisterRMRequest()
      .setResourceIds('r1,r2')
      .setApplicationId('app')
      .setExtraData('extra')
      .setTransactionServiceGroup('group')
      .setVersion('1')

    expect(JSON.stringify(req)).toEqual(
      JSON.stringify({
        version: '1',
        applicationId: 'app',
        transactionServiceGroup: 'group',
        extraData: 'extra',
        resourceIds: 'r1,r2',
      }),
    )
  })
})
