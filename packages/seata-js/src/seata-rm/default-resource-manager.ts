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

import { BranchStatus } from '../seata-model/branch-status'
import { BranchType } from '../seata-model/branch-type'
import { Resource } from '../seata-model/resouce'
import { ResourceManager } from '../seata-model/resource-manager'

export class DefaultResourceManager implements ResourceManager {
  registerResource(resource: Resource): Promise<void> {
    throw new Error('Method not implemented.')
  }

  unregisterResource(resource: Resource): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getManagedResources(): Promise<Map<String, Resource>> {
    throw new Error('Method not implemented.')
  }

  getBranchType(): Promise<BranchType> {
    throw new Error('Method not implemented.')
  }

  branchCommit(
    branchType: BranchType,
    xid: string,
    branchId: number,
    resourceId: string,
    applicationData: string,
  ): Promise<BranchStatus> {
    throw new Error('Method not implemented.')
  }

  branchRollback(
    branchType: BranchType,
    xid: string,
    branchId: number,
    resourceId: string,
    applicationData: string,
  ): Promise<BranchStatus> {
    throw new Error('Method not implemented.')
  }

  branchRegister(
    branchType: BranchType,
    resourceId: string,
    clientId: string,
    xid: string,
    applicationData: string,
    lockKeys: string,
  ): Promise<number> {
    throw new Error('Method not implemented.')
  }

  branchReport(
    branchType: BranchType,
    xid: string,
    branchId: number,
    status: BranchStatus,
    applicationData: string,
  ): Promise<void> {
    throw new Error('Method not implemented.')
  }

  lockQuery(
    branchType: BranchType,
    resourceId: string,
    xid: string,
    lockKeys: string,
  ): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
