const path = require('path');
const os = require('os');

const {app, BrowserWindow, ipcMain} = require('electron');
const log = require('electron-log');
const axios = require('axios');

app.on('ready', () => {
    axios.get('https://www.baidu.com').then(resp => {
        console.log(resp)
    }).catch(e => {
        console.log("err happen")
        console.log(e)
    })
});

// 指定日志文件生成到系统家目录下
log.transports.file.resolvePathFn = () => {
    return path.join(os.homedir(), 'logs', 'tool.log');
};

console.log('log file path >>> ', log.transports.file.getFile().path);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'build', 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // 是否将 preload.js 与页面隔离（防止污染 window）
            contextIsolation: false,
            // 允许在渲染进程中直接使用 require、fs 等 Node.js 模块
            nodeIntegration: true
        },
        // 关闭顶部菜单栏
        autoHideMenuBar: true
    });

    win.loadFile('index.html');

    // 自动打开 DevTools,手动打开 Ctrl + Shift + I
    win.webContents.openDevTools();


    // 处理渲染线程的事件
    ipcMain.on('event_1', (event, msg) => {
        log.info(`渲染进程日志: ${msg}`)
    });

    ipcMain.on('log-msg', (event, msg) => {
        log.info(`渲染进程日志: ${msg}`);
    });
}

app.whenReady().then(() => {
    createWindow();
    log.info('主窗口创建完毕');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
