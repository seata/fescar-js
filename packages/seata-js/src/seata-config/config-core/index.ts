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
 * The type Configuration factory.
 *
 * @author godkun
 */
export class ConfigurationFactory {
  private static REGISTRY_CONF_DEFAULT = 'registry'

  private static ENV_SYSTEM_KEY = 'SEATA_ENV'

  private static ENV_PROPERTY_KEY = 'seataEnv'

  private static SYSTEM_PROPERTY_SEATA_CONFIG_NAME = 'seata.config.name'

  private static ENV_SEATA_CONFIG_NAME = 'SEATA_CONFIG_NAME'

  private static NAME_KEY = 'name'

  private static FILE_TYPE = 'file'

  static instance = null

  private static load() {}

  /**
   * Gets instance.
   *
   * @return the instance
   */
  static getInstance() {
    if (!ConfigurationFactory.instance) {
      ConfigurationFactory.instance = ConfigurationFactory.buildConfiguration()
    }
    return ConfigurationFactory.instance
  }

  private static buildConfiguration() {
    return null
  }

  protected static reload() {
    this.load()
    this.instance = null
    this.getInstance()
  }
}
