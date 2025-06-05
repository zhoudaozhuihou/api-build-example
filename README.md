# API Build Example

## 项目概述
这是一个基于React和Material-UI构建的API管理和数据集管理应用示例。项目展示了现代前端开发的最佳实践，包括组件化设计、状态管理、用户界面优化等。

## 最新功能更新

### 🆕 数据集管理功能
- **数据集详情查看**: 点击数据集卡片上的"查看"按钮，可以打开详细的数据集信息对话框
- **数据集上传**: 支持多种格式文件上传（JSON, CSV, Excel, XML, SQL, TXT）
- **拖拽上传**: 支持文件拖拽到指定区域进行上传
- **数据预览**: 在详情对话框中可以查看数据样本、统计信息、使用情况等
- **智能进度条**: 实时显示上传进度，支持API后端和模拟上传两种模式

### 📊 数据集详情对话框特性
- **四个主要Tab页面**:
  1. **基本信息**: 显示数据集的基本元数据和分类标签
  2. **数据样本**: 预览数据集的前几行，了解数据结构
  3. **统计信息**: 显示文件数量、数据大小、记录数量等统计数据
  4. **使用情况**: 展示下载统计、活跃用户、最近访问用户等

### 🔧 技术特性
- **响应式设计**: 适配不同屏幕尺寸
- **模拟数据支持**: 在没有后端API时自动切换到模拟模式
- **错误处理**: 完善的错误处理和用户反馈机制
- **文件验证**: 上传前对文件格式和大小进行验证

## 主要功能

### API管理
- API目录浏览和搜索
- API详情查看和编辑
- API导入和导出
- API血缘关系分析
- API订阅管理

### 数据集管理 
- 数据集浏览和筛选
- 数据集上传和管理
- 数据集详情查看
- 数据质量评估
- 使用情况统计

### 通用功能
- 分类树形结构
- 高级筛选器
- 分页和排序
- 搜索功能
- 功能标志控制

## 技术栈
- **前端框架**: React 17
- **UI组件库**: Material-UI 4.x
- **状态管理**: React Hooks + Context API
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **文件上传**: react-dropzone

## 安装和运行

### 前置要求
- Node.js (版本 14 或更高)
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

应用将在 http://localhost:3001 上运行。

### 构建生产版本
```bash
npm run build
```

## 项目结构
```
src/
├── components/           # 通用组件
│   ├── ApiDetailDialog.js
│   ├── ApiSubscriptionDialog.js
│   ├── DatasetDetailDialog.js    # 🆕 数据集详情对话框
│   ├── DatasetUploadDialog.js    # 🆕 数据集上传对话框
│   └── ...
├── pages/               # 页面组件
│   ├── ApiCatalog.js
│   ├── DatasetsPage.js  # 🆕 增强的数据集管理页面
│   └── ...
├── services/            # API服务
│   ├── DatasetManagementService.js  # 🆕 数据集管理服务
│   └── ...
└── constants/           # 常量定义
```

## 使用说明

### 数据集管理
1. 进入数据集页面
2. 点击"上传数据集"按钮或页面顶部的上传按钮
3. 在上传对话框中拖拽或选择文件
4. 填写数据集的基本信息和配置
5. 确认上传，查看进度
6. 在数据集列表中点击"查看"按钮查看详细信息

### API管理
1. 进入API目录页面
2. 使用筛选器和搜索功能查找所需API
3. 点击API卡片查看详细信息
4. 使用导入功能添加新的API

## 开发特性
- 模块化组件设计
- TypeScript类型支持（部分）
- ESLint代码规范检查
- 热模块替换(HMR)支持
- 开发时实时错误显示

## 贡献指南
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证
MIT License - 详见 LICENSE 文件 

## 功能特性

### 核心功能
- **API构建器**: 通过可视化界面创建API
- **数据库连接**: 连接和管理多种数据库
- **表格选择**: 选择数据库表作为API数据源
- **SQL编辑器**: 编写和测试SQL查询
- **参数配置**: 配置API输入和输出参数
- **API管理**: 查看、编辑和删除已创建的API
- **分类管理**: 为API设置分层分类

### 数据集管理
- **数据集列表**: 查看所有可用数据集，支持搜索和筛选
- **数据集详情**: 查看数据集的详细信息，包括元数据、数据样本、统计信息等
- **数据集上传**: 支持两种上传模式：
  - **表单创建**: 手动定义数据结构和字段信息
  - **文件上传**: 上传现有数据文件（JSON、CSV、Excel等格式）
- **权限管理**: 设置数据集访问权限和共享设置

### 新功能：可编辑参数表格
- **交互式编辑**: 点击任意单元格进行实时编辑
- **可视化反馈**: 
  - 编辑状态高亮显示
  - 修改内容橙色标记
  - 新增行绿色背景
  - 实时验证反馈（绿色勾号/红色叉号）
- **批量操作**: 
  - 保存所有更改
  - 重置所有修改
  - 添加/删除参数
- **数据验证**: 
  - 参数名称格式验证
  - 必填字段检查
  - 数据类型验证
- **键盘支持**: Enter保存，Escape取消编辑
- **通知系统**: 操作结果实时反馈

## 主要组件

### API相关组件
- `ApiBuilder.js` - API构建主界面
- `TableSelection.js` - 数据表选择组件
- `SqlEditor.js` - SQL查询编辑器
- `ParameterSelection.js` - 参数配置组件
- `ApiDetailDialog.js` - API详情对话框
- `EditableParameterTable.js` - **新增**可编辑参数表格组件
- `ApiList.js` - API列表管理
- `ApiImportDialog.js` - API导入对话框
- `ApiBatchCreator.js` - 批量API创建工具

### 数据集相关组件
- `DatasetsPage.js` - 数据集管理主页面
- `DatasetDetailDialog.js` - 数据集详情对话框
- `DatasetUploadDialog.js` - 数据集上传对话框

### 通用组件
- `DatabaseConnection.js` - 数据库连接组件
- `CategoryCascader.js` - 分层分类选择器
- `UniversalFilter.js` - 通用过滤器组件

## 技术栈

- **前端框架**: React 17
- **UI库**: Material-UI 4
- **状态管理**: React Hooks
- **构建工具**: Create React App
- **图标**: Material-UI Icons
- **文本编辑**: mui-rte (富文本编辑器)
- **文件上传**: react-dropzone

## 安装和运行

1. 克隆项目
```bash
git clone [项目地址]
cd api-build-example
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm start
```

4. 打开浏览器访问 `http://localhost:3000`

## EditableParameterTable 组件使用说明

### 基本用法
```jsx
import EditableParameterTable from './components/EditableParameterTable';

<EditableParameterTable
  parameters={parametersArray}
  onParametersChange={handleParametersChange}
  title="参数管理"
  subtitle="点击单元格编辑参数"
  editable={true}
/>
```

### 参数说明
- `parameters`: 参数数组，格式如下：
  ```js
  [
    {
      id: "param_1",
      name: "username", 
      type: "string",
      required: true,
      description: "用户名"
    }
  ]
  ```
- `onParametersChange`: 参数变更回调函数
- `title`: 表格标题
- `subtitle`: 表格副标题
- `editable`: 是否可编辑

### 支持的数据类型
- `string` - 字符串
- `integer` - 整数
- `number` - 数字
- `boolean` - 布尔值
- `array` - 数组
- `object` - 对象
- `date` - 日期
- `file` - 文件

### 快捷键
- `Enter` - 保存当前编辑
- `Escape` - 取消当前编辑
- 点击其他位置 - 自动保存当前编辑

## 文件结构

```
src/
├── components/           # React组件
│   ├── ApiBuilder.js    # API构建器
│   ├── EditableParameterTable.js  # 可编辑参数表格
│   ├── DatasetsPage.js  # 数据集管理页面
│   └── ...
├── services/            # 服务层
│   ├── ApiBuilderService.js
│   ├── DatasetManagementService.js
│   └── ...
├── constants/           # 常量定义
│   └── apiCategories.js
└── App.js              # 应用入口
```

## 开发说明

- 组件采用函数式组件 + Hooks 模式
- 使用Material-UI主题系统进行样式管理
- 支持暗色/亮色主题切换
- 组件间通过props进行数据传递
- 使用模拟数据进行开发测试 