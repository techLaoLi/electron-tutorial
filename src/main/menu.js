import { Menu, BrowserWindow, dialog, shell } from 'electron'
import { loadTodos, saveTodos, getDataPaths } from './store.js'
import { promises as fs } from 'node:fs'

export function createAppMenu() {
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '导入待办…',
                    click: async () => {
                        const { canceled, filePaths } = await dialog.showOpenDialog({
                            properties: ['openFile'],
                            filters: [{ name: 'JSON', extensions: ['json'] }]
                        })
                        if (canceled || filePaths.length === 0) return
                        try {
                            const raw = await fs.readFile(filePaths[0], 'utf8')
                            const data = JSON.parse(raw)
                            if (!Array.isArray(data)) throw new Error('Bad format')
                            await saveTodos(data)
                            BrowserWindow.getAllWindows()[0]?.reload()
                        } catch (e) {
                            dialog.showErrorBox('导入失败', String(e?.message || e))
                        }
                    }
                },
                {
                    label: '导出待办…',
                    click: async () => {
                        try {
                            const todos = await loadTodos()
                            const { canceled, filePath } = await dialog.showSaveDialog({
                                filters: [{ name: 'JSON', extensions: ['json'] }],
                                defaultPath: 'todos.json'
                            })
                            if (canceled || !filePath) return
                            await fs.writeFile(filePath, JSON.stringify(todos, null, 2), 'utf8')
                        } catch (e) {
                            dialog.showErrorBox('导出失败', String(e?.message || e))
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: '打开数据目录',
                    click: async () => {
                        const { dataDir } = getDataPaths()
                        await shell.openPath(dataDir)
                    }
                },
                { type: 'separator' },
                { role: 'quit', label: '退出' }
            ]
        },
        {
            label: '编辑',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        {
            label: '视图',
            submenu: [
                { role: 'reload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: '窗口',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}
