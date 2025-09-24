import { ipcMain, app } from 'electron'
import { loadTodos, saveTodos } from './store.js'

export function registerIpcHandlers() {
    ipcMain.handle('todo:list', async () => {
        await ensureAppReady()
        return loadTodos()
    })

    ipcMain.handle('todo:add', async (_e, text) => {
        await ensureAppReady()
        const trimmed = String(text || '').trim()
        if (!trimmed) return loadTodos()
        const todos = await loadTodos()
        const next = [...todos, { id: Date.now(), text: trimmed, done: false }]
        await saveTodos(next)
        return next
    })

    ipcMain.handle('todo:toggle', async (_e, id) => {
        await ensureAppReady()
        const todos = await loadTodos()
        const next = todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
        await saveTodos(next)
        return next
    })

    ipcMain.handle('todo:remove', async (_e, id) => {
        await ensureAppReady()
        const todos = await loadTodos()
        const next = todos.filter(t => t.id !== id)
        await saveTodos(next)
        return next
    })
}

async function ensureAppReady() {
    if (!app.isReady()) await app.whenReady()
}
