import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

// 数据集类型枚举
export const DATASET_TYPES = {
  STRUCTURED: 'structured',         // 结构化数据
  UNSTRUCTURED: 'unstructured',     // 非结构化数据
  SEMI_STRUCTURED: 'semi_structured' // 半结构化数据
};

// 数据集格式枚举
export const DATASET_FORMATS = {
  RELATIONAL: 'relational',     // 关系型数据
  DOCUMENT: 'document',         // 文档型数据
  TIME_SERIES: 'time_series',   // 时序数据
  GRAPH: 'graph',               // 图数据
  BINARY: 'binary'              // 二进制数据
};

// 数据集状态枚举
export const DATASET_STATUS = {
  DRAFT: 'draft',                // 草稿状态
  PENDING_REVIEW: 'pending_review', // 待审核
  APPROVED: 'approved',          // 已审核通过
  REJECTED: 'rejected',          // 审核拒绝
  PUBLISHED: 'published',        // 已发布
  DEPRECATED: 'deprecated',      // 已弃用
};

// 数据集来源枚举
export const DATASET_SOURCES = {
  INTERNAL: 'internal',          // 内部平台
  EXTERNAL: 'external',          // 外部平台接入
  UPLOADED: 'uploaded'           // 用户上传
};

// 数据集适配器
const datasetsAdapter = createEntityAdapter({
  selectId: dataset => dataset.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
});

// 初始状态
const initialState = datasetsAdapter.getInitialState({
  status: 'idle',
  error: null,
  selectedDataset: null,
  // 继承API的分类系统，不单独维护
  dbTableMappings: [], // 数据集和数据库表之间的映射关系
  filters: {
    type: null,
    format: null,
    source: null,
    searchTerm: ''
  }
});

// 获取所有数据集
export const fetchDatasets = createAsyncThunk(
  'datasets/fetchDatasets',
  async () => {
    try {
      // 这里可以替换为真实的API调用
      // 目前使用localStorage模拟数据
      const datasets = JSON.parse(localStorage.getItem('datasets')) || [];
      return datasets;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 创建新数据集
export const createDataset = createAsyncThunk(
  'datasets/createDataset',
  async (datasetData) => {
    try {
      // 创建新数据集
      const newDataset = {
        ...datasetData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        // 如果没有指定状态，默认为待审核
        status: datasetData.status || DATASET_STATUS.PENDING_REVIEW,
        // 关联的API ID列表
        linkedApis: [],
      };
      
      // 保存到localStorage
      const existingDatasets = JSON.parse(localStorage.getItem('datasets')) || [];
      localStorage.setItem('datasets', JSON.stringify([...existingDatasets, newDataset]));
      
      return newDataset;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 更新数据集
export const updateDataset = createAsyncThunk(
  'datasets/updateDataset',
  async ({id, changes}) => {
    try {
      const datasets = JSON.parse(localStorage.getItem('datasets')) || [];
      const updatedDatasets = datasets.map(dataset => 
        dataset.id === id ? { ...dataset, ...changes } : dataset
      );
      localStorage.setItem('datasets', JSON.stringify(updatedDatasets));
      return { id, changes };
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 关联API到数据集
export const linkApiToDataset = createAsyncThunk(
  'datasets/linkApiToDataset',
  async ({ datasetId, apiId }) => {
    try {
      // 更新数据集中的linkedApis
      const datasets = JSON.parse(localStorage.getItem('datasets')) || [];
      const datasetIndex = datasets.findIndex(ds => ds.id === datasetId);
      
      if (datasetIndex === -1) {
        throw new Error('Dataset not found');
      }
      
      // 添加API关联
      const updatedDataset = {
        ...datasets[datasetIndex],
        linkedApis: [...(datasets[datasetIndex].linkedApis || []), apiId]
      };
      
      datasets[datasetIndex] = updatedDataset;
      localStorage.setItem('datasets', JSON.stringify(datasets));
      
      return { id: datasetId, changes: { linkedApis: updatedDataset.linkedApis } };
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 关联数据集与数据库表
export const mapDatasetToDbTable = createAsyncThunk(
  'datasets/mapDatasetToDbTable',
  async ({ datasetId, dbConnection, tableName, mappingInfo }) => {
    try {
      const mapping = {
        id: Date.now().toString(),
        datasetId,
        dbConnection,
        tableName,
        // 字段映射
        fieldMappings: mappingInfo.fieldMappings || [],
        // 查询条件
        queryConditions: mappingInfo.queryConditions || [],
        // 创建时间
        createdAt: new Date().toISOString()
      };
      
      // 保存到localStorage
      const existingMappings = JSON.parse(localStorage.getItem('dbTableMappings')) || [];
      localStorage.setItem('dbTableMappings', JSON.stringify([...existingMappings, mapping]));
      
      return mapping;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// 加载数据库表映射
export const fetchDbTableMappings = createAsyncThunk(
  'datasets/fetchDbTableMappings',
  async () => {
    try {
      const mappings = JSON.parse(localStorage.getItem('dbTableMappings')) || [];
      return mappings;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

const datasetSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    setSelectedDataset: (state, action) => {
      state.selectedDataset = action.payload;
    },
    setDatasetFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    clearDatasetFilters: (state) => {
      state.filters = {
        type: null,
        format: null,
        source: null,
        searchTerm: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Datasets
      .addCase(fetchDatasets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        datasetsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchDatasets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create Dataset
      .addCase(createDataset.fulfilled, (state, action) => {
        datasetsAdapter.addOne(state, action.payload);
      })
      // Update Dataset
      .addCase(updateDataset.fulfilled, (state, action) => {
        datasetsAdapter.updateOne(state, action.payload);
      })
      // Link API to Dataset
      .addCase(linkApiToDataset.fulfilled, (state, action) => {
        datasetsAdapter.updateOne(state, action.payload);
      })
      // Fetch DB Table Mappings
      .addCase(fetchDbTableMappings.fulfilled, (state, action) => {
        state.dbTableMappings = action.payload;
      })
      // Map Dataset to DB Table
      .addCase(mapDatasetToDbTable.fulfilled, (state, action) => {
        state.dbTableMappings.push(action.payload);
      });
  }
});

export const { 
  setSelectedDataset, 
  setDatasetFilters,
  clearDatasetFilters
} = datasetSlice.actions;

// 导出适配器选择器
export const {
  selectAll: selectAllDatasets,
  selectById: selectDatasetById,
  selectIds: selectDatasetIds
} = datasetsAdapter.getSelectors(state => state.datasets);

// 自定义选择器
export const selectFilteredDatasets = createSelector(
  [
    selectAllDatasets,
    (state) => state.datasets.filters
  ],
  (datasets, filters) => {
    return datasets.filter(dataset => {
      // 按类型筛选
      if (filters.type && dataset.type !== filters.type) {
        return false;
      }
      
      // 按格式筛选
      if (filters.format && dataset.format !== filters.format) {
        return false;
      }
      
      // 按来源筛选
      if (filters.source && dataset.source !== filters.source) {
        return false;
      }
      
      // 按搜索词筛选
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          dataset.name.toLowerCase().includes(term) ||
          dataset.description.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
  }
);

// 获取数据集的关联API
export const selectDatasetApis = createSelector(
  [
    (state, datasetId) => datasetId,
    selectDatasetById,
    state => state.api.entities
  ],
  (datasetId, dataset, apiEntities) => {
    if (!dataset || !dataset.linkedApis || !apiEntities) return [];
    
    return dataset.linkedApis
      .map(apiId => apiEntities[apiId])
      .filter(api => api != null);
  }
);

// 获取数据集对应的数据库表映射
export const selectDatasetDbMappings = createSelector(
  [
    (state, datasetId) => datasetId,
    state => state.datasets.dbTableMappings
  ],
  (datasetId, mappings) => {
    return mappings.filter(mapping => mapping.datasetId === datasetId);
  }
);

// 获取数据集统计数据
export const selectDatasetStats = createSelector(
  [selectAllDatasets],
  (datasets) => {
    const total = datasets.length;
    const byType = {
      [DATASET_TYPES.STRUCTURED]: datasets.filter(ds => ds.type === DATASET_TYPES.STRUCTURED).length,
      [DATASET_TYPES.UNSTRUCTURED]: datasets.filter(ds => ds.type === DATASET_TYPES.UNSTRUCTURED).length,
      [DATASET_TYPES.SEMI_STRUCTURED]: datasets.filter(ds => ds.type === DATASET_TYPES.SEMI_STRUCTURED).length,
    };
    const byFormat = {
      [DATASET_FORMATS.RELATIONAL]: datasets.filter(ds => ds.format === DATASET_FORMATS.RELATIONAL).length,
      [DATASET_FORMATS.DOCUMENT]: datasets.filter(ds => ds.format === DATASET_FORMATS.DOCUMENT).length,
      [DATASET_FORMATS.TIME_SERIES]: datasets.filter(ds => ds.format === DATASET_FORMATS.TIME_SERIES).length,
      [DATASET_FORMATS.GRAPH]: datasets.filter(ds => ds.format === DATASET_FORMATS.GRAPH).length,
      [DATASET_FORMATS.BINARY]: datasets.filter(ds => ds.format === DATASET_FORMATS.BINARY).length,
    };
    const bySource = {
      [DATASET_SOURCES.INTERNAL]: datasets.filter(ds => ds.source === DATASET_SOURCES.INTERNAL).length,
      [DATASET_SOURCES.EXTERNAL]: datasets.filter(ds => ds.source === DATASET_SOURCES.EXTERNAL).length,
      [DATASET_SOURCES.UPLOADED]: datasets.filter(ds => ds.source === DATASET_SOURCES.UPLOADED).length,
    };
    
    return {
      total,
      byType,
      byFormat,
      bySource
    };
  }
);

export default datasetSlice.reducer; 