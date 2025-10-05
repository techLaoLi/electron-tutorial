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

### 代码签名详解

#### 为什么需要代码签名？

代码签名是数字签名技术在软件分发中的应用，主要作用：

1. **身份验证**：证明软件来源的真实性和可信度
2. **完整性保护**：防止软件在传输过程中被篡改
3. **信任建立**：减少操作系统和用户的警告提示
4. **分发要求**：某些平台（如 macOS）要求签名才能分发

#### macOS 代码签名

##### 1. Apple Developer 账号准备

首先需要注册 Apple Developer 账号（$99/年）：

```bash
# 访问 Apple Developer 网站
# https://developer.apple.com/account/

# 注册开发者账号后，需要创建以下证书：
# 1. Developer ID Application（用于分发到 Mac App Store 之外）
# 2. Mac App Store（用于分发到 Mac App Store）
# 3. Development（用于开发测试）
```

##### 2. 证书类型说明

| 证书类型                 | 用途     | 分发范围           | 有效期 |
| ------------------------ | -------- | ------------------ | ------ |
| Developer ID Application | 直接分发 | Mac App Store 之外 | 1 年   |
| Mac App Store            | 商店分发 | Mac App Store      | 1 年   |
| Development              | 开发测试 | 本地和测试设备     | 1 年   |

##### 3. 创建证书和配置文件

```bash
# 1. 在 Keychain Access 中创建证书签名请求（CSR）
# 打开 Keychain Access -> 证书助理 -> 从证书颁发机构请求证书

# 2. 在 Apple Developer 网站创建证书
# Certificates, Identifiers & Profiles -> Certificates -> + 号

# 3. 下载证书并安装到 Keychain

# 4. 创建 App ID（如果还没有）
# Certificates, Identifiers & Profiles -> Identifiers -> App IDs

# 5. 创建 Provisioning Profile（仅 Mac App Store 需要）
# Certificates, Identifiers & Profiles -> Profiles
```

##### 4. electron-builder 配置

```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAM_ID)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist",
      "notarize": {
        "teamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

##### 5. 权限配置文件 (entitlements.mac.plist)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.cs.disable-executable-page-protection</key>
  <true/>
  <key>com.apple.security.cs.disable-library-validation</key>
  <true/>
  <key>com.apple.security.network.client</key>
  <true/>
  <key>com.apple.security.network.server</key>
  <true/>
  <key>com.apple.security.files.user-selected.read-write</key>
  <true/>
  <key>com.apple.security.files.downloads.read-write</key>
  <true/>
</dict>
</plist>
```

##### 6. 公证 (Notarization)

公证是 Apple 的安全检查流程，确保应用没有恶意代码：

```bash
# 1. 创建 App-Specific Password
# Apple ID 账号设置 -> App-Specific Passwords

# 2. 配置环境变量
export APPLE_ID="your-apple-id@example.com"
export APPLE_PASSWORD="your-app-specific-password"
export APPLE_TEAM_ID="YOUR_TEAM_ID"

# 3. 手动公证（如果需要）
xcrun notarytool submit YourApp.dmg \
  --apple-id "$APPLE_ID" \
  --password "$APPLE_PASSWORD" \
  --team-id "$APPLE_TEAM_ID" \
  --wait

# 4. 装订公证票据
xcrun stapler staple YourApp.dmg
```

##### 7. 完整的 macOS 签名配置

```json
{
  "build": {
    "mac": {
      "target": [
        {
          "target": "dmg",
          "arch": ["x64", "arm64"]
        },
        {
          "target": "zip",
          "arch": ["x64", "arm64"]
        }
      ],
      "category": "public.app-category.productivity",
      "icon": "build/icon.icns",
      "identity": "Developer ID Application: Your Company Name (TEAM_ID)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist",
      "notarize": {
        "teamId": "YOUR_TEAM_ID"
      },
      "artifactName": "${productName}-${version}-${arch}.${ext}"
    }
  }
}
```

#### Windows 代码签名

##### 1. 证书类型

Windows 代码签名证书主要分为两类：

| 证书类型                 | 颁发机构 | 信任级别 | 价格        |
| ------------------------ | -------- | -------- | ----------- |
| EV (Extended Validation) | 商业 CA  | 最高     | $400-800/年 |
| Standard                 | 商业 CA  | 高       | $200-400/年 |
| Self-Signed              | 自签名   | 低       | 免费        |

##### 2. 获取证书

```bash
# 1. 选择证书颁发机构（推荐）
# - DigiCert
# - Sectigo
# - GlobalSign
# - SSL.com

# 2. 购买证书
# 访问 CA 网站，选择适合的证书类型

# 3. 生成 CSR (Certificate Signing Request)
# 使用 OpenSSL 或 Windows Certificate Manager

# 4. 提交 CSR 给 CA，完成验证流程

# 5. 下载证书文件（.p12 或 .pfx 格式）
```

##### 3. 证书安装

```bash
# 方法1：使用 Windows Certificate Manager
# 1. 双击 .pfx 文件
# 2. 选择安装位置（当前用户或本地计算机）
# 3. 输入证书密码
# 4. 选择证书存储位置（个人）

# 方法2：使用 PowerShell
Import-PfxCertificate -FilePath "certificate.pfx" -CertStoreLocation Cert:\CurrentUser\My

# 方法3：使用 certutil
certutil -importPFX "certificate.pfx"
```

##### 4. electron-builder 配置

```json
{
  "build": {
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "ia32"]
        },
        {
          "target": "portable",
          "arch": ["x64"]
        }
      ],
      "certificateFile": "path/to/certificate.p12",
      "certificatePassword": "certificate_password",
      "signingHashAlgorithms": ["sha256"],
      "sign": "./build/sign.js"
    }
  }
}
```

##### 5. 自定义签名脚本 (build/sign.js)

```javascript
const { execSync } = require("child_process");
const path = require("path");

exports.default = async function (configuration) {
  const { path: filePath, hash } = configuration;

  // 使用 signtool 进行签名
  const signCommand = [
    "signtool",
    "sign",
    "/f",
    "path/to/certificate.p12",
    "/p",
    "certificate_password",
    "/fd",
    "sha256",
    "/tr",
    "http://timestamp.digicert.com",
    "/td",
    "sha256",
    filePath,
  ].join(" ");

  try {
    execSync(signCommand, { stdio: "inherit" });
    console.log(`Successfully signed: ${filePath}`);
  } catch (error) {
    console.error(`Signing failed: ${error.message}`);
    throw error;
  }
};
```

##### 6. 时间戳服务

时间戳确保签名在证书过期后仍然有效：

```json
{
  "build": {
    "win": {
      "sign": {
        "timestampUrl": "http://timestamp.digicert.com",
        "timestampServer": "http://timestamp.digicert.com"
      }
    }
  }
}
```

##### 7. 完整的 Windows 签名配置

```json
{
  "build": {
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64", "ia32"]
        }
      ],
      "icon": "build/icon.ico",
      "requestedExecutionLevel": "asInvoker",
      "certificateFile": "build/certificate.p12",
      "certificatePassword": "your_certificate_password",
      "signingHashAlgorithms": ["sha256"],
      "sign": "./build/sign.js",
      "artifactName": "${productName}-${version}-${arch}.${ext}"
    }
  }
}
```

#### 签名最佳实践

##### 1. 环境变量管理

```bash
# macOS
export APPLE_ID="your-apple-id@example.com"
export APPLE_PASSWORD="your-app-specific-password"
export APPLE_TEAM_ID="YOUR_TEAM_ID"

# Windows
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate_password"
```

##### 2. CI/CD 集成

```yaml
# GitHub Actions 示例
name: Build and Sign

on:
  push:
    tags: ["v*"]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build and sign (macOS)
        if: matrix.os == 'macos-latest'
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APPLE_PASSWORD: ${{ secrets.APPLE_PASSWORD }}
          APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
        run: npm run dist

      - name: Build and sign (Windows)
        if: matrix.os == 'windows-latest'
        env:
          CSC_LINK: ${{ secrets.CSC_LINK }}
          CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
        run: npm run dist
```

##### 3. 签名验证

```bash
# macOS 验证签名
codesign -dv --verbose=4 YourApp.app
codesign -vv YourApp.app

# Windows 验证签名
signtool verify /pa YourApp.exe
signtool verify /pa /v YourApp.exe
```

##### 4. 常见问题解决

**macOS 常见问题：**

```bash
# 问题1：证书找不到
# 解决：检查证书是否在 Keychain 中，使用正确的证书名称
security find-identity -v -p codesigning

# 问题2：公证失败
# 解决：检查 App-Specific Password 和 Team ID
xcrun notarytool history --apple-id "$APPLE_ID" --password "$APPLE_PASSWORD" --team-id "$APPLE_TEAM_ID"

# 问题3：权限不足
# 解决：检查 entitlements 文件配置
```

**Windows 常见问题：**

```bash
# 问题1：证书密码错误
# 解决：检查证书密码，确保使用正确的 .pfx 文件

# 问题2：时间戳服务不可用
# 解决：更换时间戳服务器
# http://timestamp.digicert.com
# http://timestamp.sectigo.com
# http://timestamp.globalsign.com

# 问题3：签名验证失败
# 解决：检查证书链是否完整
```

##### 5. 安全注意事项

1. **私钥保护**：私钥文件要妥善保管，不要提交到版本控制
2. **密码管理**：使用环境变量或密钥管理服务
3. **证书备份**：定期备份证书和私钥
4. **访问控制**：限制对签名证书的访问权限
5. **监控使用**：监控证书的使用情况，防止滥用

### 本章要点

- electron-builder 的作用与优势
- 打包、发布、签名、自动更新等核心概念
- build 配置项详细解读与实用技巧
- 打包、签名、发布的完整流程
- 区分开发、测试与生产构建配置
- macOS 代码签名和公证的完整流程
- Windows 代码签名的配置和最佳实践
- 签名验证和常见问题解决方案
- CI/CD 集成和安全管理
