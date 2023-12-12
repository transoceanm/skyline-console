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

import moment from 'moment';
import 'moment/locale/zh-cn';
import _, { isArray } from 'lodash';
import cookie from 'utils/cookie';
import SLI18n from 'utils/translate';
import { setLocalStorageItem } from 'utils/local-storage';

import locales from '../locales';

// shortName: the i18n name in the api
// icon: the icon of switch language in ui
const SUPPORT_LOCALES_ALL = [
  {
    name: 'English',
    value: 'en',
    shortName: 'en',
    icon: 'en',
    momentName: 'en',
  },
  {
    name: '简体中文',
    value: 'zh-hans',
    shortName: 'zh',
    icon: 'zh',
    momentName: 'zhCN',
  },
  {
    name: '한글',
    value: 'ko-kr',
    shortName: 'ko',
    icon: 'ko',
    momentName: 'ko',
  },
];

const getDefaultLanguageInConfig = () => {
  const { defaultLanguage } = GLOBAL_VARIABLES;
  const defaultLang = defaultLanguage || 'en';
  const inSupport = SUPPORT_LOCALES_ALL.find((it) => it.value === defaultLang);
  return inSupport ? defaultLang : 'en';
};

const getSupportLanguagesInConfig = () => {
  const { supportLanguages } = GLOBAL_VARIABLES;
  const defaultLang = getDefaultLanguageInConfig();
  const defaultSupportLanguages = [defaultLang];
  if (!supportLanguages || !isArray(supportLanguages)) {
    return defaultSupportLanguages;
  }
  if (!supportLanguages.includes(defaultLang)) {
    return [...supportLanguages, defaultLang];
  }
  return supportLanguages;
};

const SUPPORT_LOCALES = SUPPORT_LOCALES_ALL.filter((it) => {
  const supportLanguages = getSupportLanguagesInConfig();
  return supportLanguages.includes(it.value);
});

const getMomentName = (locale) => {
  const item = SUPPORT_LOCALES_ALL.find((it) => it.value === locale);
  return (item || {}).momentName || 'en';
};

const intl = new SLI18n();

let currentLocals = null;

// const getLocaleFromStorage = () => {
//   const value = getLocalStorageItem('lang');
//   return value || 'en';
// };

const setLocaleToStorage = (value) => {
  setLocalStorageItem('lang', value);
};

const getLocale = () => {
  let currentLocale = intl.determineLocale({
    urlLocaleKey: 'lang',
    cookieLocaleKey: 'lang',
    localStorageLocaleKey: 'lang',
  });

  const { defaultLanguage } = GLOBAL_VARIABLES;

  // If not found, the default language is set in config.yaml
  if (!_.find(SUPPORT_LOCALES, { value: currentLocale })) {
    currentLocale = defaultLanguage;
  }

  if (!currentLocals) {
    currentLocals = locales[currentLocale];
  }
  moment.locale(currentLocale);
  return currentLocale;
};

const getLocaleShortName = () => {
  const fullName = getLocale();
  const item = SUPPORT_LOCALES.find((it) => it.value === fullName);
  return item ? item.shortName : fullName;
};

const loadLocales = () => {
  const currentLocale = getLocale();
  return intl.init({
    currentLocale,
    locales,
    fallbackLocale: 'en',
  });
};

const setLocale = (lang) => {
  setLocaleToStorage(lang);
  cookie('lang', lang);
  moment.locale(getMomentName(lang));
  window.location.reload();
  return lang;
};

const isLocaleZh = getLocale() === 'zh-hans';

const init = () => {
  const lang = getLocale();

  if (lang === 'zh-hans') {
    moment.locale('zh-cn', {
      relativeTime: {
        s: '1秒',
        ss: '%d秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年',
        past: '%s前',
        future: '在%s后',
      },
    });
  }

  return { locales };
};

// const localeGet = (key, options) => {
//   if (!currentLocals) {
//     getLocale();
//   }
//   console.log(key, options);
//   return currentLocals[key] || key;
// };

const t = (key, options) => intl.get(key, options);

t.html = (key, options) => intl.getHTML(key, options);

loadLocales();
init();
window.t = t;

export default {
  getLocale,
  setLocale,
  loadLocales,
  init,
  t,
  isLocaleZh,
  getLocaleShortName,
  SUPPORT_LOCALES,
};
