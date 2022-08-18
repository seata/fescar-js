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

import { BranchStatus } from './branch-status'
import { BranchType } from './branch-type'

export interface ResourceManagerOutbound {
  /**
   * Branch register number.
   *
   * @param branchType the branch type
   * @param resourceId the resource id
   * @param clientId   the client id
   * @param xid        the xid
   * @param applicationData the context
   * @param lockKeys   the lock keys
   * @return the number
   */
  branchRegister(
    branchType: BranchType,
    resourceId: string,
    clientId: string,
    xid: string,
    applicationData: string,
    lockKeys: string
  ): Promise<number>

  /**
   * Branch report.
   *
   * @param branchType      the branch type
   * @param xid             the xid
   * @param branchId        the branch id
   * @param status          the status
   * @param applicationData the application data
   */
  branchReport(
    branchType: BranchType,
    xid: string,
    branchId: number,
    status: BranchStatus,
    applicationData: string
  ): Promise<void>

  /**
   * Lock query boolean.
   *
   * @param branchType the branch type
   * @param resourceId the resource id
   * @param xid        the xid
   * @param lockKeys   the lock keys
   * @return the boolean
   */
  lockQuery(
    branchType: BranchType,
    resourceId: string,
    xid: string,
    lockKeys: string
  ): Promise<boolean>
}
