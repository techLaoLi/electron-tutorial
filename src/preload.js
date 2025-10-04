const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('todo', {
    list: () => ipcRenderer.invoke('todo:list'),
    add: (text) => ipcRenderer.invoke('todo:add', text),
    toggle: (id) => ipcRenderer.invoke('todo:toggle', id),
    remove: (id) => ipcRenderer.invoke('todo:remove', id),
    openFile: () => ipcRenderer.invoke('dialog:open-file'),
    writeText: (filePath, content) => ipcRenderer.invoke('fs:write-text', filePath, content),
    saveFile: () => ipcRenderer.invoke('dialog:save-file')
})
