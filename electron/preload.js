const {contextBridge, ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

document.addEventListener('DOMContentLoaded', () => {
    console.log('预加载内容事件触发');
});

window.addEventListener('DOMContentLoaded', () => {
    console.log('预加载内容事件触发');
});

// 指定配置文件目录与路径
const configDir = path.join(os.homedir(), '.myTool');
const configFilePath = path.join(configDir, 'toolConfig.json');

// 暴露 配置文件读写api
contextBridge.exposeInMainWorld('configFileApi', {
    readConfig: () => {
        if (fs.existsSync(configFilePath)) {
            return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
        }
        return null;
    },
    writeConfig: (newConfig) => {
        fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2), 'utf-8');
    },
});


// 暴露 测试渲染进程与主进程通信是否正常api
contextBridge.exposeInMainWorld('testApi', {
    ping: () => console.log('pong from preload.js'),
});

// 暴露 日志api
contextBridge.exposeInMainWorld('logApi', {
    log: (msg) => ipcRenderer.send('logApi', msg)
});