const listEl = document.getElementById('list')
const input = document.getElementById('i')
const form = document.getElementById('f')
const openFileButton = document.getElementById('openFile')
const writeTextButton = document.getElementById('writeText')
const writeTextContent = document.getElementById('writeTextContent')
const saveFileButton = document.getElementById('saveFile')

openFileButton.onclick = async () => {
    const filePath = await window.todo.openFile()
    console.log('filePath', filePath)
}

writeTextButton.onclick = async () => {
    const filePath = await window.todo.writeText(writeTextContent.value)
    console.log('filePath', filePath)
}

saveFileButton.onclick = async () => {
    const filePath = await window.todo.saveFile()
    console.log('filePath', filePath)
}

async function render() {
    console.log('window.todo', window.todo)
    const todos = await window.todo.list()
    listEl.innerHTML = ''
    for (const t of todos) {
        const li = document.createElement('li')
        li.textContent = t.text
        if (t.done) li.classList.add('done')
        li.onclick = async () => { await window.todo.toggle(t.id); render() }
        li.oncontextmenu = async (e) => { e.preventDefault(); await window.todo.remove(t.id); render() }
        listEl.appendChild(li)
    }
}

form.onsubmit = async (e) => {
    console.log('submit', e)
    e.preventDefault()
    const v = input.value.trim()
    if (!v) return
    await window.todo.add(v)
    input.value = ''
    render()
}

render()