import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { selectLanguage, setLanguage } from '../redux/slices/uiSlice';
import { LOCALES } from '../i18n';

/**
 * 国际化钩子函数，提供翻译功能和语言切换
 * @returns {Object} 国际化相关方法和属性
 */
const useI18n = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectLanguage);

  /**
   * 翻译文本
   * @param {string} id - 翻译ID
   * @param {Object} values - 替换值
   * @returns {string} 翻译后的文本
   */
  const translate = (id, values = {}) => {
    return intl.formatMessage({ id }, values);
  };

  /**
   * 切换语言
   * @param {string} lang - 目标语言代码
   */
  const changeLanguage = (lang) => {
    if (Object.values(LOCALES).includes(lang)) {
      dispatch(setLanguage(lang));
    }
  };

  return {
    translate,
    changeLanguage,
    currentLanguage,
    LOCALES,
  };
};

export default useI18n; 