import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerIpcHandlers } from './ipc.js'
import { createAppMenu } from './menu.js'
import { registerShortcuts, unregisterAllShortcuts } from './shortcuts.js'
import { createTrayIfAvailable } from './tray.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow = null

function getPreloadPath() {
    return path.join(__dirname, '../preload.js')
}

function getRendererIndexHtml() {
    return path.join(__dirname, '../renderer/index.html')
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 760,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    mainWindow.webContents.openDevTools();

    mainWindow.loadFile(getRendererIndexHtml())
    mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(() => {
    createMainWindow()
    createAppMenu()
    registerShortcuts()
    createTrayIfAvailable()
    registerIpcHandlers()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})

app.on('will-quit', () => {
    unregisterAllShortcuts()
})
