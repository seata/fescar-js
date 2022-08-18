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

import { BranchType } from './branch-type'
import { Resource } from './resouce'
import { ResourceManagerInbound } from './resource-manager-inbound'
import { ResourceManagerOutbound } from './resource-manager-outbound'

export interface ResourceManager
  extends ResourceManagerInbound,
    ResourceManagerOutbound {
  /**
   * Register a Resource to be managed by Resource Manager.
   *
   * @param resource The resource to be managed.
   */
  registerResource(resource: Resource): Promise<void>

  /**
   * Unregister a Resource from the Resource Manager.
   *
   * @param resource The resource to be removed.
   */
  unregisterResource(resource: Resource): Promise<void>

  /**
   * Get all resources managed by this manager.
   *
   * @return resourceId -- Resource Map
   */
  getManagedResources(): Promise<Map<String, Resource>>

  /**
   * Get the BranchType.
   *
   * @return The BranchType of ResourceManager.
   */
  getBranchType(): Promise<BranchType>
}
