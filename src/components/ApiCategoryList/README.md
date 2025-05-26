# API分类列表组件

这是一个可复用的React组件，用于展示API分类的层级结构。组件支持无限层级的分类展示，并提供了展开/收起功能。

## 功能特点

- 支持无限层级的分类展示
- 每个分类项显示名称、类型、API数量和子分类数量
- 支持展开/收起子分类
- 响应式设计，适配不同屏幕尺寸
- 使用Material-UI组件库，保持统一的视觉风格

## 安装依赖

组件依赖以下包：

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## 使用方法

1. 导入组件：

```jsx
import ApiCategoryList from './components/ApiCategoryList';
```

2. 准备数据：

```jsx
const categories = [
  {
    id: '1',
    name: '分类名称',
    typeName: '类型名称',
    apiAmount: 5,
    childAmount: 3,
    classifications: [
      // 子分类数组
    ]
  }
];
```

3. 使用组件：

```jsx
<ApiCategoryList categories={categories} />
```

## 数据结构

每个分类项的数据结构如下：

```typescript
interface Category {
  id: string;
  name: string;
  typeName: string;
  apiAmount: number;
  childAmount: number;
  classifications: Category[];
}
```

## 示例

查看 `example.jsx` 文件获取完整的使用示例。

## 样式定制

组件使用Material-UI的样式系统，可以通过以下方式自定义样式：

1. 使用 `sx` 属性：

```jsx
<ApiCategoryList 
  categories={categories}
  sx={{ 
    backgroundColor: '#f5f5f5',
    padding: '20px'
  }}
/>
```

2. 覆盖默认样式：

```jsx
import { styled } from '@mui/material/styles';

const CustomApiCategoryList = styled(ApiCategoryList)({
  // 自定义样式
});
```

## 注意事项

- 确保传入的categories数组中的每个对象都包含必要的字段
- 建议限制分类的层级深度，以保持良好的用户体验
- 对于大量数据，建议实现虚拟滚动或分页加载

## 贡献

欢迎提交Issue和Pull Request来改进这个组件。 