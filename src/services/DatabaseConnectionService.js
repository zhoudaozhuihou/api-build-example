/**
 * DatabaseConnectionService
 * 用于管理数据库连接的服务
 */
class DatabaseConnectionService {
  constructor() {
    this.storageKey = 'db_connections';
  }

  /**
   * 获取所有保存的数据库连接
   * @returns {Array} 数据库连接列表
   */
  getAllConnections() {
    try {
      const connections = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      return connections;
    } catch (error) {
      console.error('Error loading database connections:', error);
      return [];
    }
  }

  /**
   * 根据ID获取数据库连接
   * @param {string} id 连接ID
   * @returns {Object|null} 数据库连接对象或null
   */
  getConnectionById(id) {
    const connections = this.getAllConnections();
    return connections.find(conn => conn.id === id) || null;
  }

  /**
   * 保存新的数据库连接
   * @param {Object} connection 数据库连接配置
   * @returns {Object} 保存后的连接(包含ID)
   */
  saveConnection(connection) {
    try {
      const connections = this.getAllConnections();
      
      // 为新连接生成唯一ID
      const newConnection = {
        ...connection,
        id: connection.id || Date.now().toString(),
        createdAt: connection.createdAt || new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };
      
      // 检查是否已存在同名连接
      const existingIndex = connections.findIndex(conn => conn.name === newConnection.name);
      
      if (existingIndex >= 0) {
        // 更新现有连接
        connections[existingIndex] = newConnection;
      } else {
        // 添加新连接
        connections.push(newConnection);
      }
      
      // 保存到localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(connections));
      
      return newConnection;
    } catch (error) {
      console.error('Error saving database connection:', error);
      throw new Error('保存数据库连接失败');
    }
  }

  /**
   * 更新现有数据库连接
   * @param {string} id 连接ID
   * @param {Object} connectionData 更新的连接数据
   * @returns {Object} 更新后的连接
   */
  updateConnection(id, connectionData) {
    try {
      const connections = this.getAllConnections();
      const index = connections.findIndex(conn => conn.id === id);
      
      if (index === -1) {
        throw new Error('数据库连接不存在');
      }
      
      const updatedConnection = {
        ...connections[index],
        ...connectionData,
        lastUsed: new Date().toISOString()
      };
      
      connections[index] = updatedConnection;
      localStorage.setItem(this.storageKey, JSON.stringify(connections));
      
      return updatedConnection;
    } catch (error) {
      console.error('Error updating database connection:', error);
      throw new Error('更新数据库连接失败');
    }
  }

  /**
   * 删除数据库连接
   * @param {string} id 连接ID
   * @returns {boolean} 是否删除成功
   */
  deleteConnection(id) {
    try {
      const connections = this.getAllConnections();
      const filteredConnections = connections.filter(conn => conn.id !== id);
      
      if (filteredConnections.length === connections.length) {
        return false; // 未找到要删除的连接
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredConnections));
      return true;
    } catch (error) {
      console.error('Error deleting database connection:', error);
      throw new Error('删除数据库连接失败');
    }
  }

  /**
   * 测试数据库连接
   * @param {Object} connectionConfig 数据库连接配置
   * @returns {Promise<boolean>} 连接是否成功
   */
  async testConnection(connectionConfig) {
    try {
      // 实际环境中，这里应该发送请求到后端API测试连接
      // 这里模拟连接测试，随机生成成功或失败
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error testing database connection:', error);
      throw new Error('测试数据库连接失败: ' + error.message);
    }
  }

  /**
   * 记录连接使用
   * @param {string} id 连接ID
   */
  markConnectionAsUsed(id) {
    try {
      const connections = this.getAllConnections();
      const index = connections.findIndex(conn => conn.id === id);
      
      if (index !== -1) {
        connections[index].lastUsed = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(connections));
      }
    } catch (error) {
      console.error('Error updating last used timestamp:', error);
    }
  }
}

export default new DatabaseConnectionService(); 