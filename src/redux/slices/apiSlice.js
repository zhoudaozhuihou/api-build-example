import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// API类型枚举
export const API_TYPES = {
  UPLOADED: 'uploaded',      // 上传的API信息（无需订阅，仅展示）
  LOWCODE_DB: 'lowcode_db',  // 低代码构建基于数据库的API（需要订阅）
  LOWCODE_DS: 'lowcode_ds',  // 低代码构建基于数据集的API（需要订阅）
};

// API状态枚举
export const API_STATUS = {
  DRAFT: 'draft',                // 草稿状态
  PENDING_REVIEW: 'pending_review', // 待审核
  APPROVED: 'approved',          // 已审核通过
  REJECTED: 'rejected',          // 审核拒绝
  PUBLISHED: 'published',        // 已发布
  DEPRECATED: 'deprecated',      // 已弃用
};

// API adapter
const apisAdapter = createEntityAdapter({
  selectId: api => api.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
});

// 初始状态
export const initialState = {
  apis: [
    {
      id: 'api_001',
      name: '用户管理API',
      description: '用户相关的API集合',
      version: '1.0.0',
      basePath: '/api/v1/users',
      endpoints: [
        {
          id: 'endpoint_001',
          name: '获取用户列表',
          path: '/',
          method: 'GET',
          description: '获取所有用户列表',
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: '页码',
              required: false,
              type: 'integer'
            },
            {
              name: 'size',
              in: 'query',
              description: '每页数量',
              required: false,
              type: 'integer'
            }
          ],
          responses: {
            '200': {
              description: '成功获取用户列表',
              schema: {
                type: 'array',
                items: {
                  $ref: '#/definitions/User'
                }
              }
            }
          }
        }
      ],
      dataset: 'dataset_001',
      status: 'active',
      createdAt: '2024-03-15T08:00:00Z',
      updatedAt: '2024-03-15T08:00:00Z'
    }
  ],
  status: 'idle',
  error: null,
  categories: [],
  selectedCategory: null,
  filters: {
    type: null,
    status: null,
    searchTerm: ''
  }
};

// 获取所有API
export const fetchApis = createAsyncThunk(
  'apis/fetchApis',
  async () => {
    try {
      // 这里可以替换为真实的API调用
      // 目前使用localStorage模拟数据
      const apis = JSON.parse(localStorage.getItem('apis')) || [];
      return apis;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 获取所有分类
export const fetchCategories = createAsyncThunk(
  'apis/fetchCategories',
  async () => {
    try {
      // 这里可以替换为真实的API调用
      // 目前使用预设数据
      return [
        { id: '1', name: '用户服务', description: '用户相关的API服务' },
        { id: '2', name: '订单服务', description: '订单处理相关的API服务' },
        { id: '3', name: '商品服务', description: '商品管理相关的API服务' },
        { id: '4', name: '支付服务', description: '支付相关的API服务' },
        { id: '5', name: '消息服务', description: '消息推送相关的API服务' },
      ];
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 创建新API
export const createApi = createAsyncThunk(
  'apis/createApi',
  async (apiData) => {
    try {
      // 指定API类型和状态
      const newApi = {
        ...apiData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: apiData.type === API_TYPES.UPLOADED 
          ? API_STATUS.PUBLISHED  // 上传API默认为已发布
          : API_STATUS.PENDING_REVIEW, // 低代码构建API需要审核
        needsSubscription: apiData.type !== API_TYPES.UPLOADED, // 上传的API不需要订阅
      };
      
      // 保存到localStorage
      const existingApis = JSON.parse(localStorage.getItem('apis')) || [];
      localStorage.setItem('apis', JSON.stringify([...existingApis, newApi]));
      
      return newApi;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 更新API状态
export const updateApiStatus = createAsyncThunk(
  'apis/updateApiStatus',
  async ({ id, status }) => {
    try {
      const apis = JSON.parse(localStorage.getItem('apis')) || [];
      const updatedApis = apis.map(api => 
        api.id === id ? { ...api, status } : api
      );
      localStorage.setItem('apis', JSON.stringify(updatedApis));
      return { id, changes: { status } };
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 绑定数据集到API
export const bindDatasetToApi = createAsyncThunk(
  'apis/bindDatasetToApi',
  async ({ apiId, datasetId, datasetName }) => {
    try {
      const apis = JSON.parse(localStorage.getItem('apis')) || [];
      const updatedApis = apis.map(api => 
        api.id === apiId 
          ? { 
              ...api, 
              datasetId,
              datasetName,
              isDatasetBound: true,
              type: API_TYPES.LOWCODE_DS // 更新为基于数据集的API
            } 
          : api
      );
      localStorage.setItem('apis', JSON.stringify(updatedApis));
      return { 
        id: apiId, 
        changes: { 
          datasetId, 
          datasetName, 
          isDatasetBound: true,
          type: API_TYPES.LOWCODE_DS
        } 
      };
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

const apiSlice = createSlice({
  name: 'apis',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setApiFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    clearApiFilters: (state) => {
      state.filters = {
        type: null,
        status: null,
        searchTerm: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch APIs
      .addCase(fetchApis.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        apisAdapter.setAll(state, action.payload);
      })
      .addCase(fetchApis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create API
      .addCase(createApi.fulfilled, (state, action) => {
        apisAdapter.addOne(state, action.payload);
      })
      // Update API Status
      .addCase(updateApiStatus.fulfilled, (state, action) => {
        apisAdapter.updateOne(state, action.payload);
      })
      // Bind Dataset to API
      .addCase(bindDatasetToApi.fulfilled, (state, action) => {
        apisAdapter.updateOne(state, action.payload);
      });
  }
});

export const { 
  setSelectedCategory, 
  setApiFilters,
  clearApiFilters
} = apiSlice.actions;

// 导出适配器选择器
export const {
  selectAll: selectAllApis,
  selectById: selectApiById,
  selectIds: selectApiIds
} = apisAdapter.getSelectors(state => state.api);

// 自定义选择器
export const selectApisByCategory = createSelector(
  [selectAllApis, (state, categoryId) => categoryId],
  (apis, categoryId) => apis.filter(api => 
    api.categories?.includes(categoryId)
  )
);

export const selectFilteredApis = createSelector(
  [
    selectAllApis,
    (state) => state.api.filters,
    (state) => state.api.selectedCategory
  ],
  (apis, filters, selectedCategory) => {
    return apis.filter(api => {
      // 按分类筛选
      if (selectedCategory && !api.categories?.includes(selectedCategory)) {
        return false;
      }
      
      // 按API类型筛选
      if (filters.type && api.type !== filters.type) {
        return false;
      }
      
      // 按状态筛选
      if (filters.status && api.status !== filters.status) {
        return false;
      }
      
      // 按搜索词筛选
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          api.name.toLowerCase().includes(term) ||
          api.description.toLowerCase().includes(term) ||
          api.path.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
  }
);

// 获取API统计数据
export const selectApiStats = createSelector(
  [selectAllApis],
  (apis) => {
    const total = apis.length;
    const byType = {
      [API_TYPES.UPLOADED]: apis.filter(api => api.type === API_TYPES.UPLOADED).length,
      [API_TYPES.LOWCODE_DB]: apis.filter(api => api.type === API_TYPES.LOWCODE_DB).length,
      [API_TYPES.LOWCODE_DS]: apis.filter(api => api.type === API_TYPES.LOWCODE_DS).length,
    };
    const byStatus = {
      [API_STATUS.DRAFT]: apis.filter(api => api.status === API_STATUS.DRAFT).length,
      [API_STATUS.PENDING_REVIEW]: apis.filter(api => api.status === API_STATUS.PENDING_REVIEW).length,
      [API_STATUS.APPROVED]: apis.filter(api => api.status === API_STATUS.APPROVED).length,
      [API_STATUS.REJECTED]: apis.filter(api => api.status === API_STATUS.REJECTED).length,
      [API_STATUS.PUBLISHED]: apis.filter(api => api.status === API_STATUS.PUBLISHED).length,
      [API_STATUS.DEPRECATED]: apis.filter(api => api.status === API_STATUS.DEPRECATED).length,
    };
    const withDataset = apis.filter(api => api.isDatasetBound).length;
    
    return {
      total,
      byType,
      byStatus,
      withDataset
    };
  }
);

export default apiSlice.reducer; 