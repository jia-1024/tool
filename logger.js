const fs = require('fs');
const path = require('path');
const log = require('electron-log');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const logPath = path.join(logDir, 'log.log');

function writeLog(msg) {
    const line = `[${new Date().toLocaleString()}] ${msg}\n`;
    fs.appendFileSync(logPath, line, 'utf8');
    // 同时写到 electron-log 日志系统
    log.info(msg);
}

module.exports = {writeLog};

// TODO 将日志生成到用户家目录下