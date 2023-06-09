
// 渲染器
const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

const func = async () => {
  const response = await window.versions.ping()
  const msgmation = document.getElementById('message')
  msgmation.innerText = response
  console.log(response) // 打印 'pong'
}

func()
// 监听按钮点击事件，调用preload脚本的方法（改变主题颜色）和改变提示文字
document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
  const isDarkMode = await window.darkMode.toggle()
  document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})

document.getElementById('reset-to-system').addEventListener('click', async () => {
  await window.darkMode.system()
  document.getElementById('theme-source').innerHTML = 'System'
})

// const setButton = document.getElementById('btn')
// const titleInput = document.getElementById('title')
// setButton.addEventListener('click', () => {
//   const title = titleInput.value
//   window.electronAPI.setTitle(title)
// })


const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')
btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})


const counter = document.getElementById('counter')
window.electronAPI.handleCounter((event, value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue
  // event.sender.send('counter-value', newValue)
})


