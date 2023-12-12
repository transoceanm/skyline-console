// Copyright 2021 99cloud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ConfirmAction } from 'containers/Action';
import { isNotLockedOrAdmin, checkStatus } from 'resources/nova/instance';
import globalServerStore from 'stores/nova/instance';

export default class Unshelve extends ConfirmAction {
  get id() {
    return 'shelve';
  }

  get title() {
    return t('Unshelve Instance');
  }

  get buttonText() {
    return t('Unshelve');
  }

  get actionName() {
    return t('unshelve instance');
  }

  get isAsyncAction() {
    return true;
  }

  policy = 'os_compute_api:os-shelve:unshelve';

  isStatusOk = (item) => checkStatus(['shelved', 'shelved_offloaded'], item);

  allowedCheckFunc = (item) => {
    if (!item) {
      return true;
    }
    return isNotLockedOrAdmin(item, this.isAdminPage) && this.isStatusOk(item);
  };

  onSubmit = () => {
    const { id } = this.item;
    return globalServerStore.unshelve({ id });
  };
}
