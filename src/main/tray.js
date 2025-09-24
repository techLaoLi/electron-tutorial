import { Tray, Menu, BrowserWindow, nativeImage, app } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let tray = null

export function createTrayIfAvailable() {
    try {
        const iconPath = path.join(__dirname, '../../assets/trayTemplate.png')
        const icon = nativeImage.createFromPath(iconPath)
        if (!icon || icon.isEmpty()) return

        tray = new Tray(icon)
        const menu = Menu.buildFromTemplate([
            { label: '显示主窗口', click: () => BrowserWindow.getAllWindows()[0]?.show() },
            { type: 'separator' },
            { label: '退出', click: () => app.quit() }
        ])
        tray.setToolTip('Electron Todo')
        tray.setContextMenu(menu)
    } catch { }
}
