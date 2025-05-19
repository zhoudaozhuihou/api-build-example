import apiBuilderService, { API_TYPES, JOIN_TYPES } from '../services/ApiBuilderService';

/**
 * 将UI组件的多表连接数据转换为ApiBuilderService所需的格式
 * @param {string} name - API名称
 * @param {string} description - API描述
 * @param {Object} joinData - 从JoinTablesBuilder获取的多表连接数据
 * @param {Array} selectedColumns - 选中的列ID数组
 * @returns {Object} 初始化并配置好的ApiBuilderService实例
 */
export const convertJoinDataToApiBuilder = (name, description, joinData, selectedColumns) => {
  // 确保有效的连接数据
  if (!joinData || !joinData.selectedTables || joinData.selectedTables.length === 0) {
    throw new Error('无效的多表连接数据');
  }

  // 找出所有连接关系中出现最多的表作为主表
  let mainTableId = null;
  let mainTableFrequency = 0;
  
  // 统计每个表在连接关系中出现的频率
  if (joinData.joins && joinData.joins.length > 0) {
    const tableFrequency = {};
    
    joinData.joins.forEach(join => {
      if (join.mainTableId) {
        tableFrequency[join.mainTableId] = (tableFrequency[join.mainTableId] || 0) + 1;
      }
      if (join.joinTableId) {
        tableFrequency[join.joinTableId] = (tableFrequency[join.joinTableId] || 0) + 1;
      }
    });
    
    // 找出出现最多的表
    Object.entries(tableFrequency).forEach(([id, frequency]) => {
      if (frequency > mainTableFrequency) {
        mainTableFrequency = frequency;
        mainTableId = parseInt(id);
      }
    });
  }
  
  // 如果找不到主表，使用第一个表
  const mainTable = mainTableId 
    ? joinData.selectedTables.find(t => t.id === mainTableId) 
    : joinData.selectedTables[0];
  
  // 初始化API配置
  apiBuilderService.initApiConfig(
    name,
    API_TYPES.QUERY,
    description,
    mainTable.name
  );

  // 准备字段列表
  const fields = [];
  
  // 从selectedColumns中获取字段信息并添加到fields
  if (selectedColumns && selectedColumns.length > 0) {
    // 构建所有可用列的映射，以便通过ID查找
    const allColumnsMap = {};
    joinData.selectedTables.forEach(table => {
      table.columns.forEach(column => {
        const columnId = `${table.id}_${column.id}`;
        allColumnsMap[columnId] = {
          table: table.name,
          name: column.name,
          alias: `${table.name}_${column.name}`,
          type: column.type
        };
      });
    });
    
    // 添加所选字段
    selectedColumns.forEach(columnId => {
      if (allColumnsMap[columnId]) {
        fields.push(allColumnsMap[columnId]);
      }
    });
  } else {
    // 如果没有指定selectedColumns，使用所有字段
    joinData.selectedTables.forEach(table => {
      table.columns.forEach(column => {
        fields.push({
          table: table.name,
          name: column.name,
          alias: `${table.name}_${column.name}`,
          type: column.type
        });
      });
    });
  }
  
  // 添加字段到API配置
  apiBuilderService.addFields(fields);
  
  // 处理连接条件
  if (joinData.joins && joinData.joins.length > 0) {
    // 创建表和表连接的映射
    const joinMap = new Map();
    const processedJoins = new Set();
    
    // 主表和已连接表的ID集合
    const connectedTables = new Set([mainTable.id]);
    
    // 验证所有join关系
    const validJoins = [];
    
    joinData.joins.forEach(join => {
      // 找到相关的表和列
      const sourceTable = joinData.selectedTables.find(t => t.id === join.mainTableId);
      const targetTable = joinData.selectedTables.find(t => t.id === join.joinTableId);
      const sourceColumn = sourceTable?.columns.find(c => c.id === join.mainTableColumn);
      const targetColumn = targetTable?.columns.find(c => c.id === join.joinTableColumn);
      
      if (sourceTable && targetTable && sourceColumn && targetColumn) {
        validJoins.push({
          ...join,
          sourceTableName: sourceTable.name,
          targetTableName: targetTable.name,
          sourceColumnName: sourceColumn.name,
          targetColumnName: targetColumn.name
        });
      }
    });
    
    // 首先处理与主表直接连接的表
    const directJoins = validJoins.filter(j => j.mainTableId === mainTable.id || j.joinTableId === mainTable.id);
    
    directJoins.forEach(join => {
      // 确保以主表作为连接的源表
      let joinType = join.joinType ? join.joinType.toLowerCase() : 'inner join';
      let sourceTable, targetTable, sourceField, targetField;
      
      if (join.mainTableId === mainTable.id) {
        // 当前主表是JOIN关系中的主表
        sourceTable = join.sourceTableName;
        targetTable = join.targetTableName;
        sourceField = join.sourceColumnName;
        targetField = join.targetColumnName;
      } else {
        // 当前主表是JOIN关系中的目标表 - 需要翻转连接
        sourceTable = join.targetTableName;
        targetTable = join.sourceTableName;
        sourceField = join.targetColumnName;
        targetField = join.sourceColumnName;
        
        // 调整JOIN类型 (LEFT 变 RIGHT, RIGHT 变 LEFT)
        if (joinType.includes('left')) {
          joinType = joinType.replace('left', 'right');
        } else if (joinType.includes('right')) {
          joinType = joinType.replace('right', 'left');
        }
      }
      
      // 解析JOIN类型
      let joinTypeEnum = JOIN_TYPES.INNER;
      if (joinType.includes('left')) {
        joinTypeEnum = JOIN_TYPES.LEFT;
      } else if (joinType.includes('right')) {
        joinTypeEnum = JOIN_TYPES.RIGHT;
      } else if (joinType.includes('full')) {
        joinTypeEnum = JOIN_TYPES.FULL;
      }
      
      // 创建连接条件
      const joinConditions = [{
        sourceTable,
        sourceField,
        targetTable,
        targetField
      }];
      
      // 添加连接条件到API配置
      apiBuilderService.addJoin(targetTable, joinTypeEnum, joinConditions);
      
      // 标记此JOIN已处理
      processedJoins.add(join.id);
      
      // 标记表已连接
      if (join.mainTableId === mainTable.id) {
        connectedTables.add(join.joinTableId);
      } else {
        connectedTables.add(join.mainTableId);
      }
    });
    
    // 处理剩余的JOIN，直到所有连接都处理完或者无法处理更多
    let remainingJoins = validJoins.filter(j => !processedJoins.has(j.id));
    let lastRemainingCount = remainingJoins.length + 1;
    
    while (remainingJoins.length > 0 && remainingJoins.length < lastRemainingCount) {
      lastRemainingCount = remainingJoins.length;
      
      // 找出下一批可以连接的JOIN（至少一端已连接）
      const nextJoins = remainingJoins.filter(join => 
        connectedTables.has(join.mainTableId) || connectedTables.has(join.joinTableId)
      );
      
      // 添加这些JOIN
      nextJoins.forEach(join => {
        let joinType = join.joinType ? join.joinType.toLowerCase() : 'inner join';
        let sourceTable, targetTable, sourceField, targetField;
        
        if (connectedTables.has(join.mainTableId)) {
          // 使用主表作为源表
          sourceTable = join.sourceTableName;
          targetTable = join.targetTableName;
          sourceField = join.sourceColumnName;
          targetField = join.targetColumnName;
        } else {
          // 翻转连接
          sourceTable = join.targetTableName;
          targetTable = join.sourceTableName;
          sourceField = join.targetColumnName;
          targetField = join.sourceColumnName;
          
          // 调整JOIN类型
          if (joinType.includes('left')) {
            joinType = joinType.replace('left', 'right');
          } else if (joinType.includes('right')) {
            joinType = joinType.replace('right', 'left');
          }
        }
        
        // 解析JOIN类型
        let joinTypeEnum = JOIN_TYPES.INNER;
        if (joinType.includes('left')) {
          joinTypeEnum = JOIN_TYPES.LEFT;
        } else if (joinType.includes('right')) {
          joinTypeEnum = JOIN_TYPES.RIGHT;
        } else if (joinType.includes('full')) {
          joinTypeEnum = JOIN_TYPES.FULL;
        }
        
        // 创建连接条件
        const joinConditions = [{
          sourceTable,
          sourceField,
          targetTable,
          targetField
        }];
        
        // 添加连接条件到API配置
        apiBuilderService.addJoin(targetTable, joinTypeEnum, joinConditions);
        
        // 标记此JOIN已处理
        processedJoins.add(join.id);
        
        // 标记表已连接
        connectedTables.add(join.mainTableId);
        connectedTables.add(join.joinTableId);
      });
      
      // 更新剩余JOIN列表
      remainingJoins = validJoins.filter(j => !processedJoins.has(j.id));
    }
  }
  
  return apiBuilderService;
};

/**
 * 从ApiBuilderService生成的SQL中提取表和连接条件
 * @param {string} sql - SQL查询语句
 * @returns {Object} 提取的表和连接信息
 */
export const extractJoinInfoFromSql = (sql) => {
  const result = {
    mainTable: '',
    joins: []
  };
  
  // 提取主表
  const fromMatch = sql.match(/FROM\s+(\w+)/i);
  if (fromMatch && fromMatch[1]) {
    result.mainTable = fromMatch[1];
  }
  
  // 提取连接
  const joinRegex = /(INNER|LEFT|RIGHT|FULL)\s+JOIN\s+(\w+)\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/gi;
  let match;
  
  while ((match = joinRegex.exec(sql)) !== null) {
    const [, joinType, targetTable, sourceTable, sourceField, targetTableInCond, targetField] = match;
    
    result.joins.push({
      joinType: joinType.toUpperCase(),
      targetTable,
      sourceTable,
      sourceField,
      targetTableInCond,
      targetField
    });
  }
  
  return result;
};

export default {
  convertJoinDataToApiBuilder,
  extractJoinInfoFromSql
}; 