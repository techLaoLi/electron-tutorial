## 12 electron专题（electron-builder）

### 基本概念

electron-builder 是 Electron 应用最主流的打包与发布工具，支持 Windows、macOS、Linux 跨平台构建，自动生成安装包、便携包、自动更新资源等。它极大简化了 Electron 应用的分发、签名、自动更新等流程。

#### 核心概念

- **打包（Packaging）**：将源码、依赖、资源等整理为可分发的应用包。
- **发布（Publishing）**：将构建产物上传到服务器、云存储或分发平台，供用户下载安装。
- **签名（Code Signing）**：为应用包加数字签名，提升安全性，防止篡改，macOS/Windows 平台强烈建议签名。
- **自动更新（Auto Update）**：结合 electron-updater，可实现应用的自动检测与下载新版本。

### 基本能力

electron-builder 提供了以下核心功能：

1. **跨平台构建**：支持在任意平台构建 Windows、macOS 和 Linux 应用
2. **多种输出格式**：支持生成各种安装包格式，如 DMG、NSIS、AppImage 等
3. **代码签名**：支持 Windows 和 macOS 应用的代码签名
4. **自动更新**：与 electron-updater 集成，支持应用自动更新
5. **资源压缩**：支持 asar 打包，提高应用加载速度和安全性
6. **自定义配置**：提供丰富的配置选项，满足各种定制需求

### 安装

```bash
npm install --save-dev electron-builder
```

### 配置说明

electron-builder 支持多种配置方式：

1. **package.json 中的 build 字段**
2. **独立的 electron-builder.json 文件**
3. **electron-builder.yaml 或 electron-builder.yml 文件**
4. **命令行参数**

#### 常用配置项

##### 通用配置

- **appId**：应用唯一标识，建议使用反域名格式（如 com.example.app）
- **productName**：应用名称，默认使用 package.json 中的 name
- **files**：指定需要打包进应用的文件/目录，支持 glob 模式
- **asar**：是否启用 asar 压缩（布尔值或对象），可提升安全性和加载速度
- **extraResources**：额外需要拷贝到应用资源目录的资源
- **extraFiles**：额外需要拷贝到应用根目录的文件

##### 平台特定配置

**icon 说明**
icon 是应用的图标，用于在桌面、任务栏、启动菜单、安装包等处显示。
icon 的路径可以是绝对路径，也可以是相对于 package.json 文件的相对路径。
icon 的格式可以是 mac（.icns 或 .png）、windows （.ico 或 .png）、Linux（.png 或 .svg）
icon 的尺寸建议为 mac（512x512）、windows（256x256）、Linux（512x512）

###### macOS 配置 (mac)

- **category**：应用分类，如 public.app-category.productivity
- **target**：目标包类型，如 dmg、zip、pkg
- **icon**：图标路径
- **identity**：代码签名身份
- **entitlements**：权限配置文件路径
- **hardenedRuntime**：是否启用 hardened runtime

1、category 说明

category 是应用的分类，用于在 macOS 上显示在应用程序列表中。

例如：public.app-category.games，表示该应用的类型为游戏分类。
例如：public.app-category.developer-tools，表示该应用的类型为开发工具分类。

关于 category 配置，可参考官方文档：https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8

2、target 说明

target 是打包的应用类型，如 dmg、zip、pkg、nsis、msi、portable 等。

3、hardenedRuntime

hardenedRuntime 是 macOS 10.11（El Capitan）引入的权限机制，用于限制应用对系统资源的访问。
启用该功能后，应用将无法访问系统资源，如文件、网络、硬件等。

默认情况下为 false

一般配置为 true，和 entitlements 配合使用，否则应用可能会因为缺少权限而崩溃。
但是当我们配置为 true 时，则需要配置 entitlements 文件。因为系统这时候，不会给一个默认的 entitlements 文件。

4、entitlements
entitlements 是 macOS 10.11（El Capitan）引入的权限机制，用于限制应用对系统资源的访问。
entitlements 是一个 XML 文件，用于配置应用对系统资源的访问权限。

如果我们的应用没有配置 entitlements，则系统会给一个默认的 entitlements 文件，该文件允许应用访问系统资源。

electron-builder 在 node_modules/app-builder-lib/templates/ 目录中提供了一个默认的 entitlements.mac.plist 文件，内容如下：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <!-- https://github.com/electron/electron-notarize#prerequisites -->
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <!-- https://github.com/electron-userland/electron-builder/issues/3940 -->
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
  </dict>
</plist>
```
关于一个项目，如何配置 entitlements，具备哪些能力，这是另一个专题，请参考 13 electron专题（entitlements 配置）

关于 entitlements 配置，可参考苹果官方文档：https://developer.apple.com/documentation/bundleresources/entitlements

5、identity

用于指定在 macOS 上进行代码签名时所使用的开发者证书的名称。这个证书必须事先安装在系统的钥匙串（Keychain）中。

但是正常情况下，一般使用 CSC_LINK or CSC_NAME 配置。

以下是 electron-builder 官方网站的针对 identity 的解释：
签名时使用的证书名称。建议使用环境变量CSC_LINK或CSC_NAME，而不是指定此选项。MAS安装程序的标识在mas中指定。
设置为 - 使用临时标识进行签名。设置为 null 可完全跳过签名。

###### Windows 配置 (win)

- **target**：目标包类型，如 nsis、msi、portable
- **icon**：图标路径
- **certificateFile**：代码签名证书文件路径
- **certificatePassword**：代码签名证书密码

###### Linux 配置 (linux)

- **target**：目标包类型，如 AppImage、deb、rpm
- **category**：应用分类，如 Utility、Development
- **icon**：图标路径

#### 配置示例

```yaml
appId: com.example.electrontodo
files:
  - src/**
  - package.json
  - "!dist/**"
mac:
  category: public.app-category.productivity
win:
  target:
    - nsis
    - zip
linux:
  target:
    - AppImage
  category: Utility
nsis:
  differentialPackage: false
```

### 构建命令

#### 基本构建

```bash
# 构建当前平台应用
npx electron-builder

# 构建指定平台应用
npx electron-builder --win
npx electron-builder --mac
npx electron-builder --linux

# 构建多个平台应用
npx electron-builder --win --mac --linux

# 构建特定架构
npx electron-builder --win --x64
npx electron-builder --mac --arm64
```

#### 高级构建选项

- **--dir**：仅构建未打包的应用目录，用于测试
- **--config**：指定配置文件路径
- **--publish**：构建后自动发布

### 代码签名

#### macOS 代码签名

macOS 应用分发需要 Apple 开发者证书进行签名，并且推荐进行公证（Notarization）。

macOS 的签名和公证，是另外一个专题，请查看 14 electron专题（macOS 代码签名）

本章节的主题，是介绍electron-builder 的配置以及相关功能。

##### 配置示例

```json
{
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
```

1、identity

证书名称，它要求我们的证书必须安装在系统的钥匙串（Keychain）中。

在打包应用时，如果未指定 identity，则系统会自动选择一个默认的证书进行签名。但是默认的证书可能不是我们想要的，所以需要指定一个正确的证书。

2、notarize

在 macOS 平台的 electron-builder 配置中，notarize 选项用于启用和配置 Apple 的公证（Notarization）服务。

electron-builder 会在构建完成后自动将应用提交给 Apple 的公证服务进行检查，并在通过后将公证票据附加到应用中。

notarize 配置项，用于指定 Apple 账号的团队 ID。

3、其他说明

证书、代码签名、公证、这些概念，我将会在 14 electron专题（macOS 代码签名）详细说明。

这里我们需要理解的是，这些配置，在macOS上签名、公证是必须的配置。但是它为何这么配置，原因就是苹果开发平台的限制。

##### 权限配置文件 (entitlements.mac.plist)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.cs.disable-library-validation</key>
  <true/>
</dict>
</plist>
```

#### Windows 代码签名

Windows 应用推荐使用代码签名证书进行签名，提升用户信任度。

##### 配置示例

```json
{
  "win": {
    "certificateFile": "path/to/certificate.p12",
    "certificatePassword": "certificate_password"
  }
}
```

### 自动更新

electron-builder 与 electron-updater 集成，支持应用自动更新功能。

这一块，会在 15 electron专题（electron-updater）中进行详细介绍。

#### 配置示例

```json
{
  "publish": {
    "provider": "github",
    "owner": "your-name",
    "repo": "your-repo"
  }
}
```

### 常见问题与解决方案

#### 构建文件过大问题

如果构建时遇到文件过大的问题，可能是因为配置中包含了构建输出目录。解决方案：

```yaml
files:
  - src/**
  - package.json
  - "!dist/**"  # 排除构建输出目录
```

#### macOS 构建 Windows 应用失败

在 macOS 上构建 Windows 应用时可能遇到 Wine 相关错误，可以使用以下方法：

1. 使用 --dir 参数仅构建未打包的应用
2. 在 Windows 系统上进行构建
3. 使用 CI/CD 服务进行跨平台构建

#### 代码签名问题

如果遇到代码签名问题，确保：

1. 证书已正确安装到系统钥匙串中
2. 配置文件中指定了正确的证书身份
3. entitlements 文件配置正确

### 最佳实践

1. **配置管理**：使用独立的配置文件而不是 package.json 中的 build 字段
2. **文件过滤**：明确指定需要包含和排除的文件，避免打包不必要的内容
3. **代码签名**：为分发的应用进行代码签名，提升安全性和用户信任度
4. **自动更新**：集成自动更新功能，提升用户体验
5. **CI/CD 集成**：使用持续集成服务进行自动化构建和发布