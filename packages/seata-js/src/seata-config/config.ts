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
 * The interface Configuration.
 *
 * @author godkun
 */
export interface Configuration {
  /**
   * Gets config.
   *
   * @param dataId       the data id
   * @param defaultValue the default value
   * @return the config
   */
  getConfig(dataId: string, defaultValue: string): string
}

/**
 * The enum Config type.
 *
 * @author godkun
 */
export enum ConfigType {
  /**
   * File config type.
   */
  File,
  /**
   * zookeeper config type.
   */
  ZK,
  /**
   * Nacos config type.
   */
  Nacos,
  /**
   * Apollo config type.
   */
  Apollo,
  /**
   * Consul config type
   */
  Consul,
  /**
   * Etcd3 config type
   */
  Etcd3,
  /**
   * spring cloud config type
   */
  SpringCloudConfig,
  /**
   * Custom config type
   */
  Custom,
}

/**
 * The enum Configuration change type.
 */
export enum ConfigurationChangeType {
  /**
   * Add configuration change type
   */
  ADD,
  /**
   * Modify configuration change type
   */
  MODIFY,
  /**
   * Delete configuration change type
   */
  DELETE,
}

/**
 * the interface configuration provider
 * @author godkun
 */
export interface ConfigurationProvider {
  /**
   * provide a AbstractConfiguration implementation instance
   * @return Configuration
   */
  provide(): Configuration
}

export default {
  // max request timeout
  MAX_REQ_TIME_OUT: 10_000,
  'transport.heartbeat': true,
  'transport.serialization': '',
  'transport.compressor': '',
}
