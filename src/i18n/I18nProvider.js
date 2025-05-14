import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { selectLanguage, setLanguage } from '../redux/slices/uiSlice';
import { messages, LOCALES, getBrowserLanguage } from './index';

/**
 * 国际化提供者组件，用于包装应用并提供翻译
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {React.ReactElement} 渲染的组件
 */
const I18nProvider = ({ children }) => {
  const dispatch = useDispatch();
  const currentLocale = useSelector(selectLanguage);

  // 在应用初始化时，如果没有设置语言，则使用浏览器默认语言
  useEffect(() => {
    if (!currentLocale) {
      const browserLang = getBrowserLanguage();
      dispatch(setLanguage(browserLang));
    }
  }, [currentLocale, dispatch]);

  // 确保总是有一个有效的区域设置，即使redux状态尚未初始化
  const locale = currentLocale || LOCALES.CHINESE;
  const messagesByLocale = messages[locale] || messages[LOCALES.CHINESE];

  return (
    <IntlProvider 
      locale={locale} 
      messages={messagesByLocale}
      defaultLocale={LOCALES.CHINESE}
    >
      {children}
    </IntlProvider>
  );
};

export default I18nProvider; 