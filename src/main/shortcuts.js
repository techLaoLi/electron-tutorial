import { globalShortcut, BrowserWindow } from 'electron'

export function registerShortcuts() {
    try {
        globalShortcut.register('CommandOrControl+Shift+I', () => {
            const win = BrowserWindow.getFocusedWindow()
            win?.webContents.openDevTools({ mode: 'detach' })
        })
    } catch { }
}

export function unregisterAllShortcuts() {
    try { globalShortcut.unregisterAll() } catch { }
}
