import axios from 'axios';

/**
 * 根据API配置生成API请求函数
 * @param {Object} apiConfig - API配置对象，包含来自ApiBuilderService的配置
 * @returns {Function} 一个用于发送请求的函数
 */
export const generateApiRequestFunction = (apiConfig) => {
  const { name, type, mainTable, sqlQuery, parameters = [] } = apiConfig;
  
  // 确定HTTP方法
  const method = type === 'query' ? 'GET' : 'POST';
  
  // 生成API路径
  let path = `/api/${mainTable}`;
  if (name) {
    // 将API名称转换为URL友好的格式
    const urlFriendlyName = name.toLowerCase().replace(/\s+/g, '-');
    path = `/api/${urlFriendlyName}`;
  }
  
  /**
   * 生成的API请求函数
   * @param {Object} params - 请求参数
   * @param {Object} options - 请求选项
   * @returns {Promise} 请求Promise
   */
  return async (params = {}, options = {}) => {
    try {
      // 准备请求配置
      const requestConfig = {
        method,
        url: path,
        ...options
      };
      
      // 对于GET请求，将参数放在URL查询字符串中
      if (method === 'GET') {
        requestConfig.params = params;
      } else {
        // 对于POST/PUT/DELETE请求，将参数放在请求体中
        requestConfig.data = params;
      }
      
      // 发送请求
      const response = await axios(requestConfig);
      return response.data;
    } catch (error) {
      console.error(`API请求失败 (${name}):`, error);
      throw error;
    }
  };
};

/**
 * 从API定义生成示例代码
 * @param {Object} apiConfig - API配置对象
 * @returns {string} 示例代码
 */
export const generateApiUsageExample = (apiConfig) => {
  const { name, type, parameters = [] } = apiConfig;
  
  // 创建API名称的驼峰命名法版本
  const camelCaseName = name.toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
  
  // 生成示例参数
  const paramExamples = {};
  parameters.forEach(param => {
    switch(param.type) {
      case 'string':
        paramExamples[param.name] = `'${param.defaultValue || 'example'}'`;
        break;
      case 'integer':
      case 'number':
        paramExamples[param.name] = param.defaultValue || 1;
        break;
      case 'boolean':
        paramExamples[param.name] = param.defaultValue || false;
        break;
      default:
        paramExamples[param.name] = param.defaultValue || null;
    }
  });
  
  // 生成示例代码
  const exampleCode = `
// 导入API
import { ${camelCaseName}Api } from './api';

// 示例用法
async function example() {
  try {
    // 准备参数
    const params = ${JSON.stringify(paramExamples, null, 2)};
    
    // 调用API
    const result = await ${camelCaseName}Api(params);
    console.log('API返回结果:', result);
    
    // 处理结果数据
    ${type === 'query' ? '// 遍历查询结果\nresult.data.forEach(item => {\n  console.log(item);\n});' : '// 使用插入的ID\nconst insertedId = result.id;\nconsole.log(\'插入的ID:\', insertedId);'}
  } catch (error) {
    console.error('API调用失败:', error);
  }
}
`;
  
  return exampleCode;
};

export default {
  generateApiRequestFunction,
  generateApiUsageExample
}; 