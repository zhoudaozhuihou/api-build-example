/**
 * DatabaseTableService
 * 用于获取数据库表信息的服务
 */
class DatabaseTableService {
  constructor() {
    // 模拟数据
    this.mockTables = {
      mysql: [
        { 
          id: 'users', 
          name: 'users', 
          description: '用户信息表', 
          rowCount: 1000, 
          size: '1.2MB',
          columns: [
            { id: 'id', name: 'id', type: 'int', isPrimary: true, description: '用户ID' },
            { id: 'username', name: 'username', type: 'varchar(50)', isPrimary: false, description: '用户名' },
            { id: 'email', name: 'email', type: 'varchar(100)', isPrimary: false, description: '邮箱' },
            { id: 'created_at', name: 'created_at', type: 'datetime', isPrimary: false, description: '创建时间' }
          ]
        },
        { 
          id: 'products', 
          name: 'products', 
          description: '产品信息表', 
          rowCount: 500, 
          size: '2.5MB',
          columns: [
            { id: 'id', name: 'id', type: 'int', isPrimary: true, description: '产品ID' },
            { id: 'name', name: 'name', type: 'varchar(100)', isPrimary: false, description: '产品名称' },
            { id: 'price', name: 'price', type: 'decimal(10,2)', isPrimary: false, description: '价格' },
            { id: 'category_id', name: 'category_id', type: 'int', isPrimary: false, description: '分类ID', 
              foreignKey: { table: 'categories', column: 'id' } }
          ]
        },
        { 
          id: 'orders', 
          name: 'orders', 
          description: '订单信息表', 
          rowCount: 2000, 
          size: '3.8MB',
          columns: [
            { id: 'id', name: 'id', type: 'int', isPrimary: true, description: '订单ID' },
            { id: 'user_id', name: 'user_id', type: 'int', isPrimary: false, description: '用户ID', 
              foreignKey: { table: 'users', column: 'id' } },
            { id: 'order_date', name: 'order_date', type: 'datetime', isPrimary: false, description: '订单日期' },
            { id: 'status', name: 'status', type: 'varchar(20)', isPrimary: false, description: '订单状态' }
          ]
        },
        { 
          id: 'order_items', 
          name: 'order_items', 
          description: '订单项目表', 
          rowCount: 3500, 
          size: '4.2MB',
          columns: [
            { id: 'id', name: 'id', type: 'int', isPrimary: true, description: '项目ID' },
            { id: 'order_id', name: 'order_id', type: 'int', isPrimary: false, description: '订单ID', 
              foreignKey: { table: 'orders', column: 'id' } },
            { id: 'product_id', name: 'product_id', type: 'int', isPrimary: false, description: '产品ID', 
              foreignKey: { table: 'products', column: 'id' } },
            { id: 'quantity', name: 'quantity', type: 'int', isPrimary: false, description: '数量' },
            { id: 'price', name: 'price', type: 'decimal(10,2)', isPrimary: false, description: '单价' }
          ]
        },
        { 
          id: 'categories', 
          name: 'categories', 
          description: '产品分类表', 
          rowCount: 50, 
          size: '0.5MB',
          columns: [
            { id: 'id', name: 'id', type: 'int', isPrimary: true, description: '分类ID' },
            { id: 'name', name: 'name', type: 'varchar(50)', isPrimary: false, description: '分类名称' },
            { id: 'parent_id', name: 'parent_id', type: 'int', isPrimary: false, description: '父分类ID', 
              foreignKey: { table: 'categories', column: 'id' } }
          ]
        }
      ],
      postgresql: [
        { 
          id: 'customers', 
          name: 'customers', 
          description: '客户信息表', 
          rowCount: 1500, 
          size: '2.1MB',
          columns: [
            { id: 'id', name: 'id', type: 'serial', isPrimary: true, description: '客户ID' },
            { id: 'name', name: 'name', type: 'varchar(100)', isPrimary: false, description: '客户名称' },
            { id: 'contact', name: 'contact', type: 'varchar(100)', isPrimary: false, description: '联系人' },
            { id: 'phone', name: 'phone', type: 'varchar(20)', isPrimary: false, description: '电话' }
          ]
        },
        { 
          id: 'invoices', 
          name: 'invoices', 
          description: '发票信息表', 
          rowCount: 3000, 
          size: '4.5MB',
          columns: [
            { id: 'id', name: 'id', type: 'serial', isPrimary: true, description: '发票ID' },
            { id: 'customer_id', name: 'customer_id', type: 'int', isPrimary: false, description: '客户ID', 
              foreignKey: { table: 'customers', column: 'id' } },
            { id: 'amount', name: 'amount', type: 'decimal(10,2)', isPrimary: false, description: '金额' },
            { id: 'issue_date', name: 'issue_date', type: 'date', isPrimary: false, description: '发行日期' }
          ]
        },
        { 
          id: 'payments', 
          name: 'payments', 
          description: '支付记录表', 
          rowCount: 2500, 
          size: '3.2MB',
          columns: [
            { id: 'id', name: 'id', type: 'serial', isPrimary: true, description: '支付ID' },
            { id: 'invoice_id', name: 'invoice_id', type: 'int', isPrimary: false, description: '发票ID', 
              foreignKey: { table: 'invoices', column: 'id' } },
            { id: 'amount', name: 'amount', type: 'decimal(10,2)', isPrimary: false, description: '支付金额' },
            { id: 'payment_date', name: 'payment_date', type: 'date', isPrimary: false, description: '支付日期' }
          ]
        }
      ]
    };

    // 为其他数据库类型添加模拟数据
    this.mockTables.sqlserver = [...this.mockTables.mysql].map(table => ({
      ...table,
      id: `${table.id}_sqlserver`
    }));
    
    this.mockTables.oracle = [...this.mockTables.postgresql].map(table => ({
      ...table,
      id: `${table.id}_oracle`
    }));
  }

  /**
   * 获取数据库中的所有表
   * @param {Object} connection 数据库连接配置
   * @returns {Promise<Array>} 表列表
   */
  async getTables(connection) {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 根据数据库类型返回对应的模拟数据
      const dbType = connection.type || 'mysql';
      return this.mockTables[dbType] || [];
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw new Error('获取数据库表失败');
    }
  }

  /**
   * 获取表的列信息
   * @param {Object} connection 数据库连接配置
   * @param {string} tableName 表名
   * @returns {Promise<Array>} 列信息列表
   */
  async getTableColumns(connection, tableName) {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 根据数据库类型和表名查找表
      const dbType = connection.type || 'mysql';
      const table = (this.mockTables[dbType] || [])
        .find(t => t.name === tableName || t.id === tableName);
      
      return table ? table.columns : [];
    } catch (error) {
      console.error('Error fetching table columns:', error);
      throw new Error('获取表列信息失败');
    }
  }

  /**
   * 获取表的外键关系
   * @param {Object} connection 数据库连接配置
   * @param {string} tableName 表名
   * @returns {Promise<Array>} 外键关系列表
   */
  async getTableForeignKeys(connection, tableName) {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 根据数据库类型和表名查找表
      const dbType = connection.type || 'mysql';
      const table = (this.mockTables[dbType] || [])
        .find(t => t.name === tableName || t.id === tableName);
      
      if (!table) return [];
      
      // 提取表中的外键关系
      return table.columns
        .filter(column => column.foreignKey)
        .map(column => ({
          sourceColumn: column.name,
          sourceColumnId: column.id,
          targetTable: column.foreignKey.table,
          targetColumn: column.foreignKey.column
        }));
    } catch (error) {
      console.error('Error fetching foreign keys:', error);
      throw new Error('获取表外键关系失败');
    }
  }

  /**
   * 推荐两个表之间可能的连接关系
   * @param {Object} connection 数据库连接配置
   * @param {string} sourceTable 源表名
   * @param {string} targetTable 目标表名
   * @returns {Promise<Array>} 可能的连接关系
   */
  async recommendJoins(connection, sourceTable, targetTable) {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // 获取表的外键关系
      const sourceKeys = await this.getTableForeignKeys(connection, sourceTable);
      const targetKeys = await this.getTableForeignKeys(connection, targetTable);
      
      // 寻找直接关系
      const directJoins = sourceKeys
        .filter(key => key.targetTable === targetTable)
        .map(key => ({
          sourceTable,
          sourceColumn: key.sourceColumn,
          targetTable,
          targetColumn: key.targetColumn,
          confidence: 0.9,
          joinType: 'INNER'
        }));
      
      if (directJoins.length > 0) return directJoins;
      
      // 寻找反向关系
      const reverseJoins = targetKeys
        .filter(key => key.targetTable === sourceTable)
        .map(key => ({
          sourceTable,
          sourceColumn: key.targetColumn,
          targetTable,
          targetColumn: key.sourceColumn,
          confidence: 0.9,
          joinType: 'INNER'
        }));
      
      if (reverseJoins.length > 0) return reverseJoins;
      
      // 基于命名约定推测可能的关系
      const sourceColumns = await this.getTableColumns(connection, sourceTable);
      const targetColumns = await this.getTableColumns(connection, targetTable);
      
      // 单数形式的表名
      const sourceSingular = sourceTable.endsWith('s') 
        ? sourceTable.slice(0, -1) 
        : sourceTable;
      
      const targetSingular = targetTable.endsWith('s') 
        ? targetTable.slice(0, -1) 
        : targetTable;
      
      const possibleJoins = [];
      
      // 寻找模式: [table]_id in target table
      const tableIdInTarget = targetColumns.find(col => 
        col.name === `${sourceSingular}_id` || 
        col.name === `${sourceTable}_id`
      );
      
      if (tableIdInTarget) {
        possibleJoins.push({
          sourceTable,
          sourceColumn: 'id',
          targetTable,
          targetColumn: tableIdInTarget.name,
          confidence: 0.8,
          joinType: 'INNER'
        });
      }
      
      // 寻找模式: [table]_id in source table
      const tableIdInSource = sourceColumns.find(col => 
        col.name === `${targetSingular}_id` || 
        col.name === `${targetTable}_id`
      );
      
      if (tableIdInSource) {
        possibleJoins.push({
          sourceTable,
          sourceColumn: tableIdInSource.name,
          targetTable,
          targetColumn: 'id',
          confidence: 0.8,
          joinType: 'INNER'
        });
      }
      
      // 返回可能的关系
      return possibleJoins;
    } catch (error) {
      console.error('Error recommending joins:', error);
      throw new Error('推荐表连接关系失败');
    }
  }
}

export default new DatabaseTableService(); 