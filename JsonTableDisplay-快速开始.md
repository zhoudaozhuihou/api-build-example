# JsonTableDisplay 快速开始指南

## 🎯 5分钟上手

`JsonTableDisplay` 是一个即插即用的通用 JSON 数据展示组件，只需要传入数据即可使用。

## 📦 基本安装

组件已经包含在项目中，无需额外安装。确保项目中有以下依赖：

```bash
# 已包含的依赖
@material-ui/core
@material-ui/icons
react
```

## 🚀 最简单的使用

### 1. 导入组件

```jsx
import JsonTableDisplay from './components/JsonTableDisplay';
```

### 2. 传入数据

```jsx
function MyComponent() {
  const data = {
    name: "张三",
    age: 28,
    email: "zhangsan@example.com"
  };

  return <JsonTableDisplay data={data} />;
}
```

**就这么简单！** 🎉

## 📋 常用场景

### 场景1: 显示API响应

```jsx
const apiData = {
  success: true,
  data: {
    users: [
      { id: 1, name: "用户1" },
      { id: 2, name: "用户2" }
    ]
  }
};

<JsonTableDisplay 
  data={apiData} 
  title="API响应数据" 
/>
```

### 场景2: 可编辑配置

```jsx
const [config, setConfig] = useState({
  theme: "dark",
  language: "zh-CN",
  notifications: true
});

<JsonTableDisplay
  data={config}
  title="系统配置"
  isEditable={true}
  onDataChange={setConfig}
/>
```

### 场景3: 数据调试

```jsx
<JsonTableDisplay
  data={debugData}
  title="调试数据"
  onCopy={(json) => {
    navigator.clipboard.writeText(json);
    console.log('已复制');
  }}
/>
```

## ⚡ 5个核心属性

| 属性 | 用途 | 示例 |
|------|------|------|
| `data` | 数据源 | `data={myJsonData}` |
| `title` | 标题 | `title="用户信息"` |
| `isEditable` | 启用编辑 | `isEditable={true}` |
| `onDataChange` | 数据变化回调 | `onDataChange={setData}` |
| `onCopy` | 复制回调 | `onCopy={handleCopy}` |

## 🎨 支持的数据类型

✅ **全部支持**：
- 字符串、数字、布尔值、null
- 对象（无限嵌套）
- 数组（混合类型）
- API响应数据
- 配置文件数据

```jsx
// 这些数据类型都完美支持
const examples = {
  simple: "字符串",
  number: 42,
  boolean: true,
  array: [1, 2, 3],
  object: { nested: { value: "深层嵌套" } },
  mixed: {
    users: [
      { id: 1, profile: { name: "用户", settings: { theme: "dark" } } }
    ]
  }
};
```

## 🔧 复制到你的项目

### 完整示例模板

```jsx
import React, { useState } from 'react';
import JsonTableDisplay from './components/JsonTableDisplay';

function YourComponent() {
  // 1. 准备数据
  const [data, setData] = useState({
    // 你的JSON数据
  });

  // 2. 处理数据变化（可选）
  const handleDataChange = (newData) => {
    setData(newData);
    // 其他处理逻辑
  };

  // 3. 处理复制（可选）
  const handleCopy = (jsonString) => {
    navigator.clipboard.writeText(jsonString);
    console.log('已复制到剪贴板');
  };

  // 4. 渲染组件
  return (
    <JsonTableDisplay
      data={data}
      title="我的数据"
      isEditable={true}          // 如需编辑
      onDataChange={handleDataChange}  // 如需编辑
      onCopy={handleCopy}        // 如需复制功能
    />
  );
}

export default YourComponent;
```

## 🎯 立即测试

访问演示页面查看所有功能：
- 浏览器打开：`http://localhost:3001/json-component-demo`
- 或点击导航栏的"通用组件演示"

## 💡 小贴士

1. **数据为空？** 组件会显示"暂无数据"
2. **编辑不生效？** 确保设置了 `isEditable={true}` 和 `onDataChange`
3. **复制失败？** 确保在HTTPS环境或localhost下运行
4. **性能问题？** 大数据建议先处理再传入

## 🎉 就是这么简单！

现在你已经掌握了 `JsonTableDisplay` 的基本用法，开始在你的项目中使用吧！

需要更多功能？查看完整的使用指南：`JsonTableDisplay-使用指南.md` 