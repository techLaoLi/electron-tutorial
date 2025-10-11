# Electron 实战教程与示例（Todo 桌面应用）

本仓库包含一套从入门到发布的 Electron 教程（见 `docs` 目录）以及一个可运行的 Todo 桌面示例应用，方便边学边做。

## 学习路线（对应 docs 目录）

- 01 环境与项目初始化：安装、项目骨架与关键概念
- 02 主进程与渲染进程：双进程模型、职责划分与启动流程
- 03 预加载与安全模型：`contextIsolation`、`contextBridge`、最小暴露原则
- 04 窗口与生命周期：`BrowserWindow` 配置、生命周期事件
- 05 IPC 通信：四种常见通信模式与示例
- 06 菜单、快捷键、托盘：应用菜单、全局快捷键、系统托盘
- 07 文件系统与原生能力：受控封装与安全调用
- 08 打包与发布（electron-builder）：多平台产物与基本配置
- 09 自动更新与崩溃上报：更新流程与日志/监控接入
- 10 不同类型的安装包的介绍和对比
- 11 实战：待办事项应用：综合前文完成可打包的 Todo App
- 12 electron专题（electron-builder）：深入 electron-builder 的高级配置
- 13 electron专题（entitlements 配置）：macOS 权限配置详解
- 14 electron专题（macOS 代码签名）：Electron 应用在 macOS 上的代码签名实践
- 15 electron专题（electron-updater）：深入理解 Electron 自动更新机制
- 16 electron专题（electron-debug）：Electron 调试工具
- 17 electron专题（electron-notarize）：macOS 签名
- 18 electron专题（electron-log）：日志记录与监控
- 19 electron专题（electron-store）：本地数据存储

详细内容请阅读 `docs/` 中对应章节。

## 示例应用简介

- 功能点：
  - 添加/勾选/删除待办
  - 本地 JSON 文件持久化
  - 应用菜单与常用快捷键（见 `src/main/menu.js`、`src/main/shortcuts.js`）
  - 系统托盘菜单（见 `src/main/tray.js`）
- 技术要点：
  - 主进程：窗口管理、菜单/托盘、数据存取与 IPC 处理
  - 渲染进程：最小 UI（原生 HTML/JS），通过预加载暴露的 API 调用主进程
  - 预加载：仅暴露白名单 API，保障安全模型

## 目录结构

```
electron-tutorial/
  ├─ src/
  │  ├─ main/           # 主进程代码（入口、菜单、托盘、IPC、存储等）
  │  ├─ preload.js      # 预加载脚本（安全桥）
  │  └─ renderer/       # 渲染进程静态资源（HTML/JS）
  ├─ docs/              # 教程章节
  ├─ electron-builder.yml（可选）
  └─ package.json
```

## 快速开始

```bash
npm install
npm start
```

运行后会打开主窗口；数据默认保存在系统 `userData` 目录下的 `data/todos.json`（见 `src/main/store.js`）。

## 打包（可选）

1. 安装打包工具：

```bash
npm i -D electron-builder
```

2. 直接打包：

```bash
npx electron-builder
```

或根据 `electron-builder.yml` 自定义配置后再执行打包。

## 开发提示

- 安全：确保 `contextIsolation: true`、`nodeIntegration: false`，仅通过预加载暴露最小必要 API。
- 托盘：在 macOS 建议使用模板图标（或对图标进行缩放），确保右键可弹出上下文菜单。
- 快捷键：注册后记得在 `will-quit` 中 `unregisterAll` 释放。

## 脚本

```json
{
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "build:all": "electron-builder --mac --win --linux",
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac"
  }
}
```

### build命令

该命令用于构建 Electron 应用。
如果你的机器是mac、则该命令会自动构建mac版本。
如果你的机器是windows、则该命令会自动构建windows版本。
如果你的机器是linux、则该命令会自动构建linux版本。

### build:all命令

该命令用于构建 Electron 应用，并同时构建mac、windows、linux版本。
问题：构建过程中可能会出现错误，因为本地机器的系统和架构不同，某些工具支持受限，导致构建出错。
建议：要构建某一个系统版本的应用，可以使用对应的机器进行构建。（electron-builder，官方文档中也是这样说明的）。

### build:win命令

该命令用于构建 Electron 应用，并构建windows版本。

### build:mac命令

该命令用于构建 Electron 应用，并构建mac版本。

## 许可证

本项目用于学习与演示，示例代码可按需复用。
