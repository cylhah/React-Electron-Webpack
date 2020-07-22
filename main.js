const { app, BrowserWindow } = require('electron')
const url = require('url')
const Path = require('path')

let mainWin;
const isDev = process.env.CHANNEL == 'DEBUG'

function createWindow(path, options) {
    if (isDev) {
        options.webPreferences = { webSecurity: false, nodeIntegration: true }
    } else {
        options.webPreferences = { nodeIntegration: true }
    }
    options.icon = Path.join(__dirname, './icon.ico')
    // Create the browser window.
    let win = new BrowserWindow(options)

    // and load the index.html of the app.
    if (isDev) {   // 开发模式，使用dev-server，支持动态刷新
        win.loadURL(`http://localhost:3004/${path}`)
    } else {
        const pathname = Path.join(__dirname, './index.html')
        win.loadURL(url.format({
            pathname,
            protocol: 'file:',
            slashes: true
        }))
    }

    isDev && win.webContents.openDevTools()
    return win
}

function initMain() {
    mainWin = createWindow('index.html', { width: 1920, height: 1050, minWidth: 1280, minHeight: 800 })
}
app.on('ready', () => initMain())
