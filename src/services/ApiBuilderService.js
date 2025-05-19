import axios from 'axios';

// API操作类型常量
export const API_TYPES = {
  QUERY: 'query',
  INSERT: 'insert'
};

// 关系类型常量
export const JOIN_TYPES = {
  INNER: 'inner',
  LEFT: 'left',
  RIGHT: 'right',
  FULL: 'full'
};

/**
 * API构建器服务 - 处理API创建、测试和部署
 */
class ApiBuilderService {
  constructor() {
    this.apiConfig = null;
    this.baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
  }

  /**
   * 初始化API配置
   * @param {string} name - API名称
   * @param {string} type - API类型 (query/insert)
   * @param {string} description - API描述
   * @param {string} mainTable - 主表名
   */
  initApiConfig(name, type, description, mainTable) {
    this.apiConfig = {
      name,
      type,
      description,
      mainTable,
      fields: [], // 将被展示或插入的字段
      joins: [], // 连接的表
      conditions: [], // 查询条件
      pagination: type === API_TYPES.QUERY ? { enabled: false, pageSize: 10 } : null,
      sorting: type === API_TYPES.QUERY ? { enabled: false, defaultField: null } : null,
    };
    return this;
  }

  /**
   * 添加要选择或插入的字段
   * @param {Array} fields - 字段配置数组，例如：[{name: 'id', table: 'users', alias: 'user_id'}]
   */
  addFields(fields) {
    this.apiConfig.fields = fields;
    return this;
  }

  /**
   * 添加表连接配置
   * @param {string} targetTable - 连接的目标表
   * @param {string} joinType - 连接类型 (inner, left, right, full)
   * @param {Array} conditions - 连接条件，例如：[{sourceTable: 'users', sourceField: 'id', targetTable: 'orders', targetField: 'user_id'}]
   */
  addJoin(targetTable, joinType = JOIN_TYPES.INNER, conditions) {
    this.apiConfig.joins.push({
      targetTable,
      joinType,
      conditions
    });
    return this;
  }

  /**
   * 添加查询条件 (WHERE 子句)
   * @param {Array} conditions - 条件数组
   */
  addConditions(conditions) {
    this.apiConfig.conditions = conditions;
    return this;
  }

  /**
   * 启用分页 (仅适用于查询类API)
   * @param {number} pageSize - 每页条目数
   */
  enablePagination(pageSize = 10) {
    if (this.apiConfig.type !== API_TYPES.QUERY) {
      throw new Error('Pagination is only available for query APIs');
    }
    this.apiConfig.pagination = { enabled: true, pageSize };
    return this;
  }

  /**
   * 设置默认排序 (仅适用于查询类API)
   * @param {string} field - 排序字段名称
   * @param {string} direction - 排序方向 (asc/desc)
   */
  setDefaultSorting(field, direction = 'asc') {
    if (this.apiConfig.type !== API_TYPES.QUERY) {
      throw new Error('Sorting is only available for query APIs');
    }
    this.apiConfig.sorting = { enabled: true, defaultField: field, direction };
    return this;
  }

  /**
   * 验证API配置的有效性
   * @returns {Object} 包含isValid字段和可能的错误消息
   */
  validateConfig() {
    const errors = [];
    
    // 基本验证
    if (!this.apiConfig.name) errors.push('API名称不能为空');
    if (!this.apiConfig.type) errors.push('API类型必须指定');
    if (!this.apiConfig.mainTable) errors.push('主表必须指定');
    
    // 字段验证
    if (this.apiConfig.fields.length === 0) {
      errors.push('至少需要指定一个字段');
    }
    
    // Join条件验证
    for (const join of this.apiConfig.joins) {
      if (!join.targetTable) errors.push('连接表必须指定');
      if (!join.conditions || join.conditions.length === 0) {
        errors.push(`连接到 ${join.targetTable} 的条件必须指定`);
      }
    }
    
    // 查询类API特定验证
    if (this.apiConfig.type === API_TYPES.QUERY) {
      // 可以添加其他查询特定验证
    }
    
    // 插入类API特定验证
    if (this.apiConfig.type === API_TYPES.INSERT) {
      // 插入API不应该有排序或分页
      if (this.apiConfig.pagination && this.apiConfig.pagination.enabled) {
        errors.push('插入API不支持分页');
      }
      if (this.apiConfig.sorting && this.apiConfig.sorting.enabled) {
        errors.push('插入API不支持排序');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 生成API配置的SQL语句
   * @returns {string} SQL语句
   */
  generateSql() {
    const { type, mainTable, fields, joins, conditions } = this.apiConfig;
    
    // 生成字段列表
    const fieldsList = fields.map(field => {
      const tableName = field.table || mainTable;
      const fieldName = `${tableName}.${field.name}`;
      return field.alias ? `${fieldName} AS ${field.alias}` : fieldName;
    }).join(', ');
    
    if (type === API_TYPES.QUERY) {
      // 构建SELECT语句
      let sql = `SELECT ${fieldsList} FROM ${mainTable}`;
      
      // 添加JOIN子句
      if (joins && joins.length > 0) {
        // 验证所有join配置是否有效
        const validJoins = joins.filter(join => {
          return join.targetTable && join.conditions && 
                 join.conditions.length > 0 && 
                 join.conditions.every(cond => 
                   cond.sourceTable && cond.sourceField && 
                   cond.targetTable && cond.targetField
                 );
        });
        
        // 按照连接类型排序，确保INNER JOIN优先
        const joinOrder = { 
          [JOIN_TYPES.INNER]: 1, 
          [JOIN_TYPES.LEFT]: 2, 
          [JOIN_TYPES.RIGHT]: 3, 
          [JOIN_TYPES.FULL]: 4 
        };
        
        validJoins.sort((a, b) => joinOrder[a.joinType] - joinOrder[b.joinType]);
        
        // 添加排序后的JOIN子句
        for (const join of validJoins) {
          const { targetTable, joinType, conditions: joinConditions } = join;
          
          // 构建JOIN子句
          sql += ` ${joinType.toUpperCase()} JOIN ${targetTable} ON `;
          
          // 构建JOIN条件
          const joinConditionsList = joinConditions.map(condition => {
            // 处理表名为null的情况
            const sourceTable = condition.sourceTable || mainTable;
            const targetTable = condition.targetTable;
            
            return `${sourceTable}.${condition.sourceField} = ${targetTable}.${condition.targetField}`;
          }).join(' AND ');
          
          sql += joinConditionsList;
        }
      }
      
      // 添加WHERE子句
      if (conditions && conditions.length > 0) {
        const validConditions = conditions.filter(c => c.field);
        
        if (validConditions.length > 0) {
          sql += ' WHERE ';
          const whereConditions = validConditions.map(condition => {
            const tableName = condition.table || mainTable;
            const operator = condition.operator || '=';
            
            // 对于参数化的条件，使用占位符
            if (condition.parameterized) {
              return `${tableName}.${condition.field} ${operator} :${condition.paramName}`;
            }
            
            // 对于固定值条件
            if (typeof condition.value === 'string') {
              return `${tableName}.${condition.field} ${operator} '${condition.value}'`;
            }
            // 处理NULL值
            if (condition.value === null) {
              if (operator === '=' || operator.toLowerCase() === 'is') {
                return `${tableName}.${condition.field} IS NULL`;
              } else if (operator === '!=' || operator.toLowerCase() === 'is not') {
                return `${tableName}.${condition.field} IS NOT NULL`;
              }
            }
            return `${tableName}.${condition.field} ${operator} ${condition.value}`;
          }).join(' AND ');
          
          sql += whereConditions;
        }
      }
      
      // 添加排序
      if (this.apiConfig.sorting && this.apiConfig.sorting.enabled && this.apiConfig.sorting.defaultField) {
        const { defaultField, direction } = this.apiConfig.sorting;
        const safeDirection = (direction || 'asc').toUpperCase();
        sql += ` ORDER BY ${defaultField} ${safeDirection}`;
      }
      
      // 添加分页（生成带占位符的分页SQL）
      if (this.apiConfig.pagination && this.apiConfig.pagination.enabled) {
        sql += ' LIMIT :limit OFFSET :offset';
      }
      
      return sql;
    } else if (type === API_TYPES.INSERT) {
      // 构建INSERT语句
      const fieldNames = fields.map(field => field.name).join(', ');
      const placeholders = fields.map(field => `:${field.name}`).join(', ');
      
      return `INSERT INTO ${mainTable} (${fieldNames}) VALUES (${placeholders})`;
    }
    
    throw new Error(`不支持的API类型: ${type}`);
  }

  /**
   * 生成API端点配置
   * @returns {Object} API端点配置
   */
  generateEndpointConfig() {
    const { name, type, description, mainTable, fields } = this.apiConfig;
    const sql = this.generateSql();
    
    // 构建API端点的配置对象
    const endpoint = {
      name,
      type,
      description,
      mainTable,
      sql,
      parameters: []
    };
    
    // 添加参数定义
    if (type === API_TYPES.QUERY) {
      // 为查询条件添加参数
      for (const condition of this.apiConfig.conditions) {
        if (condition.parameterized) {
          endpoint.parameters.push({
            name: condition.paramName,
            type: condition.paramType || 'string',
            required: condition.required || false,
            defaultValue: condition.defaultValue || null,
            description: condition.description || `Filter by ${condition.field}`
          });
        }
      }
      
      // 如果启用了分页，添加分页参数
      if (this.apiConfig.pagination && this.apiConfig.pagination.enabled) {
        endpoint.parameters.push({
          name: 'page',
          type: 'integer',
          required: false,
          defaultValue: 1,
          description: 'Page number'
        });
        
        endpoint.parameters.push({
          name: 'limit',
          type: 'integer',
          required: false,
          defaultValue: this.apiConfig.pagination.pageSize,
          description: 'Items per page'
        });
      }
      
      // 如果启用了排序，添加排序参数
      if (this.apiConfig.sorting && this.apiConfig.sorting.enabled) {
        endpoint.parameters.push({
          name: 'sort_field',
          type: 'string',
          required: false,
          defaultValue: this.apiConfig.sorting.defaultField,
          description: 'Field to sort by'
        });
        
        endpoint.parameters.push({
          name: 'sort_direction',
          type: 'string',
          required: false,
          defaultValue: this.apiConfig.sorting.direction,
          description: 'Sort direction (asc/desc)'
        });
      }
    } else if (type === API_TYPES.INSERT) {
      // 为每个插入字段添加参数
      for (const field of fields) {
        endpoint.parameters.push({
          name: field.name,
          type: field.type || 'string',
          required: field.required !== false, // 默认为必填
          defaultValue: field.defaultValue || null,
          description: field.description || `Value for ${field.name}`
        });
      }
    }
    
    return endpoint;
  }

  /**
   * 保存API定义
   * @returns {Promise} 保存操作的Promise
   */
  saveApi() {
    const validation = this.validateConfig();
    if (!validation.isValid) {
      return Promise.reject(new Error(`配置无效: ${validation.errors.join(', ')}`));
    }
    
    const endpointConfig = this.generateEndpointConfig();
    
    // 调用后端API进行保存
    return axios.post(`${this.baseUrl}/endpoints`, endpointConfig);
  }

  /**
   * 测试API
   * @param {Object} testParams - 测试参数
   * @returns {Promise} 测试操作的Promise
   */
  testApi(testParams = {}) {
    const validation = this.validateConfig();
    if (!validation.isValid) {
      return Promise.reject(new Error(`配置无效: ${validation.errors.join(', ')}`));
    }
    
    const endpointConfig = this.generateEndpointConfig();
    
    // 将配置和测试参数发送到后端进行测试
    return axios.post(`${this.baseUrl}/endpoints/test`, { 
      config: endpointConfig,
      testParams 
    });
  }

  /**
   * 部署API到生产环境
   * @param {string} apiId - 已保存的API ID
   * @returns {Promise} 部署操作的Promise
   */
  deployApi(apiId) {
    return axios.post(`${this.baseUrl}/endpoints/${apiId}/deploy`);
  }
}

// 创建单例实例
const apiBuilderService = new ApiBuilderService();

export default apiBuilderService; 