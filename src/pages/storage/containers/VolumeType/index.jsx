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

import { observer, inject } from 'mobx-react';
import Base from 'containers/TabList';
import QosSpec from './QosSpec';
import VolumeType from './VolumeType';

export class VolumeTypaAll extends Base {
  get tabs() {
    const tabs = [
      {
        title: t('Volume Types'),
        key: 'volume-type',
        component: VolumeType,
      },
      {
        title: t('QoS Specs'),
        key: 'qos',
        component: QosSpec,
      },
    ];
    return tabs;
  }
}

export default inject('rootStore')(observer(VolumeTypaAll));
