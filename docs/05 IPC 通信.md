## 05 IPC 通信

- 目标1：了解IPC通信模式以及基本概念
- 目标1：实现一个主/渲染进程双向通信案例
- 目标2：了解常见的四种IPC通信模式，并了解其使用场景

### 场景分类
- invoke/handle：请求-响应（基于 `ipcRenderer.invoke` 和 `ipcMain.handle`）
- send/on：单向异步消息

### 示例：获取应用版本
```ts
// 主进程
import { ipcMain, app } from 'electron'
ipcMain.handle('app:get-version', () => app.getVersion())

// 预加载（见第 03 章）
// contextBridge.exposeInMainWorld('api', { getAppVersion: () => ipcRenderer.invoke('app:get-version') })

// 渲染进程
const v = await window.api.getAppVersion()
```

### 示例：读取文本（含校验）
```ts
// 主进程
import { ipcMain } from 'electron'
import { promises as fs } from 'node:fs'
import path from 'node:path'

function assertInsideUserHome(filePath: string) {
  const home = process.env.HOME || process.env.USERPROFILE || ''
  const resolved = path.resolve(filePath)
  if (!resolved.startsWith(path.resolve(home))) throw new Error('Path not allowed')
}

ipcMain.handle('fs:read-text', async (_evt, filePath: string) => {
  assertInsideUserHome(filePath)
  return fs.readFile(filePath, 'utf8')
})
```

### 错误传递
- `ipcMain.handle` 抛出的错误会以拒绝的 Promise 返回给渲染端
- 在渲染端捕获并提示用户

### 本章要点
- 优先使用 invoke/handle 形式，统一错误与返回
- 对输入进行严格校验，避免越权访问
