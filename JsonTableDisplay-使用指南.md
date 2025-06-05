# JsonTableDisplay 通用组件使用指南

## 📋 概述

`JsonTableDisplay` 是一个功能强大的 React 通用组件，专门用于展示和编辑 JSON 数据。它提供了表格视图和 JSON 视图的双重显示模式，支持深度嵌套的数据结构，并具有丰富的交互功能。

## 🚀 快速开始

### 基础用法

最简单的使用方式，只需要传入数据：

```jsx
import JsonTableDisplay from './components/JsonTableDisplay';

const data = {
  name: "张三",
  age: 28,
  isActive: true,
  email: "zhangsan@example.com"
};

function MyComponent() {
  return (
    <JsonTableDisplay 
      data={data} 
      title="用户信息" 
    />
  );
}
```

### 可编辑模式

启用编辑功能，允许用户修改数据：

```jsx
import React, { useState } from 'react';
import JsonTableDisplay from './components/JsonTableDisplay';

function EditableExample() {
  const [userData, setUserData] = useState({
    name: "李四",
    profile: {
      email: "lisi@example.com",
      preferences: {
        theme: "dark",
        notifications: true
      }
    }
  });

  const handleDataChange = (newData) => {
    setUserData(newData);
    console.log('数据已更新:', newData);
  };

  return (
    <JsonTableDisplay
      data={userData}
      title="可编辑用户数据"
      isEditable={true}
      onDataChange={handleDataChange}
    />
  );
}
```

## 📖 API 参考

### Props

| 属性名 | 类型 | 默认值 | 必需 | 描述 |
|--------|------|--------|------|------|
| `data` | `any` | - | ✅ | 要显示的 JSON 数据，支持任意数据类型 |
| `title` | `string` | - | ❌ | 组件顶部显示的标题 |
| `isEditable` | `boolean` | `false` | ❌ | 是否启用编辑功能 |
| `onDataChange` | `(newData: any) => void` | - | ❌ | 数据变化时的回调函数 |
| `onCopy` | `(jsonString: string) => void` | - | ❌ | 复制操作的回调函数 |
| `isCopied` | `boolean` | - | ❌ | 外部控制的复制状态指示 |
| `defaultView` | `'table' \| 'json'` | `'table'` | ❌ | 默认显示的视图模式 |

### 回调函数详解

#### onDataChange

当用户编辑数据时触发，接收更新后的完整数据对象：

```jsx
const handleDataChange = (newData) => {
  // newData 是更新后的完整数据对象
  console.log('数据已更新:', newData);
  setMyData(newData);
  
  // 可以在这里执行其他操作，如保存到服务器
  saveToServer(newData);
};
```

#### onCopy

当用户点击复制按钮时触发，接收 JSON 字符串：

```jsx
const handleCopy = (jsonString) => {
  // 复制到剪贴板
  navigator.clipboard.writeText(jsonString);
  
  // 显示成功提示
  showToast('已复制到剪贴板');
  
  // 或者记录日志
  console.log('用户复制了数据:', jsonString);
};
```

## 🎯 使用场景

### 1. API 响应数据展示

```jsx
const apiResponse = {
  success: true,
  code: 200,
  data: {
    users: [
      { id: 1, name: "用户1", roles: ["admin"] },
      { id: 2, name: "用户2", roles: ["user"] }
    ],
    pagination: {
      page: 1,
      total: 100
    }
  }
};

<JsonTableDisplay
  data={apiResponse}
  title="API 响应数据"
  defaultView="table"
/>
```

### 2. 配置文件编辑

```jsx
const [config, setConfig] = useState({
  database: {
    host: "localhost",
    port: 3306,
    credentials: {
      username: "admin",
      password: "******"
    }
  },
  features: {
    enableCache: true,
    debugMode: false
  }
});

<JsonTableDisplay
  data={config}
  title="系统配置"
  isEditable={true}
  onDataChange={setConfig}
/>
```

### 3. 数据调试工具

```jsx
function DataDebugger({ debugData }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (jsonString) => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <JsonTableDisplay
      data={debugData}
      title="调试数据"
      onCopy={handleCopy}
      isCopied={copied}
    />
  );
}
```

### 4. 表单数据预览

```jsx
function FormPreview({ formData }) {
  return (
    <JsonTableDisplay
      data={formData}
      title="表单数据预览"
      defaultView="table"
    />
  );
}
```

## 🎨 支持的数据类型

### 基础类型

```jsx
const basicTypes = {
  string: "文本内容",
  number: 42,
  float: 3.14159,
  boolean: true,
  nullValue: null,
  undefined: undefined
};
```

### 复杂类型

```jsx
const complexTypes = {
  array: [1, "混合", true, null],
  object: {
    nested: {
      deeply: {
        value: "深层嵌套"
      }
    }
  },
  mixedArray: [
    { id: 1, name: "对象1" },
    { id: 2, name: "对象2" }
  ]
};
```

### 实际应用数据

```jsx
const realWorldData = {
  user: {
    profile: { /* 用户资料 */ },
    permissions: ["read", "write"],
    metadata: { /* 元数据 */ }
  },
  settings: {
    ui: { /* UI设置 */ },
    api: { /* API配置 */ }
  }
};
```

## ✨ 功能特性

### 视图切换
- **表格视图**: 以表格形式展示数据，便于查看层级结构
- **JSON 视图**: 原生 JSON 格式显示，便于复制和编辑

### 编辑功能
- **内联编辑**: 直接在表格中编辑值
- **类型验证**: 自动验证和转换数据类型
- **实时更新**: 编辑后立即触发回调

### 交互功能
- **展开/折叠**: 控制嵌套结构的显示
- **一键复制**: 复制完整 JSON 数据
- **类型指示**: 彩色标签显示数据类型

## 🔧 最佳实践

### 1. 错误处理

```jsx
function SafeJsonDisplay({ data }) {
  if (!data) {
    return <div>暂无数据</div>;
  }
  
  try {
    return (
      <JsonTableDisplay
        data={data}
        title="安全数据展示"
      />
    );
  } catch (error) {
    return <div>数据格式错误: {error.message}</div>;
  }
}
```

### 2. 性能优化

```jsx
import React, { useMemo } from 'react';

function OptimizedDisplay({ rawData }) {
  // 对大型数据进行预处理
  const processedData = useMemo(() => {
    if (Array.isArray(rawData) && rawData.length > 1000) {
      return rawData.slice(0, 100); // 限制显示数量
    }
    return rawData;
  }, [rawData]);
  
  return (
    <JsonTableDisplay
      data={processedData}
      title="优化后的数据"
    />
  );
}
```

### 3. 结合表单使用

```jsx
function FormWithPreview() {
  const [formData, setFormData] = useState({});
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div>
        {/* 表单控件 */}
        <input 
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="姓名"
        />
        {/* 更多表单控件 */}
      </div>
      
      <div>
        <JsonTableDisplay
          data={formData}
          title="实时预览"
        />
      </div>
    </div>
  );
}
```

## 🎨 自定义样式

组件使用 Material-UI 构建，支持主题定制：

```jsx
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function ThemedDisplay({ data }) {
  return (
    <ThemeProvider theme={customTheme}>
      <JsonTableDisplay
        data={data}
        title="自定义主题"
      />
    </ThemeProvider>
  );
}
```

## 🚨 注意事项

### 1. 数据安全
- 避免显示敏感信息（密码、令牌等）
- 对于来自外部的数据，确保已进行适当的验证

### 2. 性能考虑
- 大型数据集可能影响渲染性能
- 考虑对超大数据进行分页或限制显示

### 3. 编辑限制
- 编辑功能仅支持基础数据类型
- 复杂对象结构的编辑需要谨慎处理

## 🔍 故障排除

### 常见问题

1. **数据不显示**
   - 检查 `data` 属性是否正确传递
   - 确认数据格式是有效的 JSON

2. **编辑功能不工作**
   - 确保设置了 `isEditable={true}`
   - 检查 `onDataChange` 回调是否正确实现

3. **复制功能无效**
   - 检查浏览器是否支持 `navigator.clipboard`
   - 确保页面在 HTTPS 环境下运行

### 调试技巧

```jsx
// 启用调试模式
<JsonTableDisplay
  data={data}
  title="调试模式"
  onDataChange={(newData) => {
    console.log('数据变化:', newData);
    setData(newData);
  }}
  onCopy={(jsonString) => {
    console.log('复制内容:', jsonString);
  }}
/>
```

## 📦 完整示例

```jsx
import React, { useState, useCallback } from 'react';
import JsonTableDisplay from './components/JsonTableDisplay';

function CompleteExample() {
  const [data, setData] = useState({
    user: {
      id: 1,
      name: "完整示例用户",
      profile: {
        email: "user@example.com",
        settings: {
          theme: "light",
          notifications: true
        }
      },
      permissions: ["read", "write"]
    },
    metadata: {
      createdAt: "2024-01-15T10:30:00Z",
      version: "1.0.0"
    }
  });
  
  const [copyStatus, setCopyStatus] = useState(false);
  
  const handleDataChange = useCallback((newData) => {
    setData(newData);
    console.log('数据已更新:', newData);
  }, []);
  
  const handleCopy = useCallback((jsonString) => {
    navigator.clipboard.writeText(jsonString);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  }, []);
  
  return (
    <div>
      <h1>JsonTableDisplay 完整示例</h1>
      
      <JsonTableDisplay
        data={data}
        title="完整功能演示"
        isEditable={true}
        onDataChange={handleDataChange}
        onCopy={handleCopy}
        isCopied={copyStatus}
        defaultView="table"
      />
      
      {copyStatus && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          ✅ 已复制到剪贴板
        </div>
      )}
    </div>
  );
}

export default CompleteExample;
```

## 🎯 总结

`JsonTableDisplay` 是一个功能完备的通用组件，适用于任何需要展示或编辑 JSON 数据的场景。通过简单的 API 和丰富的功能，它可以大大提升数据处理的效率和用户体验。

**核心优势:**
- 🎯 **即插即用**: 只需传入数据即可使用
- 🔧 **功能丰富**: 支持编辑、复制、视图切换等
- 🎨 **界面美观**: Material-UI 设计风格
- ⚡ **性能优化**: 高效的渲染和交互
- 🛡️ **类型安全**: 完整的 TypeScript 支持

无论是用于调试、数据展示还是配置编辑，这个组件都能提供优秀的用户体验。 