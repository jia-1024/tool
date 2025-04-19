# 一、快速初始化一个基于 electron 桌面GUI框架的工程

在家目录下添加一个`.npmrc`文件，用于加速安装`electron`，内容如下

```
registry=https://registry.npmmirror.com
electron_mirror=https://npmmirror.com/mirrors/electron/
```

全局安装electron框架 `npm install -g electron `

## 新建一个工程根目录

假如根目录是 `tool`

## 初始化项目

进入工程根目录执行`npm init -y`，生成 `package.json` 工程描述文件

## 工程中安装 electron 依赖

```bash
npm install electron --save-dev
```

## 添加一个 start 脚本来启动 Electron

```json
{
  "name": "tool",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "electron": "^35.2.0"
  }
}
```

# 二、 文件目录

tool/ ├── main.js // 主进程（控制窗口） ├── index.html // 页面内容（渲染进程） ├── preload.js // 可选（预加载脚本，Node 和页面桥接） ├── package.json //
项目信息

- main.js

```js
const {app, BrowserWindow} = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
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


```

- index.html

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Hello Electron</title>
</head>
<body>
<h1>Hello from Electron!</h1>
<button onclick="alert('你点击了按钮')">点我</button>
</body>
</html>

```

- preload.js

```js
// 可以在这里安全地暴露 Node.js API 到页面中
window.addEventListener('DOMContentLoaded', () => {
    console.log('页面已加载');
});

```

- package.json

```json
{
  "name": "tool",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.AiLun.tool",
    "productName": "工具",
    "files": [
      "**/*"
    ],
    "directories": {
      "output": "dist"
    },
    "win": {
      "target": "nsis"
    }
  },
  "devDependencies": {
    "electron": "^35.2.0",
    "electron-builder": "^26.0.12"
  }
}
```

# 三、如何将程序打包成 exe 可执行文件

## 安装打包工具

`npm install electron-builder --save-dev`

## 修改工程描述文件 package.json

```json
{
  "name": "tool",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.AiLun.tool",
    "productName": "工具",
    // 打出来的 exe 文件名
    "files": [
      "**/*"
    ],
    "directories": {
      "output": "dist"
      // 打包输出文件夹
    },
    "win": {
      "target": "nsis"
      // Windows 下使用 NSIS 安装器打包
    }
  },
  "devDependencies": {
    "electron": "^35.2.0",
    "electron-builder": "^26.0.12"
  }
}

```

如果不需要生成安装器（直接生成 .exe 文件） ,在 package.json 的 build.win 中添加如下：

```json
"win": {
"target": [
"portable"
]
}
```

### png转icon 工具
- https://convertico.com/
- https://www.icoconverter.com/