import React, { useState, useEffect } from 'react';
import { Container, Paper, Box, Typography, Grid } from '@material-ui/core';
import UniversalFilter from '../components/UniversalFilter';
import { datasetFilterConfig, createActiveFilters } from '../config/filterConfigs';

const DatasetsWithUniversalFilter = () => {
  // 筛选状态
  const [filterStates, setFilterStates] = useState({
    status: null,
    types: [],
    themes: [],
    dataSize: 'all',
    updateDateStart: '',
    updateDateEnd: ''
  });

  // 活跃筛选条件
  const [activeFilters, setActiveFilters] = useState([]);

  // 处理筛选变化
  const handleFilterChange = (key, value, type) => {
    setFilterStates(prev => {
      const newStates = { ...prev };
      
      // 根据筛选类型处理不同的逻辑
      const section = datasetFilterConfig.sections.find(s => s.key === key);
      
      if (section && (section.type === 'chips' || section.type === 'chip')) {
        if (section.multiSelect !== false) {
          // 多选模式
          const currentItems = newStates[key] || [];
          if (currentItems.includes(value)) {
            newStates[key] = currentItems.filter(item => item !== value);
          } else {
            newStates[key] = [...currentItems, value];
          }
        } else {
          // 单选模式
          newStates[key] = newStates[key] === value ? null : value;
        }
      } else {
        // 其他类型直接设置
        newStates[key] = value;
      }
      
      return newStates;
    });
  };

  // 清除所有筛选
  const handleClearAll = () => {
    setFilterStates({
      status: null,
      types: [],
      themes: [],
      dataSize: 'all',
      updateDateStart: '',
      updateDateEnd: ''
    });
  };

  // 单独清除某个筛选条件
  const handleClearFilter = (clearState) => {
    setFilterStates(prev => ({
      ...prev,
      ...clearState
    }));
  };

  // 更新活跃筛选条件
  useEffect(() => {
    const filters = createActiveFilters(filterStates, datasetFilterConfig);
    // 为每个筛选条件添加清除功能
    const filtersWithClear = filters.map(filter => ({
      ...filter,
      onClear: () => handleClearFilter(filter.onClear())
    }));
    setActiveFilters(filtersWithClear);
  }, [filterStates]);

  return (
    <Container maxWidth="xl">
      {/* 筛选区域 */}
      <Paper style={{ marginBottom: 24, padding: 0 }} elevation={2}>
        <UniversalFilter
          title={datasetFilterConfig.title}
          filterSections={datasetFilterConfig.sections}
          filterStates={filterStates}
          onFilterChange={handleFilterChange}
          onClearAll={handleClearAll}
          activeFilters={activeFilters}
        />
      </Paper>

      {/* 内容区域 */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              数据集列表 (使用通用筛选组件)
            </Typography>
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                当前筛选状态：
              </Typography>
              <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '8px', borderRadius: '4px', marginTop: '8px' }}>
                {JSON.stringify(filterStates, null, 2)}
              </pre>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DatasetsWithUniversalFilter; 