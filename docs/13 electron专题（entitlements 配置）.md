# 13 Electron 专题（entitlements 配置）

## 基本介绍

### 什么是 Entitlements

Entitlements 是 macOS 系统中的一种安全机制，用于定义应用程序可以访问的系统资源和功能。它是一个 XML 格式的属性列表（plist）文件，包含一组键值对，每个键代表一个特定的权限或功能。

在 Electron 应用开发中，entitlements 配置对于 macOS 应用的代码签名和分发至关重要，特别是在启用 hardened runtime 或提交到 Mac App Store 时。

### 为什么需要 Entitlements

1. **安全控制**：限制应用对系统资源的访问，提高系统安全性
2. **权限管理**：明确声明应用需要的特殊权限
3. **代码签名要求**：macOS 对签名应用有明确的 entitlements 要求
4. **应用分发**：Mac App Store 和外部分发都需要正确的 entitlements 配置

## 常用配置项

### 核心权限配置

#### 代码签名相关权限

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <!-- 允许即时编译 (JIT) -->
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    
    <!-- 允许执行未签名的可执行内存 -->
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    
    <!-- 禁用库验证 -->
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
  </dict>
</plist>
```

这些是 Electron 应用最常见的配置项，因为 Electron 应用通常需要：
- JIT 权限来执行 JavaScript 代码
- 未签名可执行内存权限来处理动态代码执行
- 禁用库验证来加载原生模块

### 网络权限

```xml
<dict>
  <!-- 允许客户端网络访问 -->
  <key>com.apple.security.network.client</key>
  <true/>
  
  <!-- 允许服务器网络访问 -->
  <key>com.apple.security.network.server</key>
  <true/>
</dict>
```

### 文件系统权限

```xml
<dict>
  <!-- 允许读写用户选择的文件 -->
  <key>com.apple.security.files.user-selected.read-write</key>
  <true/>
  
  <!-- 允许读写下载目录 -->
  <key>com.apple.security.files.downloads.read-write</key>
  <true/>
  
  <!-- 允许访问图片目录 -->
  <key>com.apple.security.assets.pictures.read-only</key>
  <true/>
  
  <!-- 允许访问音乐目录 -->
  <key>com.apple.security.assets.music.read-only</key>
  <true/>
  
  <!-- 允许访问影片目录 -->
  <key>com.apple.security.assets.movies.read-only</key>
  <true/>
</dict>
```

### 硬件权限

```xml
<dict>
  <!-- 允许访问相机 -->
  <key>com.apple.security.device.camera</key>
  <true/>
  
  <!-- 允许访问麦克风 -->
  <key>com.apple.security.device.microphone</key>
  <true/>
  
  <!-- 允许访问位置信息 -->
  <key>com.apple.security.personal-information.location</key>
  <true/>
  
  <!-- 允许访问通讯录 -->
  <key>com.apple.security.personal-information.addressbook</key>
  <true/>
  
  <!-- 允许访问日历 -->
  <key>com.apple.security.personal-information.calendars</key>
  <true/>
  
  <!-- 允许访问提醒事项 -->
  <key>com.apple.security.personal-information.reminders</key>
  <true/>
</dict>
```

### App Sandbox 权限

```xml
<dict>
  <!-- 启用 App Sandbox -->
  <key>com.apple.security.app-sandbox</key>
  <true/>
  
  <!-- 允许持久化书签 -->
  <key>com.apple.security.files.bookmarks.app-scope</key>
  <true/>
  
  <!-- 允许打印 -->
  <key>com.apple.security.print</key>
  <true/>
</dict>
```

## 工作原理

### Entitlements 处理流程

1. **配置文件定义**：在构建过程中，electron-builder 使用 entitlements.plist 文件
2. **代码签名集成**：签名工具将 entitlements 与应用绑定
3. **系统验证**：macOS 在应用运行时检查 entitlements
4. **权限授予**：根据 entitlements 内容授予相应权限

### Hardened Runtime 与 Entitlements

当启用 hardened runtime (`hardenedRuntime: true`) 时，系统对应用施加更严格的安全限制，此时必须提供 entitlements 文件来明确声明应用需要的权限。

```json
{
  "mac": {
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  }
}
```

### 继承权限 (Inherit Entitlements)

`entitlementsInherit` 用于为应用的辅助进程（如 Helper 应用）定义权限。这些进程通常需要与主应用相同的权限。

### Electron 内置 entitlements

当未启用 hardened runtime (`hardenedRuntime: false`) 时，electron-builder 会自动生成一个默认 entitlements 文件。

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

这就是为什么我们在mac构建配置中，未添加任何entitlements配置，也能运行成功的原因。

## Electron 应用的典型配置

### 基础 Electron 应用配置

对于大多数 Electron 应用，推荐使用以下 entitlements 配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <!-- Electron 应用必需的权限 -->
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
    
    <!-- 根据应用功能添加其他权限 -->
    <!-- 网络访问权限 -->
    <key>com.apple.security.network.client</key>
    <true/>
    
    <!-- 文件访问权限 -->
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
  </dict>
</plist>
```

### Mac App Store 版本配置

如果要提交到 Mac App Store，需要启用 App Sandbox 并根据应用功能添加相应权限：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <!-- 启用 App Sandbox -->
    <key>com.apple.security.app-sandbox</key>
    <true/>
    
    <!-- Electron 应用必需的权限 -->
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
    
    <!-- 根据应用功能添加其他权限 -->
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
  </dict>
</plist>
```

## 配置示例

### Electron Builder 配置

在 `electron-builder` 配置中指定 entitlements 文件路径：

```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (TEAM_ID)",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist"
    }
  }
}
```

或在 [electron-builder.yml](file:///Users/liwudi/Documents/electron/electron-builder.yml) 中：

```yaml
mac:
  identity: "Developer ID Application: Your Name (TEAM_ID)"
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist
```

### 复杂应用配置示例

对于需要更多系统权限的复杂 Electron 应用：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <!-- Electron 核心权限 -->
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
    
    <!-- 网络权限 -->
    <key>com.apple.security.network.client</key>
    <true/>
    <key>com.apple.security.network.server</key>
    <true/>
    
    <!-- 文件系统权限 -->
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
    <key>com.apple.security.files.downloads.read-write</key>
    <true/>
    <key>com.apple.security.assets.pictures.read-only</key>
    <true/>
    
    <!-- 硬件权限 -->
    <key>com.apple.security.device.camera</key>
    <true/>
    <key>com.apple.security.device.microphone</key>
    <true/>
    
    <!-- 个人信息权限 -->
    <key>com.apple.security.personal-information.location</key>
    <true/>
  </dict>
</plist>
```

## 最佳实践

### 权限最小化原则

1. **只添加必需权限**：仅添加应用实际需要的权限
2. **定期审查权限**：随着应用功能变化，及时更新权限配置
3. **区分主应用和辅助进程权限**：使用 `entitlementsInherit` 为辅助进程配置合适的权限

### 调试和问题排查

如果应用因为权限问题崩溃，可以通过以下方式排查：

1. 检查系统日志中的权限相关错误
2. 使用 `codesign` 命令验证应用签名和 entitlements：
   ```bash
   codesign -d --entitlements :- /path/to/YourApp.app
   ```
3. 在开发阶段使用较宽松的权限配置，发布时收紧权限

### 注意事项

1. **Electron 版本兼容性**：不同 Electron 版本对权限的要求可能不同
2. **Apple 政策变化**：关注 Apple 对权限政策的更新
3. **测试环境**：在不同 macOS 版本上测试权限配置
4. **第三方库**：检查使用的第三方原生库是否需要特殊权限

通过合理的 entitlements 配置，可以确保 Electron 应用在 macOS 上安全、稳定地运行，同时满足 Apple 的安全要求。