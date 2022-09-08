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

import { RegistryService } from '../discovery'

/**
 * The type Nacos registry service.
 *
 * @author godkun
 */
export class NacosRegistryService implements RegistryService {
  private static DEFAULT_NAMESPACE = ''
  private static DEFAULT_CLUSTER = 'default'
  private static DEFAULT_GROUP = 'DEFAULT_GROUP'
  private static DEFAULT_APPLICATION = 'seata-server'
  private static PRO_NAMESPACE_KEY = 'namespace'
  private static REGISTRY_TYPE = 'nacos'
  private static REGISTRY_CLUSTER = 'cluster'
  private static PRO_APPLICATION_KEY = 'application'
  private static PRO_GROUP_KEY = 'group'
  private static USER_NAME = 'username'
  private static PASSWORD = 'password'
  private static ACCESS_KEY = 'accessKey'
  private static SECRET_KEY = 'secretKey'
  private static SLB_PATTERN = 'slbPattern'
  private static USE_PARSE_RULE = 'false'
  private static PUBLIC_NAMING_ADDRESS_PREFIX = 'public_'
  private static PUBLIC_NAMING_SERVICE_META_IP_KEY = 'publicIp'
  private static PUBLIC_NAMING_SERVICE_META_PORT_KEY = 'publicPort'

  private static instance: NacosRegistryService

  static getInstance(): NacosRegistryService {
    if (!NacosRegistryService.instance) {
      NacosRegistryService.instance = new NacosRegistryService()
    }
    return NacosRegistryService.instance
  }

  register(address: string) {
    // TODO:
  }

  unregister(address: string) {
    // TODO:
  }

  subscribe(cluster: string, listener) {
    // TODO:
  }

  unsubscribe(cluster: string, listener) {
    // TODO:
  }

  lookup(key: string): Array<string> {
    return ['1']
  }

  close() {}
}
