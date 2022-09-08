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

/**
 * The type Abstract configuration.
 *
 * @author godkun
 */
export class AbstractConfiguration {
  /**
   * The constant DEFAULT_CONFIG_TIMEOUT.
   */
  protected static DEFAULT_CONFIG_TIMEOUT = 5 * 1000

  /**
   * The constant DEFAULT_XXX.
   */
  static DEFAULT_SHORT = 0

  static DEFAULT_INT = 0

  static DEFAULT_LONG = '0L'

  static DEFAULT_BOOLEAN = false

  /**
   * Gets config.
   *
   * @param dataId       the data id
   * @param defaultValue the default value
   */
  getConfig(dataId: string, defaultValue: string) {
    return ''
  }
}