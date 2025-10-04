import { ipcMain, dialog } from 'electron'
import { promises as fs } from 'node:fs'

export function registerFileIpcHandlers() {
  ipcMain.handle('dialog:open-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'] })
    if (canceled || filePaths.length === 0) return null
    return filePaths[0]
  })

  ipcMain.handle("dialog:save-file", async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: "untitled.txt",
    });
    return canceled ? null : filePath;
  });

  ipcMain.handle('fs:write-text', async (_e, filePath, content) => {
    await fs.writeFile(filePath, content, 'utf8')
    return true
  })
}