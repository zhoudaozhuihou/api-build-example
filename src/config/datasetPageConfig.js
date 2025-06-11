import React from 'react';
import {
  Storage as StorageIcon,
  Category as CategoryIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  CloudDownload as CloudDownloadIcon,
} from '@material-ui/icons';

// 数据集筛选配置
export const datasetFilterConfig = {
  title: '数据集筛选',
  sections: [
    {
      key: 'accessLevel',
      title: '开放等级',
      type: 'chips',
      icon: <PublicIcon />,
      multiSelect: false,
      defaultExpanded: true,
      showCounts: false,
      options: [
        { value: 'public', label: '完全开放' },
        { value: 'login', label: '登录开放' },
        { value: 'restricted', label: '受限开放' }
      ]
    },
    {
      key: 'categories',
      title: '数据类型',
      type: 'chips',
      icon: <CategoryIcon />,
      multiSelect: true,
      defaultExpanded: true,
      showCounts: true,
      options: [
        { value: '结构化数据', label: '结构化数据', count: 15 },
        { value: '文本数据', label: '文本数据', count: 8 },
        { value: '时间序列', label: '时间序列', count: 6 },
        { value: '图像数据', label: '图像数据', count: 5 }
      ]
    },
    {
      key: 'dataFormat',
      title: '应用领域',
      type: 'chips',
      icon: <DescriptionIcon />,
      multiSelect: true,
      defaultExpanded: false,
      showCounts: true,
      options: [
        { value: '用户行为', label: '用户行为', count: 3 },
        { value: '电子商务', label: '电子商务', count: 3 },
        { value: '自然语言处理', label: '自然语言处理', count: 5 },
        { value: '情感分析', label: '情感分析', count: 2 },
        { value: '时间序列分析', label: '时间序列分析', count: 2 },
        { value: '预测建模', label: '预测建模', count: 2 },
        { value: '计算机视觉', label: '计算机视觉', count: 4 },
        { value: '图像分类', label: '图像分类', count: 2 },
        { value: '金融', label: '金融', count: 2 },
        { value: '风险评估', label: '风险评估', count: 1 },
        { value: '推荐系统', label: '推荐系统', count: 2 },
        { value: '协同过滤', label: '协同过滤', count: 1 },
        { value: '医疗健康', label: '医疗健康', count: 1 },
        { value: '物联网', label: '物联网', count: 1 },
        { value: '地理信息', label: '地理信息', count: 2 },
        { value: '交通运输', label: '交通运输', count: 1 },
        { value: '教育培训', label: '教育培训', count: 1 },
        { value: '网络安全', label: '网络安全', count: 1 },
        { value: '语音识别', label: '语音识别', count: 1 },
        { value: '人脸识别', label: '人脸识别', count: 1 },
        { value: '遥感技术', label: '遥感技术', count: 1 },
        { value: '制造业', label: '制造业', count: 1 },
        { value: '农业科技', label: '农业科技', count: 1 },
        { value: '区块链', label: '区块链', count: 1 },
        { value: '金融科技', label: '金融科技', count: 1 }
      ]
    },
    {
      key: 'updateFrequency',
      title: '更新频率',
      type: 'chips',
      icon: <ScheduleIcon />,
      multiSelect: false,
      defaultExpanded: false,
      showCounts: true,
      options: [
        { value: 'realtime', label: '实时', count: 3 },
        { value: 'daily', label: '每日', count: 7 },
        { value: 'weekly', label: '每周', count: 4 },
        { value: 'monthly', label: '每月', count: 2 },
        { value: 'static', label: '静态', count: 1 }
      ]
    },
    {
      key: 'dataSize',
      title: '数据规模',
      type: 'slider',
      icon: <SpeedIcon />,
      defaultExpanded: false,
      min: 0,
      max: 1000,
      step: 10,
      defaultValue: [0, 500],
      marks: [
        { value: 0, label: '0MB' },
        { value: 100, label: '100MB' },
        { value: 500, label: '500MB' },
        { value: 1000, label: '1GB+' }
      ]
    }
  ]
};

// 数据集分类配置
export const datasetCategoryConfig = {
  title: '数据集分类',
  icon: CategoryIcon,
  showEditMode: true,
  itemIcon: StorageIcon,
  categories: [
    {
      id: 'structured',
      label: '结构化数据',
      value: '结构化数据',
      children: [
        {
          id: 'user-data',
          label: '用户数据',
          value: '用户数据'
        },
        {
          id: 'business-data',
          label: '业务数据',
          value: '业务数据'
        },
        {
          id: 'financial-data',
          label: '财务数据',
          value: '财务数据'
        }
      ]
    },
    {
      id: 'behavioral',
      label: '用户行为',
      value: '用户行为',
      children: [
        {
          id: 'click-data',
          label: '点击数据',
          value: '点击数据'
        },
        {
          id: 'usage-data',
          label: '使用数据',
          value: '使用数据'
        }
      ]
    },
    {
      id: 'logs',
      label: '日志数据',
      value: '日志数据',
      children: [
        {
          id: 'app-logs',
          label: '应用日志',
          value: '应用日志'
        },
        {
          id: 'system-logs',
          label: '系统日志',
          value: '系统日志'
        }
      ]
    },
    {
      id: 'config',
      label: '配置数据',
      value: '配置数据'
    }
  ]
};

// 数据集页面头部配置
export const datasetHeaderConfig = {
  title: '数据集管理',
  subtitle: '管理和浏览可用于API构建的数据集，上传新数据集或接收来自其他平台的数据集',
  searchPlaceholder: '搜索数据集名称、描述或分类...',
  importButtonText: '导入数据集',
  countLabel: '数据集总数',
  countIcon: StorageIcon
};

// 数据集卡片网格配置
export const datasetCardGridConfig = {
  title: '数据集列表',
  itemsPerPage: 10,
  emptyStateIcon: StorageIcon,
  emptyStateText: '没有找到符合条件的数据集'
}; 