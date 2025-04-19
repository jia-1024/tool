const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

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
    ipcMain.on('event_1', (event, arg) => {
        console.log('event_1 happen', arg);
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
