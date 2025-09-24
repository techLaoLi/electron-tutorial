import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('todo', {
    list: () => ipcRenderer.invoke('todo:list'),
    add: (text) => ipcRenderer.invoke('todo:add', text),
    toggle: (id) => ipcRenderer.invoke('todo:toggle', id),
    remove: (id) => ipcRenderer.invoke('todo:remove', id)
})
