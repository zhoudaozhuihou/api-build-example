import React from 'react';
import {
  ImportExport as ApiIcon,
  Category as CategoryIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Speed as SpeedIcon,
  CloudUpload as CloudUploadIcon,
} from '@material-ui/icons';

// API筛选配置 - 使用现有的配置
export { apiFilterConfig } from './filterConfigs';

// API分类配置
export const apiCategoryConfig = {
  title: 'API分类',
  icon: CategoryIcon,
  showEditMode: true,
  itemIcon: ApiIcon,
  categories: [
    {
      id: 'user-apis',
      label: '用户管理',
      value: '用户管理',
      children: [
        {
          id: 'user-auth',
          label: '用户认证',
          value: '用户认证'
        },
        {
          id: 'user-profile',
          label: '用户信息',
          value: '用户信息'
        },
        {
          id: 'user-permission',
          label: '权限管理',
          value: '权限管理'
        }
      ]
    },
    {
      id: 'business-apis',
      label: '业务管理',
      value: '业务管理',
      children: [
        {
          id: 'order-mgmt',
          label: '订单管理',
          value: '订单管理'
        },
        {
          id: 'product-mgmt',
          label: '产品管理',
          value: '产品管理'
        },
        {
          id: 'payment-mgmt',
          label: '支付管理',
          value: '支付管理'
        }
      ]
    },
    {
      id: 'system-apis',
      label: '系统服务',
      value: '系统服务',
      children: [
        {
          id: 'notification',
          label: '通知服务',
          value: '通知服务'
        },
        {
          id: 'logging',
          label: '日志服务',
          value: '日志服务'
        },
        {
          id: 'monitoring',
          label: '监控服务',
          value: '监控服务'
        }
      ]
    },
    {
      id: 'data-apis',
      label: '数据服务',
      value: '数据服务',
      children: [
        {
          id: 'analytics',
          label: '数据分析',
          value: '数据分析'
        },
        {
          id: 'reporting',
          label: '报表服务',
          value: '报表服务'
        }
      ]
    }
  ]
};

// API页面头部配置
export const apiHeaderConfig = {
  title: 'API 目录',
  subtitle: '探索和管理您的API集合，通过分类浏览、搜索并查看详细信息',
  searchPlaceholder: '搜索API名称、描述或分类...',
  importButtonText: '导入API',
  countLabel: 'API总数',
  countIcon: ApiIcon
};

// API卡片网格配置
export const apiCardGridConfig = {
  title: 'API列表',
  itemsPerPage: 10,
  emptyStateIcon: ApiIcon,
  emptyStateText: '没有找到符合条件的API'
}; 