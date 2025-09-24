import { app } from 'electron'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export function getDataPaths() {
    const dataDir = path.join(app.getPath('userData'), 'data')
    const dataFile = path.join(dataDir, 'todos.json')
    return { dataDir, dataFile }
}

export async function loadTodos() {
    const { dataDir, dataFile } = getDataPaths()
    await fs.mkdir(dataDir, { recursive: true })
    try {
        const raw = await fs.readFile(dataFile, 'utf8')
        const json = JSON.parse(raw)
        return Array.isArray(json) ? json : []
    } catch {
        return []
    }
}

export async function saveTodos(todos) {
    const { dataFile } = getDataPaths()
    await fs.writeFile(dataFile, JSON.stringify(todos, null, 2), 'utf8')
}
