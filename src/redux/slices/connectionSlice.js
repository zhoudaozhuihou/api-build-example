import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 初始状态
const initialState = {
  connections: [
    {
      id: 'conn_001',
      name: '主数据库',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'main_db',
      username: 'admin',
      description: '主业务数据库',
      isActive: true,
      createdAt: '2024-03-15T08:00:00Z',
      updatedAt: '2024-03-15T08:00:00Z',
      tables: [
        {
          id: 'tbl_001',
          name: 'users',
          description: '用户信息表',
          rowCount: 10000,
          size: '2.5MB',
          columns: [
            { name: 'id', type: 'INTEGER', description: '用户ID' },
            { name: 'username', type: 'VARCHAR', description: '用户名' },
            { name: 'email', type: 'VARCHAR', description: '邮箱' },
            { name: 'created_at', type: 'TIMESTAMP', description: '创建时间' }
          ]
        },
        {
          id: 'tbl_002',
          name: 'orders',
          description: '订单信息表',
          rowCount: 50000,
          size: '5MB',
          columns: [
            { name: 'order_id', type: 'INTEGER', description: '订单ID' },
            { name: 'user_id', type: 'INTEGER', description: '用户ID' },
            { name: 'amount', type: 'DECIMAL', description: '订单金额' },
            { name: 'status', type: 'VARCHAR', description: '订单状态' }
          ]
        }
      ]
    },
    {
      id: 'conn_002',
      name: '产品数据库',
      type: 'postgresql',
      host: 'localhost',
      port: 5432,
      database: 'product_db',
      username: 'admin',
      description: '产品管理数据库',
      isActive: true,
      createdAt: '2024-03-14T10:00:00Z',
      updatedAt: '2024-03-14T10:00:00Z',
      tables: [
        {
          id: 'tbl_003',
          name: 'products',
          description: '产品信息表',
          rowCount: 2000,
          size: '1MB',
          columns: [
            { name: 'product_id', type: 'INTEGER', description: '产品ID' },
            { name: 'name', type: 'VARCHAR', description: '产品名称' },
            { name: 'price', type: 'DECIMAL', description: '产品价格' },
            { name: 'stock', type: 'INTEGER', description: '库存数量' }
          ]
        }
      ]
    }
  ],
  status: 'idle',
  error: null
};

// 导出 initialState
export { initialState };

// 获取所有数据库连接
export const fetchConnections = createAsyncThunk(
  'connections/fetchConnections',
  async () => {
    try {
      const connections = JSON.parse(localStorage.getItem('connections')) || [];
      return connections;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 创建新的数据库连接
export const createConnection = createAsyncThunk(
  'connections/createConnection',
  async (connectionData) => {
    try {
      const newConnection = {
        ...connectionData,
        id: `conn_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        tables: []
      };
      
      const existingConnections = JSON.parse(localStorage.getItem('connections')) || [];
      localStorage.setItem('connections', JSON.stringify([...existingConnections, newConnection]));
      
      return newConnection;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 更新数据库连接
export const updateConnection = createAsyncThunk(
  'connections/updateConnection',
  async ({ id, changes }) => {
    try {
      const connections = JSON.parse(localStorage.getItem('connections')) || [];
      const updatedConnections = connections.map(conn => 
        conn.id === id ? { ...conn, ...changes, updatedAt: new Date().toISOString() } : conn
      );
      localStorage.setItem('connections', JSON.stringify(updatedConnections));
      return { id, changes };
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 删除数据库连接
export const deleteConnection = createAsyncThunk(
  'connections/deleteConnection',
  async (id) => {
    try {
      const connections = JSON.parse(localStorage.getItem('connections')) || [];
      const updatedConnections = connections.filter(conn => conn.id !== id);
      localStorage.setItem('connections', JSON.stringify(updatedConnections));
      return id;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

const connectionSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setConnectionStatus: (state, action) => {
      const { id, isActive } = action.payload;
      const connection = state.connections.find(conn => conn.id === id);
      if (connection) {
        connection.isActive = isActive;
        connection.updatedAt = new Date().toISOString();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Connections
      .addCase(fetchConnections.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.connections = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create Connection
      .addCase(createConnection.fulfilled, (state, action) => {
        state.connections.push(action.payload);
      })
      // Update Connection
      .addCase(updateConnection.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const connection = state.connections.find(conn => conn.id === id);
        if (connection) {
          Object.assign(connection, changes);
        }
      })
      // Delete Connection
      .addCase(deleteConnection.fulfilled, (state, action) => {
        state.connections = state.connections.filter(conn => conn.id !== action.payload);
      });
  }
});

export const { setConnectionStatus } = connectionSlice.actions;

// 选择器
export const selectAllConnections = (state) => state.connections.connections;
export const selectConnectionById = (state, id) => 
  state.connections.connections.find(conn => conn.id === id);
export const selectActiveConnections = (state) => 
  state.connections.connections.filter(conn => conn.isActive);

export default connectionSlice.reducer; 
