// main.js
// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, ipcMain, nativeTheme, dialog, Menu } = require('electron')
const path = require('path')
// 项目更新
// require('update-electron-app')()

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  console.log(canceled, filePaths)
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './images/icon@1x.ico',
    // 导入preload脚本（可以访问node）
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // 打开开发工具
  mainWindow.webContents.openDevTools()
  // 自定义菜单
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          // webContents.send -- 将 IPC 消息从主进程发送到目标渲染器 
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement',
        }
      ]
    }

  ])
  Menu.setApplicationMenu(menu)


  // 监听事件，单向ipc消息接收
  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })




  // 加载 index.html
  mainWindow.loadFile('index.html')
  // mainWindow.loadURL('https://www.electronforge.io/guides/create-and-add-icons')

}
//ipcMain.handle(双向) -- 接受invoke的异步请求。处理资源
ipcMain.handle('ping', () => 'pong')
ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})
ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {



  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。