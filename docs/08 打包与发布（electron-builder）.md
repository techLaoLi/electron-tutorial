## 08 打包与发布（electron-builder）

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

### 常见注意
- macOS 需要签名与公证；Windows 代码签名证书可免弹窗
- 资源体积控制：排除无关文件、使用 asar

### 本章要点
- 使用 electron-builder 快速产出安装包
- 区分开发、测试与生产构建配置
