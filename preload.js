/**
 window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
 */




// contextBridge -- 用于实现交互
// ipcRenderer -- 帮手模块（传递信息的方法）
//ipcRenderer.invoke -- 一般用于向主进程申请资源，处理结果，然后返回结果的过程
// ipcRenderer.send -- 发送一个异步消息
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('versions', {
  // 获取版本号
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
})
contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
})
contextBridge.exposeInMainWorld('electronAPI', {
  setTitle: (title) => ipcRenderer.send('set-title', title),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  handleCounter: (callback) => ipcRenderer.on('update-counter', callback)
})
/**
 * 优点：尽可能限制渲染器对 Electron API 的访问
 * 缺点：灵活性有限--监听器无法直接与渲染器代码交互
 */
// window.addEventListener('DOMContentLoaded', () => {
//   const counter = document.getElementById('counter')
//   ipcRenderer.on('update-counter', (_event, value) => {
//     const oldValue = Number(counter.innerText)
//     const newValue = oldValue + value
//     counter.innerText = newValue
//   })
// })
