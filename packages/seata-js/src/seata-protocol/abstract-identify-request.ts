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

export class AbstractIdentifyRequest {
  /**
   * The version of the protocol.
   */
  protected version: string

  /**
   * The application id.
   */
  protected applicationId: string

  /**
   * The transaction service group.
   */
  protected transactionServiceGroup: string

  /**
   * The extra data.
   */
  protected extraData: string

  /**
   * Instantiates a new Abstract identify request.
   *
   * @param applicationId
   * @param transactionServiceGroup
   * @param extraData
   */
  constructor(
    applicationId: string,
    transactionServiceGroup: string,
    extraData?: string,
  ) {
    this.version = '1.0'
    this.applicationId = applicationId
    this.transactionServiceGroup = transactionServiceGroup
    this.extraData = extraData || ''
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~setter && getter ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  getVersion() {
    return this.version
  }

  geApplicationId() {
    return this.applicationId
  }

  getTransactionServiceGroup() {
    return this.transactionServiceGroup
  }

  getExtraData() {
    return this.extraData
  }

  setVersion(version: string) {
    this.version = version
    return this
  }

  setApplicationId(applicationId: string) {
    this.applicationId = applicationId
    return this
  }

  setTransactionServiceGroup(transactionServiceGroup: string) {
    this.transactionServiceGroup = transactionServiceGroup
    return this
  }

  setExtraData(extraData: string) {
    this.extraData = extraData
    return this
  }
}
