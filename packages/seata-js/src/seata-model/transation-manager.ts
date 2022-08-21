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

import { GlobalStatus } from './global-status'

export default interface TransactionManager {
  /**
   * Begin a new global transaction.
   *
   * @param applicationId           ID of the application who begins this transaction.
   * @param transactionServiceGroup ID of the transaction service group.
   * @param name                    Give a name to the global transaction.
   * @param timeout                 Timeout of the global transaction.
   * @return XID of the global transaction
   */
  begin(
    applicationId: string,
    transactionServiceGroup: string,
    name: string,
    timeout: number,
  ): string

  /**
   * Global commit.
   *
   * @param xid XID of the global transaction.
   * @return Status of the global transaction after committing.
   */
  commit(xid: string): GlobalStatus

  /**
   * Global rollback.
   *
   * @param xid XID of the global transaction
   * @return Status of the global transaction after rollbacking.
   */
  rollback(xid: string): GlobalStatus

  /**
   * Get current status of the give transaction.
   *
   * @param xid XID of the global transaction.
   * @return Current status of the global transaction.
   */
  getStatus(xid: string): GlobalStatus

  /**
   * Global report.
   *
   * @param xid XID of the global transaction.
   * @param globalStatus Status of the global transaction.
   * @return Status of the global transaction.
   */
  globalReport(xid: string, globalStatus: GlobalStatus): GlobalStatus
}
