
## 08 打包与发布（electron-builder）

### 基本介绍与核心概念

`electron-builder` 是 Electron 应用最主流的打包与发布工具，支持 Windows、macOS、Linux 跨平台构建，自动生成安装包、便携包、自动更新资源等。它极大简化了 Electron 应用的分发、签名、自动更新等流程。

**核心概念：**
- **打包（Packaging）**：将源码、依赖、资源等整理为可分发的应用包。
- **发布（Publishing）**：将构建产物上传到服务器、云存储或分发平台，供用户下载安装。
- **签名（Code Signing）**：为应用包加数字签名，提升安全性，防止篡改，macOS/Windows 平台强烈建议签名。
- **自动更新（Auto Update）**：结合 electron-updater，可实现应用的自动检测与下载新版本。

- 目标：用 electron-builder 进行跨平台打包与签名配置概览。

### 安装
```bash
npm i -D electron-builder
```

### 配置示例（package.json）
```json
{
  "name": "electron-tutorial",
  "version": "1.0.0",
  "main": "dist/main.js",
  "build": {
    "appId": "com.example.electrontutorial",
    "files": ["dist/**", "index.html", "assets/**"],
    "mac": { "category": "public.app-category.productivity" },
    "win": { "target": ["nsis"] },
    "linux": { "target": ["AppImage"], "category": "Utility" }
  },
  "scripts": {
    "dist": "electron-builder"
  }
}
```

### 配置项详细解读

`build` 字段是 electron-builder 的核心配置，支持多平台自定义。常用配置项说明：

- **appId**：应用唯一标识，建议使用反域名格式（如 com.example.app）。
- **files**：指定需要打包进应用的文件/目录，支持 glob。
- **asar**：是否启用 asar 压缩（布尔值或对象），可提升安全性和加载速度。
- **extraResources**：额外需要拷贝到应用根目录的资源（如数据库、外部依赖等）。
- **directories**：自定义输出目录（如 output、buildResources）。
- **mac/win/linux**：平台相关配置，如 target（目标包类型）、icon（图标）、category（分类）等。
- **publish**：自动发布配置，支持 GitHub、阿里云 OSS、七牛云等。
- **afterPack/afterSign**：打包/签名后自定义钩子脚本。

更多配置详见官方文档：https://www.electron.build/configuration/configuration

---

### 打包与发布流程

1. **本地打包**：
  - 执行 `npm run dist`，生成各平台安装包（如 .dmg、.exe、.AppImage 等）。
  - 检查输出目录（默认 dist/），确认产物完整。
2. **签名与公证**：
  - macOS 需 Apple 证书签名并公证，Windows 推荐代码签名证书。
3. **发布分发**：
  - 可手动上传产物到官网、网盘、GitHub Release 等。
  - 配置 `publish` 字段可实现自动上传。
4. **自动更新**：
  - 配合 electron-updater，用户可自动检测并下载新版本。

---


### 本章要点
- electron-builder 的作用与优势
- 打包、发布、签名、自动更新等核心概念
- build 配置项详细解读与实用技巧
- 打包、签名、发布的完整流程
- 区分开发、测试与生产构建配置
