# React 项目开发约定

为了确保项目的一致性和稳定性，请所有开发人员遵守以下约定。

## 核心依赖版本

在项目开发过程中，请务必使用以下指定的版本：

* **React:** `17.x.x` (请使用 React 17 的最新稳定版本)
* **Node.js:** `14.16.0`
* **Material-UI:** `v4.x.x` (请使用 Material-UI v4 的最新稳定版本)

## 开发语言与文件格式

* **主要语言:** JavaScript
* **文件格式:** 所有 React 组件和相关 JavaScript 代码请使用 `.js` 文件格式。**不使用 `.jsx` 文件格式。**

## 代码风格与规范

* 请遵循项目统一配置的 ESLint 和 Prettier 规则，以确保代码风格的一致性。
* 组件命名请使用帕斯卡命名法 (PascalCase)，例如 `MyComponent`。
* 函数和变量命名请使用驼峰命名法 (camelCase)，例如 `myFunction`, `isLoading`。

## 状态管理

* 根据项目需求选择合适的状态管理方案（例如 React Context, Redux 等），并与团队成员协商一致。

## 兼容性注意事项

在开发过程中，除了上述核心依赖版本外，还需要考虑以下兼容性问题：

* **浏览器兼容性:**
    * 确保代码在主流现代浏览器（Chrome, Firefox, Safari, Edge）的最新版本上能够正常运行。
    * 如果需要支持旧版浏览器（如 IE11），请进行充分测试并引入必要的 Polyfills。
* **其他库和框架:**
    * 在引入新的第三方库或框架时，请检查其与项目当前技术栈（特别是 React 17 和 Material-UI v4）的兼容性。
    * 优先选择有良好社区支持和持续维护的库。
* **Node.js 模块:**
    * 确保所使用的 Node.js 模块与 `14.16.0` 版本兼容。

## 版本控制

* 所有代码提交必须遵循项目的 Git 分支管理策略和提交信息规范。

## 测试

* 鼓励编写单元测试和集成测试，以保证代码质量。

## 文档

* 对于复杂的组件或逻辑，请添加必要的注释或文档说明。

---

请在开始开发前仔细阅读并理解以上约定。如有任何疑问，请及时与团队负责人沟通。
