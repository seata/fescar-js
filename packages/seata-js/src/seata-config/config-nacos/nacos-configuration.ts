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

import { AbstractConfiguration } from '../config-core/abstract-configuration'

/**
 * the type Nacos configuration
 *
 * @author godkun
 */
export class NacosConfiguration extends AbstractConfiguration {
  private static instance: NacosConfiguration

  private static DEFAULT_GROUP = 'SEATA_GROUP'

  private static DEFAULT_DATA_ID = 'seata.properties'

  private static GROUP_KEY = 'group'

  private static PRO_SERVER_ADDR_KEY = 'serverAddr'

  private static NACOS_DATA_ID_KEY = 'dataId'

  private static CONFIG_TYPE = 'nacos'

  private static DEFAULT_NAMESPACE = ''

  private static PRO_NAMESPACE_KEY = 'namespace'

  private static USER_NAME = 'username'

  private static PASSWORD = 'password'

  private static ACCESS_KEY = 'accessKey'

  private static SECRET_KEY = 'secretKey'

  private static USE_PARSE_RULE = 'false'

  private static MAP_INITIAL_CAPACITY = 8

  /**
   * Get instance of NacosConfiguration
   *
   * @returns instance
   */
  static getInstance(): NacosConfiguration {
    if (!NacosConfiguration.instance) {
      NacosConfiguration.instance = new NacosConfiguration()
    }
    return NacosConfiguration.instance
  }
}
