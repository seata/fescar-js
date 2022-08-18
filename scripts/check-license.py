# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from glob import glob
from base import style


LICENSE = """
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
""".strip()


def check_files(files):
    return [file for file in files if no_license_file(file)]


def no_license_file(file):
    with open(file, 'r') as f:
        return LICENSE not in f.read()


def fixed_license_file(file):
    with open(file, 'r+') as f:
        raw = f.read()
        f.seek(0)
        f.write(LICENSE + '\n' + raw)


if __name__ == '__main__':
    files = check_files([
        './vitest.config.ts',
        *glob('./packages/**/[!lib]*/*.ts', recursive=True)
    ])

    import sys
    is_fixed = len(sys.argv) > 1 and sys.argv[1] == "--fixed"
    if not is_fixed:
        if len(files) > 0:
            for file in files:
                print(f'{style.failed(file)} missing license')
            exit(1)
    else:
        for file in files:
            fixed_license_file(file)
