import { Tray, Menu, BrowserWindow, nativeImage, app } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let tray = null

export function createTrayIfAvailable() {
	try {
        const iconPath = path.join(__dirname, '../assets/tray.png')
        let icon = nativeImage.createFromPath(iconPath);
        const isMac = process.platform === 'darwin'
		const targetSize = isMac ? 18 : 16
        icon = icon.resize({ width: targetSize, height: targetSize })
        tray = new Tray(icon)
        const menu = Menu.buildFromTemplate([
			{ label: '显示主窗口', click: () => BrowserWindow.getAllWindows()[0]?.show() },
			{ type: 'separator' },
			{ label: '退出', click: () => app.quit() }
		])
		tray.setToolTip('Electron Todo')
		tray.setContextMenu(menu)
	} catch (e) {
		console.error('[tray] createTrayIfAvailable error:', e)
	}
}
