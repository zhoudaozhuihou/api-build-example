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