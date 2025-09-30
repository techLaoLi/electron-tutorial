## 05 IPC 通信

- 目标 1：了解 IPC 通信模式以及基本概念
- 目标 1：实现一个主/渲染进程双向通信案例
- 目标 2：了解常见的四种 IPC 通信模式，并了解其使用场景

### 场景分类

IPC 通信，是 electron 提供的一套通信机制，目标是实现主进程和渲染进程的通信。

- ipcMain，在主进程，进行事件注册和监听。
- ipcRenderer，在渲染进程，进行事件注册和监听。

它主要有这么常用的四类场景

#### 1. 渲染进程 ↔ 主进程（双向，异步）

这是最常用的一种 ipc 通信方式，一般在渲染进程调用主进程的时候，使用该方式。

```javascript
// 渲染进程
const result = await ipcRenderer.invoke("request-from-renderer", data);

// 主进程
ipcMain.handle("request-from-renderer", async (event, data) => {
  // 处理请求并返回结果
  return await processData(data);
});
```

#### 2. 渲染进程 → 主进程（单向）

从渲染进程，到主进程的一种单向通信，主进程定义事件，渲染进程触发事件。

在不要求有返回值的情况下，和 handle、invoke 功能差不多。

```javascript
// 渲染进程
ipcRenderer.send("message-from-renderer", data);

// 主进程
ipcMain.on("message-from-renderer", (event, data) => {
  console.log("收到来自渲染进程的消息:", data);
  // 处理消息，但不返回响应
});
```

#### 3. 主进程 → 渲染进程（单向）

主进程到渲染进程的这种通信方式，多数场景是进行消息通知使用。

在渲染进程定义消息类型，在主进程进行消息通知。

```javascript
// 主进程
mainWindow.webContents.send("message-from-main", data);

// 渲染进程
ipcRenderer.on("message-from-main", (event, data) => {
  console.log("收到来自主进程的消息:", data);
});
```

#### 4. 渲染进程 → 渲染进程（通过主进程中转）

渲染进程和渲染进程的通信，其实就是在两个不同的 BrowserWindow 下的进程通信。

一般是通过渲染进程 A，通知到主进程，然后主进程通过 window.webContents.send 的方式进行广播通知。

BrowserWindow.getAllWindows()，是在主进程中获取所有已经创建的窗口实例。

```javascript
// 渲染进程A
ipcRenderer.send("message-to-other-windows", data);

// 主进程
ipcMain.on("message-to-other-windows", (event, data) => {
  // 广播给所有窗口
  BrowserWindow.getAllWindows().forEach((window) => {
    if (window.webContents.id !== event.sender.id) {
      window.webContents.send("broadcast-message", data);
    }
  });
});

// 渲染进程B
ipcRenderer.on("broadcast-message", (event, data) => {
  console.log("收到广播消息:", data);
});
```

### 示例：获取应用版本

```ts
// 主进程
import { ipcMain, app } from "electron";
ipcMain.handle("app:get-version", () => app.getVersion());

// 预加载（见第 03 章）
// contextBridge.exposeInMainWorld('api', { getAppVersion: () => ipcRenderer.invoke('app:get-version') })

// 渲染进程
const v = await window.api.getAppVersion();
```

### 结语

技术学习是一场持续的旅程，我很荣幸能与你同行。关注这个专栏，让我们共同探索 Electron 的奥秘，在实践中成长，在交流中进步。期待与你一起，从基础概念到项目实战，一步步构建出优秀的桌面应用程序！
