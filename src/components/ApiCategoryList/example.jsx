import React from 'react';
import ApiCategoryList from './index';

// 示例数据
const exampleCategories = [
  {
    id: '1',
    name: '用户相关',
    typeName: '用户',
    apiAmount: 5,
    childAmount: 3,
    classifications: [
      {
        id: '1-1',
        name: '用户认证',
        typeName: '认证',
        apiAmount: 2,
        childAmount: 0,
        classifications: []
      },
      {
        id: '1-2',
        name: '用户信息',
        typeName: '信息',
        apiAmount: 2,
        childAmount: 1,
        classifications: [
          {
            id: '1-2-1',
            name: '基本信息',
            typeName: '基础',
            apiAmount: 1,
            childAmount: 0,
            classifications: []
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '订单相关',
    typeName: '订单',
    apiAmount: 8,
    childAmount: 2,
    classifications: [
      {
        id: '2-1',
        name: '订单管理',
        typeName: '管理',
        apiAmount: 4,
        childAmount: 0,
        classifications: []
      },
      {
        id: '2-2',
        name: '订单状态',
        typeName: '状态',
        apiAmount: 4,
        childAmount: 0,
        classifications: []
      }
    ]
  }
];

const ApiCategoryListExample = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>API分类列表</h2>
      <ApiCategoryList categories={exampleCategories} />
    </div>
  );
};

export default ApiCategoryListExample; 