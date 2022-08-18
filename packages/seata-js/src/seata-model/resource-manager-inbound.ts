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

export interface ResourceManagerInbound {
  /**
   * Commit a branch transaction.
   *
   * @param branchType      the branch type
   * @param xid             Transaction id.
   * @param branchId        Branch id.
   * @param resourceId      Resource id.
   * @param applicationData Application data bind with this branch.
   * @return Status of the branch after committing.
   */
  branchCommit(
    branchType: BranchType,
    xid: string,
    branchId: number,
    resourceId: string,
    applicationData: string
  ): Promise<BranchStatus>

  /**
   * Rollback a branch transaction.
   *
   * @param branchType      the branch type
   * @param xid             Transaction id.
   * @param branchId        Branch id.
   * @param resourceId      Resource id.
   * @param applicationData Application data bind with this branch.
   * @return Status of the branch after rollbacking.
   */
  branchRollback(
    branchType: BranchType,
    xid: string,
    branchId: number,
    resourceId: string,
    applicationData: string
  ): Promise<BranchStatus>
}
