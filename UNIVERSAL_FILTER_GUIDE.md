# 通用筛选组件使用指南

## 📋 概述

`UniversalFilter` 是一个高度可配置的通用筛选组件，通过简单的配置数组就能快速构建复杂的筛选界面。它支持多种筛选类型，包括芯片选择、下拉选择、日期范围等。

## 🚀 核心特性

- **📦 配置驱动**: 只需提供配置数组，无需编写重复的UI代码
- **🔄 多种筛选类型**: 支持芯片(chips)、下拉(select)、日期范围(date)等
- **🎛️ 灵活控制**: 支持单选/多选、展开/折叠、计数显示等
- **💡 智能状态管理**: 自动处理筛选状态和活跃条件显示
- **🎨 美观界面**: 统一的Material-UI设计风格

## 📁 文件结构

```
src/
├── components/
│   └── UniversalFilter.js          # 通用筛选组件
├── config/
│   └── filterConfigs.js            # 筛选配置文件
└── examples/
    ├── ApiCatalogWithUniversalFilter.js    # API页面示例
    └── DatasetsWithUniversalFilter.js      # 数据集页面示例
```

## 🛠️ 基本使用

### 1. 导入组件和配置

```javascript
import UniversalFilter from '../components/UniversalFilter';
import { apiFilterConfig, createActiveFilters } from '../config/filterConfigs';
```

### 2. 设置状态

```javascript
const [filterStates, setFilterStates] = useState({
  accessLevel: null,        // 单选筛选
  dataFields: [],          // 多选筛选
  responseTime: 'all',     // 下拉选择
  updateDateStart: '',     // 日期开始
  updateDateEnd: ''        // 日期结束
});

const [activeFilters, setActiveFilters] = useState([]);
```

### 3. 处理筛选变化

```javascript
const handleFilterChange = (key, value, type) => {
  setFilterStates(prev => {
    const newStates = { ...prev };
    const section = apiFilterConfig.sections.find(s => s.key === key);
    
    if (section && section.type === 'chips') {
      if (section.multiSelect !== false) {
        // 多选逻辑
        const currentItems = newStates[key] || [];
        if (currentItems.includes(value)) {
          newStates[key] = currentItems.filter(item => item !== value);
        } else {
          newStates[key] = [...currentItems, value];
        }
      } else {
        // 单选逻辑
        newStates[key] = newStates[key] === value ? null : value;
      }
    } else {
      newStates[key] = value;
    }
    
    return newStates;
  });
};
```

### 4. 使用组件

```javascript
<UniversalFilter
  title={apiFilterConfig.title}
  filterSections={apiFilterConfig.sections}
  filterStates={filterStates}
  onFilterChange={handleFilterChange}
  onClearAll={handleClearAll}
  activeFilters={activeFilters}
/>
```

## ⚙️ 配置详解

### 筛选类型配置

#### 1. 芯片筛选 (chips)

```javascript
{
  key: 'accessLevel',           // 唯一标识
  title: '开放等级',            // 显示标题
  type: 'chips',               // 筛选类型
  icon: <PublicIcon />,        // 图标 (可选)
  multiSelect: false,          // 是否多选 (默认true)
  defaultExpanded: true,       // 默认是否展开 (默认true)
  showCounts: false,          // 是否显示计数 (默认true)
  options: [                  // 选项数组
    { value: 'login', label: '登录开放' },
    { value: 'public', label: '完全开放', count: 5 }
  ]
}
```

#### 2. 下拉选择 (select)

```javascript
{
  key: 'responseTime',
  title: '响应时间',
  type: 'select',
  icon: <SpeedIcon />,
  defaultExpanded: true,
  defaultValue: 'all',         // 默认值
  placeholder: '选择响应时间范围',
  options: [
    { value: 'all', label: '全部' },
    { value: 'fast', label: '快速 (50-100ms)' }
  ]
}
```

#### 3. 日期范围 (date)

```javascript
{
  key: 'updateDate',
  title: '更新日期',
  type: 'date',
  icon: <ScheduleIcon />,
  defaultExpanded: false,
  startLabel: '开始日期',      // 开始日期标签
  endLabel: '结束日期'         // 结束日期标签
}
```

### 选项属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `key` | string | 必填 | 筛选项的唯一标识 |
| `title` | string | 必填 | 显示的标题 |
| `type` | string | 'chips' | 筛选类型: chips/select/date |
| `icon` | ReactNode | null | 显示的图标 |
| `multiSelect` | boolean | true | 是否支持多选 (仅chips) |
| `defaultExpanded` | boolean | true | 默认是否展开 |
| `showCounts` | boolean | true | 是否显示计数 (仅chips) |
| `defaultValue` | any | null | 默认值 (仅select) |
| `placeholder` | string | title | 占位符文本 (仅select) |
| `startLabel` | string | '开始日期' | 开始日期标签 (仅date) |
| `endLabel` | string | '结束日期' | 结束日期标签 (仅date) |

## 📊 状态管理

### 筛选状态结构

```javascript
const filterStates = {
  // 单选筛选: null 或 选中的值
  accessLevel: 'public',
  
  // 多选筛选: 数组
  dataFields: ['用户相关', '订单相关'],
  
  // 下拉选择: 选中的值
  responseTime: 'fast',
  
  // 日期筛选: 字符串
  updateDateStart: '2024-01-01',
  updateDateEnd: '2024-12-31'
};
```

### 活跃筛选条件

使用 `createActiveFilters` 工具函数自动生成活跃筛选条件:

```javascript
useEffect(() => {
  const filters = createActiveFilters(filterStates, apiFilterConfig);
  const filtersWithClear = filters.map(filter => ({
    ...filter,
    onClear: () => handleClearFilter(filter.onClear())
  }));
  setActiveFilters(filtersWithClear);
}, [filterStates]);
```

## 🎨 样式定制

组件使用Material-UI的 `makeStyles` API，可以通过以下类名进行样式定制:

- `.filterContainer` - 主容器
- `.filterHeader` - 头部区域
- `.filterSection` - 单个筛选区域
- `.filterChip` - 筛选芯片
- `.selectedFilterChip` - 选中的筛选芯片
- `.activeFiltersSection` - 活跃筛选条件区域

## 🔧 扩展示例

### 自定义筛选类型

可以扩展 `renderFilterSection` 方法支持新的筛选类型:

```javascript
// 在UniversalFilter.js中添加新的渲染方法
const renderRangeFilterSection = (section) => {
  // 实现滑块范围筛选
};

// 在主渲染方法中添加新类型
const renderFilterSection = (section) => {
  switch (section.type) {
    case 'chips':
      return renderChipFilterSection(section);
    case 'select':
      return renderSelectFilterSection(section);
    case 'date':
      return renderDateFilterSection(section);
    case 'range':  // 新增类型
      return renderRangeFilterSection(section);
    default:
      return renderChipFilterSection(section);
  }
};
```

### 动态配置

可以根据数据动态生成筛选配置:

```javascript
const generateDynamicConfig = (apiData) => {
  const methods = [...new Set(apiData.map(api => api.method))];
  
  return {
    title: '动态API筛选',
    sections: [
      {
        key: 'methods',
        title: 'API方法',
        type: 'chips',
        multiSelect: true,
        options: methods.map(method => ({
          value: method,
          label: method,
          count: apiData.filter(api => api.method === method).length
        }))
      }
    ]
  };
};
```

## 📝 最佳实践

### 1. 配置组织
- 将筛选配置放在独立的配置文件中
- 按页面或功能模块组织配置
- 使用有意义的key和title

### 2. 状态管理
- 使用统一的状态结构
- 合理设置默认值
- 及时清理无用的筛选状态

### 3. 性能优化
- 使用 `useCallback` 包装事件处理函数
- 合理使用 `useMemo` 缓存计算结果
- 避免在配置中使用匿名函数

### 4. 用户体验
- 合理设置默认展开状态
- 提供清晰的筛选条件反馈
- 支持快速清除功能

## 🐛 常见问题

### Q: 如何添加新的筛选类型？
A: 在 `UniversalFilter.js` 中添加新的渲染方法，并在 `renderFilterSection` 中添加对应的case。

### Q: 可以嵌套筛选组件吗？
A: 不建议嵌套使用，推荐通过配置扩展功能。

### Q: 如何实现筛选条件的持久化？
A: 可以将 `filterStates` 存储到 localStorage 或 URL 参数中。

### Q: 支持异步加载筛选选项吗？
A: 支持，可以在组件外部异步获取数据后更新配置。

## 🎯 总结

通用筛选组件提供了一个灵活、可配置的解决方案，可以快速构建各种筛选界面。通过合理的配置和状态管理，可以大大减少重复代码，提高开发效率。 