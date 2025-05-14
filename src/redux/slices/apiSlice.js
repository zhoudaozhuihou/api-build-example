import { createSlice } from '@reduxjs/toolkit';

// API相关数据的初始状态
const initialState = {
  apis: [],
  filteredApis: [],
  currentApi: null,
  categories: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  }
};

export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    fetchApisStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchApisSuccess: (state, action) => {
      state.apis = action.payload;
      state.filteredApis = action.payload;
      state.loading = false;
      state.pagination.total = action.payload.length;
    },
    fetchApisFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentApi: (state, action) => {
      state.currentApi = action.payload;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
    },
    searchApis: (state, action) => {
      state.searchTerm = action.payload;
      if (action.payload === '') {
        state.filteredApis = state.apis;
      } else {
        state.filteredApis = state.apis.filter(api => 
          api.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          api.description.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
      state.pagination.page = 1;
      state.pagination.total = state.filteredApis.length;
    },
    filterByCategory: (state, action) => {
      state.selectedCategory = action.payload;
      if (!action.payload) {
        state.filteredApis = state.apis;
      } else {
        state.filteredApis = state.apis.filter(api => 
          api.category === action.payload || 
          api.categories?.includes(action.payload)
        );
      }
      state.pagination.page = 1;
      state.pagination.total = state.filteredApis.length;
    },
    changePage: (state, action) => {
      state.pagination.page = action.payload;
    },
    changePageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1;
    },
    addApi: (state, action) => {
      state.apis.push(action.payload);
      state.filteredApis = [...state.apis];
      state.pagination.total = state.filteredApis.length;
    },
    updateApi: (state, action) => {
      const index = state.apis.findIndex(api => api.id === action.payload.id);
      if (index !== -1) {
        state.apis[index] = action.payload;
        state.filteredApis = [...state.apis];
        if (state.currentApi && state.currentApi.id === action.payload.id) {
          state.currentApi = action.payload;
        }
      }
    },
    deleteApi: (state, action) => {
      state.apis = state.apis.filter(api => api.id !== action.payload);
      state.filteredApis = state.filteredApis.filter(api => api.id !== action.payload);
      state.pagination.total = state.filteredApis.length;
      if (state.currentApi && state.currentApi.id === action.payload) {
        state.currentApi = null;
      }
    }
  },
});

export const {
  fetchApisStart,
  fetchApisSuccess,
  fetchApisFailure,
  setCurrentApi,
  fetchCategoriesSuccess,
  searchApis,
  filterByCategory,
  changePage,
  changePageSize,
  addApi,
  updateApi,
  deleteApi
} = apiSlice.actions;

// 模拟数据
const mockApis = [
  {
    id: 1,
    name: '支付API',
    description: '处理在线支付交易的API接口',
    version: '1.0.0',
    method: 'POST',
    endpoint: '/api/payment',
    category: '支付服务',
    tags: ['支付', '交易'],
    published: true,
    createdAt: '2023-01-15',
    updatedAt: '2023-05-20',
  },
  {
    id: 2,
    name: '用户认证API',
    description: '用户登录和认证服务',
    version: '2.1.0',
    method: 'POST',
    endpoint: '/api/auth',
    category: '用户服务',
    tags: ['认证', '登录', '安全'],
    published: true,
    createdAt: '2023-02-10',
    updatedAt: '2023-06-15',
  },
  {
    id: 3,
    name: '产品目录API',
    description: '获取产品列表和详情',
    version: '1.5.0',
    method: 'GET',
    endpoint: '/api/products',
    category: '产品服务',
    tags: ['产品', '目录'],
    published: true,
    createdAt: '2023-03-05',
    updatedAt: '2023-04-20',
  }
];

const mockCategories = [
  { id: 1, name: '支付服务', parentId: null },
  { id: 2, name: '用户服务', parentId: null },
  { id: 3, name: '产品服务', parentId: null },
  { id: 4, name: '数据服务', parentId: null },
  { id: 5, name: '第三方支付', parentId: 1 },
  { id: 6, name: '内部支付', parentId: 1 },
  { id: 7, name: '认证服务', parentId: 2 },
  { id: 8, name: '用户管理', parentId: 2 },
];

// 异步action creator
export const fetchApis = () => async (dispatch) => {
  try {
    dispatch(fetchApisStart());
    // 真实环境中应该从API获取数据
    // const response = await apiService.getApis();
    
    setTimeout(() => {
      dispatch(fetchApisSuccess(mockApis));
    }, 1000);
  } catch (error) {
    dispatch(fetchApisFailure(error.message));
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    // 真实环境中应该从API获取数据
    // const response = await apiService.getCategories();
    
    setTimeout(() => {
      dispatch(fetchCategoriesSuccess(mockCategories));
    }, 1000);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

// 选择器
export const selectApis = (state) => state.api.apis;
export const selectFilteredApis = (state) => state.api.filteredApis;
export const selectCurrentApi = (state) => state.api.currentApi;
export const selectCategories = (state) => state.api.categories;
export const selectApiLoading = (state) => state.api.loading;
export const selectApiError = (state) => state.api.error;
export const selectSearchTerm = (state) => state.api.searchTerm;
export const selectSelectedCategory = (state) => state.api.selectedCategory;
export const selectPagination = (state) => state.api.pagination;

// 获取当前页的API数据
export const selectPaginatedApis = (state) => {
  const { filteredApis, pagination } = state.api;
  const { page, pageSize } = pagination;
  const startIndex = (page - 1) * pageSize;
  return filteredApis.slice(startIndex, startIndex + pageSize);
};

export default apiSlice.reducer; 