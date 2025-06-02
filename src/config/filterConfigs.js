import React from 'react';
import {
  Public as PublicIcon,
  Lock as LockIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Speed as SpeedIcon,
} from '@material-ui/icons';

// API管理页面的筛选配置
export const apiFilterConfig = {
  title: 'API筛选',
  sections: [
    {
      key: 'accessLevel',
      title: '开放等级',
      type: 'chips',
      icon: <PublicIcon />,
      multiSelect: false, // 单选
      defaultExpanded: true,
      showCounts: false,
      options: [
        { value: 'login', label: '登录开放' },
        { value: 'restricted', label: '受限开放' },
        { value: 'public', label: '完全开放' }
      ]
    },
    {
      key: 'dataFields',
      title: '数据领域',
      type: 'chips',
      icon: <CategoryIcon />,
      multiSelect: true, // 多选
      defaultExpanded: true,
      showCounts: true,
      options: [
        { value: '用户相关', label: '用户数据', count: 3 },
        { value: '订单相关', label: '订单数据', count: 2 },
        { value: '产品相关', label: '产品数据', count: 1 },
        { value: '支付相关', label: '支付数据', count: 2 },
        { value: '系统相关', label: '系统数据', count: 1 }
      ]
    },
    {
      key: 'themes',
      title: '主题分类',
      type: 'chips',
      icon: <DescriptionIcon />,
      multiSelect: true,
      defaultExpanded: false,
      showCounts: true,
      options: [
        { value: '用户认证', label: '认证服务', count: 1 },
        { value: '用户信息', label: '用户信息', count: 1 },
        { value: '订单管理', label: '订单管理', count: 1 },
        { value: '支付管理', label: '支付服务', count: 1 },
        { value: '产品列表', label: '产品目录', count: 1 }
      ]
    },
    {
      key: 'methods',
      title: 'API方法',
      type: 'chips',
      icon: <CodeIcon />,
      multiSelect: true,
      defaultExpanded: true,
      showCounts: false,
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'PATCH', label: 'PATCH' }
      ]
    },
    {
      key: 'responseTime',
      title: '响应时间',
      type: 'select',
      icon: <SpeedIcon />,
      defaultExpanded: true,
      defaultValue: 'all',
      placeholder: '选择响应时间范围',
      options: [
        { value: 'all', label: '全部' },
        { value: 'very-fast', label: '极快 (< 50ms)' },
        { value: 'fast', label: '快速 (50-100ms)' },
        { value: 'medium', label: '中等 (100-150ms)' },
        { value: 'slow', label: '慢速 (> 150ms)' }
      ]
    },
    {
      key: 'updateDate',
      title: '更新日期',
      type: 'date',
      icon: <ScheduleIcon />,
      defaultExpanded: false,
      startLabel: '开始日期',
      endLabel: '结束日期'
    }
  ]
};

// 数据集管理页面的筛选配置
export const datasetFilterConfig = {
  title: '数据集筛选',
  sections: [
    {
      key: 'status',
      title: '访问状态',
      type: 'chips',
      icon: <PublicIcon />,
      multiSelect: false, // 单选
      defaultExpanded: true,
      showCounts: true,
      options: [
        { value: 'public', label: '公开数据集', count: 25 },
        { value: 'private', label: '私有数据集', count: 18 },
        { value: 'restricted', label: '受限访问', count: 5 }
      ]
    },
    {
      key: 'types',
      title: '数据类型',
      type: 'chips',
      icon: <StorageIcon />,
      multiSelect: true, // 多选
      defaultExpanded: true,
      showCounts: true,
      options: [
        { value: '结构化数据', label: '结构化数据', count: 15 },
        { value: '文本数据', label: '文本数据', count: 8 },
        { value: '图像数据', label: '图像数据', count: 12 },
        { value: '时间序列', label: '时间序列', count: 6 },
        { value: '音频数据', label: '音频数据', count: 4 },
        { value: '视频数据', label: '视频数据', count: 3 }
      ]
    },
    {
      key: 'themes',
      title: '主题分类',
      type: 'chips',
      icon: <DescriptionIcon />,
      multiSelect: true,
      defaultExpanded: false,
      showCounts: true,
      options: [
        { value: '机器学习', label: '机器学习', count: 20 },
        { value: '自然语言处理', label: '自然语言处理', count: 12 },
        { value: '计算机视觉', label: '计算机视觉', count: 15 },
        { value: '推荐系统', label: '推荐系统', count: 8 },
        { value: '时间序列分析', label: '时间序列分析', count: 6 },
        { value: '网络分析', label: '网络分析', count: 4 }
      ]
    },
    {
      key: 'dataSize',
      title: '数据大小',
      type: 'select',
      icon: <StorageIcon />,
      defaultExpanded: false,
      defaultValue: 'all',
      placeholder: '选择数据大小',
      options: [
        { value: 'all', label: '全部' },
        { value: 'small', label: '小型 (< 100MB)' },
        { value: 'medium', label: '中型 (100MB - 1GB)' },
        { value: 'large', label: '大型 (1GB - 10GB)' },
        { value: 'xlarge', label: '超大型 (> 10GB)' }
      ]
    },
    {
      key: 'updateDate',
      title: '更新日期',
      type: 'date',
      icon: <ScheduleIcon />,
      defaultExpanded: false,
      startLabel: '开始日期',
      endLabel: '结束日期'
    }
  ]
};

// 通用的工具函数
export const createActiveFilters = (filterStates, filterConfig) => {
  const activeFilters = [];
  
  filterConfig.sections.forEach(section => {
    const state = filterStates[section.key];
    
    if (section.type === 'chips' || section.type === 'chip') {
      if (section.multiSelect !== false) {
        // 多选模式
        if (state && state.length > 0) {
          const labels = state.map(value => {
            const option = section.options.find(opt => opt.value === value);
            return option ? option.label : value;
          });
          activeFilters.push({
            label: `${section.title}: ${labels.join(', ')}`,
            onClear: () => ({ [section.key]: [] })
          });
        }
      } else {
        // 单选模式
        if (state) {
          const option = section.options.find(opt => opt.value === state);
          activeFilters.push({
            label: `${section.title}: ${option ? option.label : state}`,
            onClear: () => ({ [section.key]: null })
          });
        }
      }
    } else if (section.type === 'select' || section.type === 'dropdown') {
      if (state && state !== section.defaultValue) {
        const option = section.options.find(opt => opt.value === state);
        activeFilters.push({
          label: `${section.title}: ${option ? option.label : state}`,
          onClear: () => ({ [section.key]: section.defaultValue || '' })
        });
      }
    } else if (section.type === 'date' || section.type === 'dateRange') {
      const startDate = filterStates[`${section.key}Start`];
      const endDate = filterStates[`${section.key}End`];
      
      if (startDate || endDate) {
        activeFilters.push({
          label: `${section.title}: ${startDate || '始至'} - ${endDate || '现在'}`,
          onClear: () => ({
            [`${section.key}Start`]: '',
            [`${section.key}End`]: ''
          })
        });
      }
    }
  });
  
  return activeFilters;
}; 