/**
 * ParameterDemoService
 * 用于提供API参数选择的演示数据
 */
class ParameterDemoService {
  constructor() {
    // 常用的参数类型
    this.parameterTypes = [
      { value: 'string', label: '字符串 (String)' },
      { value: 'integer', label: '整数 (Integer)' },
      { value: 'number', label: '数字 (Number)' },
      { value: 'boolean', label: '布尔值 (Boolean)' },
      { value: 'array', label: '数组 (Array)' },
      { value: 'object', label: '对象 (Object)' },
      { value: 'date', label: '日期 (Date)' },
      { value: 'datetime', label: '日期时间 (DateTime)' },
      { value: 'file', label: '文件 (File)' },
    ];

    // 参数位置
    this.parameterLocations = [
      { value: 'query', label: '查询参数 (Query)' },
      { value: 'path', label: '路径参数 (Path)' },
      { value: 'header', label: '请求头 (Header)' },
      { value: 'body', label: '请求体 (Body)' },
      { value: 'formData', label: '表单数据 (FormData)' },
    ];

    // 验证规则类型
    this.validationRules = [
      { value: 'required', label: '必填' },
      { value: 'min', label: '最小值' },
      { value: 'max', label: '最大值' },
      { value: 'minLength', label: '最小长度' },
      { value: 'maxLength', label: '最大长度' },
      { value: 'pattern', label: '正则表达式' },
      { value: 'enum', label: '枚举值' },
      { value: 'email', label: '电子邮件' },
      { value: 'url', label: 'URL' },
      { value: 'date', label: '日期格式' },
    ];
  }

  /**
   * 根据表结构生成参数建议
   * @param {Object} tableInfo 表信息
   * @returns {Object} 输入和输出参数建议
   */
  generateParameterSuggestions(tableInfo) {
    if (!tableInfo || !tableInfo.columns) {
      return { inputs: [], outputs: [] };
    }

    const inputs = [];
    const outputs = [];

    // 生成输入参数（通常是主键和常用的筛选字段）
    tableInfo.columns.forEach(column => {
      // 主键通常用作路径参数
      if (column.isPrimary) {
        inputs.push({
          id: `${tableInfo.name}_${column.name}_input`,
          name: column.name,
          type: this.mapDbTypeToParamType(column.type),
          location: 'path',
          required: true,
          description: `${column.description || column.name} (主键)`,
          validationRules: [
            { type: 'required', value: true }
          ]
        });
      } 
      // 常用筛选字段作为查询参数
      else if (this.isFilterableField(column)) {
        inputs.push({
          id: `${tableInfo.name}_${column.name}_input`,
          name: column.name,
          type: this.mapDbTypeToParamType(column.type),
          location: 'query',
          required: false,
          description: column.description || column.name,
          validationRules: this.generateValidationRules(column)
        });
      }

      // 所有字段都作为输出参数
      outputs.push({
        id: `${tableInfo.name}_${column.name}_output`,
        name: column.name,
        type: this.mapDbTypeToParamType(column.type),
        description: column.description || column.name,
        example: this.generateExampleValue(column)
      });
    });

    // 添加分页参数
    inputs.push({
      id: 'pagination_page',
      name: 'page',
      type: 'integer',
      location: 'query',
      required: false,
      description: '页码，从1开始',
      defaultValue: '1',
      validationRules: [
        { type: 'min', value: 1 }
      ]
    });

    inputs.push({
      id: 'pagination_size',
      name: 'size',
      type: 'integer',
      location: 'query',
      required: false,
      description: '每页记录数',
      defaultValue: '10',
      validationRules: [
        { type: 'min', value: 1 },
        { type: 'max', value: 100 }
      ]
    });

    return { inputs, outputs };
  }

  /**
   * 判断字段是否适合作为筛选条件
   * @param {Object} column 列信息
   * @returns {boolean} 是否适合作为筛选条件
   */
  isFilterableField(column) {
    // 常见的筛选字段名称
    const filterableNames = ['status', 'type', 'category', 'level', 'role', 'gender', 'state', 'is_', 'has_', 'created_at', 'updated_at', 'date'];
    
    // 适合筛选的数据类型
    const filterableTypes = ['varchar', 'char', 'text', 'int', 'tinyint', 'smallint', 'boolean', 'date', 'datetime', 'timestamp', 'enum'];
    
    // 检查名称
    const isNameFilterable = filterableNames.some(name => 
      column.name.includes(name) || column.name.toLowerCase().includes(name)
    );
    
    // 检查类型
    const isTypeFilterable = filterableTypes.some(type => 
      column.type.toLowerCase().includes(type)
    );
    
    return isNameFilterable || isTypeFilterable;
  }

  /**
   * 根据数据库字段类型映射到参数类型
   * @param {string} dbType 数据库字段类型
   * @returns {string} 参数类型
   */
  mapDbTypeToParamType(dbType) {
    const lowerType = dbType.toLowerCase();
    
    if (lowerType.includes('int')) return 'integer';
    if (lowerType.includes('float') || lowerType.includes('double') || lowerType.includes('decimal') || lowerType.includes('numeric')) return 'number';
    if (lowerType.includes('bool')) return 'boolean';
    if (lowerType.includes('date') && !lowerType.includes('datetime') && !lowerType.includes('timestamp')) return 'date';
    if (lowerType.includes('datetime') || lowerType.includes('timestamp')) return 'datetime';
    if (lowerType.includes('json') || lowerType.includes('object')) return 'object';
    if (lowerType.includes('array')) return 'array';
    
    // 默认为字符串类型
    return 'string';
  }

  /**
   * 生成字段的验证规则
   * @param {Object} column 列信息
   * @returns {Array} 验证规则列表
   */
  generateValidationRules(column) {
    const rules = [];
    const type = this.mapDbTypeToParamType(column.type);
    
    // 提取字符串类型的长度信息，如varchar(50)
    if (type === 'string' && column.type.match(/\((\d+)\)/)) {
      const maxLength = parseInt(column.type.match(/\((\d+)\)/)[1]);
      if (!isNaN(maxLength)) {
        rules.push({ type: 'maxLength', value: maxLength });
      }
    }
    
    // 根据字段名称添加特定规则
    if (column.name.includes('email')) {
      rules.push({ type: 'email', value: true });
    }
    
    if (column.name.includes('url') || column.name.includes('website') || column.name.includes('link')) {
      rules.push({ type: 'url', value: true });
    }
    
    if (column.name.includes('date')) {
      rules.push({ type: 'date', value: true });
    }
    
    return rules;
  }

  /**
   * 生成字段的示例值
   * @param {Object} column 列信息
   * @returns {string} 示例值
   */
  generateExampleValue(column) {
    const type = this.mapDbTypeToParamType(column.type);
    const name = column.name.toLowerCase();
    
    if (name.includes('id') && column.isPrimary) return '1';
    if (name.includes('name')) return '示例名称';
    if (name.includes('title')) return '示例标题';
    if (name.includes('description')) return '这是一段示例描述文本';
    if (name.includes('email')) return 'example@example.com';
    if (name.includes('phone')) return '13800138000';
    if (name.includes('url') || name.includes('website') || name.includes('link')) return 'https://example.com';
    if (name.includes('address')) return '北京市海淀区示例路100号';
    
    if (type === 'integer') return '42';
    if (type === 'number') return '3.14';
    if (type === 'boolean') return 'true';
    if (type === 'date') return '2023-05-15';
    if (type === 'datetime') return '2023-05-15T08:30:00';
    if (type === 'object') return '{ "key": "value" }';
    if (type === 'array') return '[1, 2, 3]';
    
    return '示例值';
  }

  /**
   * 获取多表连接时的示例参数
   * @param {Array} tables 选定的表列表
   * @param {Array} joins 表连接信息
   * @returns {Object} 输入和输出参数建议
   */
  generateJoinParameters(tables, joins) {
    if (!tables || tables.length === 0) {
      return { inputs: [], outputs: [] };
    }

    const inputs = [];
    const outputs = [];
    
    // 主表的主键和筛选字段作为输入参数
    const mainTable = tables[0];
    const mainTableParams = this.generateParameterSuggestions(mainTable);
    inputs.push(...mainTableParams.inputs);
    
    // 关联表的筛选字段也可以作为输入参数，但要避免重名
    for (let i = 1; i < tables.length; i++) {
      const tableParams = this.generateParameterSuggestions(tables[i]);
      
      // 为避免重名，给关联表的参数名称加上表名前缀
      tableParams.inputs.forEach(param => {
        if (!param.name.includes('page') && !param.name.includes('size')) {
          param.name = `${tables[i].name}_${param.name}`;
          param.description = `[${tables[i].name}] ${param.description}`;
          inputs.push(param);
        }
      });
    }
    
    // 所有表的字段都作为输出参数，但需要加上表名前缀
    tables.forEach(table => {
      const tableParams = this.generateParameterSuggestions(table);
      
      tableParams.outputs.forEach(param => {
        param.name = `${table.name}_${param.name}`;
        param.description = `[${table.name}] ${param.description}`;
        outputs.push(param);
      });
    });
    
    return { inputs, outputs };
  }
}

export default new ParameterDemoService(); 