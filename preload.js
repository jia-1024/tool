const {contextBridge, ipcRenderer, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const log = require("electron-log");
const excel = require('xlsx')
const axios = require('axios');

// 指定配置文件目录与路径
const configDir = path.join(os.homedir(), '.jt');
const configFilePath = path.join(configDir, 'toolConfig.json');
const config = readConfig();
log.info(`读取配置文件>>> ${JSON.stringify(config)}`)

document.addEventListener('DOMContentLoaded', () => {
    log.info('预加载内容事件触发');
});

window.addEventListener('DOMContentLoaded', () => {
    log.info('预加载内容事件触发');
});

function readConfig() {
    if (fs.existsSync(configFilePath)) {
        return JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    }
    return null;
}

function writeConfig(newConfig) {
    fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2), 'utf-8');
}

// 暴露 配置文件读写api
contextBridge.exposeInMainWorld('configFileApi', {
    readConfig: () => {
        readConfig()
    },
    writeConfig: (newConfig) => {
        writeConfig(newConfig);
    },
});


// 暴露 测试渲染进程与主进程通信是否正常api
contextBridge.exposeInMainWorld('testApi', {
    ping: () => log.info('pong from preload.js'),
});

// 暴露 日志api
contextBridge.exposeInMainWorld('logApi', {
    log: (msg) => ipcRenderer.send('logApi', msg)
});

// 上传文件处理
contextBridge.exposeInMainWorld('fileHandle', {
    readFile: (data) => {
        log.info(`处理文件 ${data}`);
        // 读取xls文件在内存中的数据
        const workbook = excel.read(data, {type: 'array'});

        // 获取第一个工作表的名称
        const sheetName = workbook.SheetNames[0];
        // 获取第一个sheet
        const sheet = workbook.Sheets[sheetName];
        // 获取第一个sheet中的数据
        const jsonData = excel.utils.sheet_to_json(sheet, {header: 1});
        handleXlsFileData(jsonData)
    }
})

// 调光控制器迁移工具
function handleXlsFileData(jsonData) {
    // 获取标题
    // const title = jsonData[0][0];
    // 获取表头
    const headers = jsonData[0];
    const funcConfig = config["控制器迁移"];
    const tunnelFk = funcConfig["新数据库的tunnelId"];

    const up = funcConfig["老数据库中子区域方向为1的子区域id"];
    const down = funcConfig["老数据库中子区域方向为2的子区域id"];
    const url = funcConfig["后台服务"];

    const subareaMapDirection = {}
    subareaMapDirection[`${up}`] = 1;
    subareaMapDirection[`${down}`] = 2;

    for (let i = 0; i < jsonData.length; i++) {
        if (i >= 1) {
            let payload = {}
            payload['deviceLocation'] = jsonData[i][4].replace("k", "K")
            payload['detailLocation'] = parseInt(jsonData[i][61], 10)
            payload['tunnelFk'] = tunnelFk
            payload['direction'] = subareaMapDirection[parseInt(jsonData[i][21], 10).toString()]
            if (jsonData[i][3].includes("雷达")) {
                payload['isRadarController'] = 1;
            } else {
                payload['isRadarController'] = 0;
            }
            post(url + "/api/dimmingDevice/insert", payload, {headers: funcConfig["headers"]})
        }
    }
}


function post(url, data, headers) {
    axios.post(url, data, headers)
        .then(resp => {
            log.info(`Response: ${JSON.stringify(resp.data)}`)
        })
        .catch(e => {
            log.info("err happen")
            log.info(e)
        })
}

