import { createIntl, createIntlCache } from 'react-intl';
import zhMessages from './locales/zh.json';
import enMessages from './locales/en.json';

// 支持的语言列表
export const LOCALES = {
  CHINESE: 'zh',
  ENGLISH: 'en',
};

// 翻译消息
export const messages = {
  [LOCALES.CHINESE]: zhMessages,
  [LOCALES.ENGLISH]: enMessages,
};

// 创建缓存，提高性能
const cache = createIntlCache();

/**
 * 创建国际化实例
 * @param {string} locale - 当前语言
 * @returns {Object} intl实例
 */
export const createIntlInstance = (locale) => {
  return createIntl(
    {
      locale: locale || LOCALES.CHINESE,
      messages: messages[locale] || messages[LOCALES.CHINESE],
    },
    cache
  );
};

/**
 * 获取当前浏览器默认语言
 * @returns {string} 语言代码
 */
export const getBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const shortLang = browserLang.split('-')[0];
  
  return Object.values(LOCALES).includes(shortLang) 
    ? shortLang 
    : LOCALES.CHINESE;
};

export default {
  LOCALES,
  messages,
  createIntlInstance,
  getBrowserLanguage,
}; 