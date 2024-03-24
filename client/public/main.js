
const { BrowserWindow, app, ipcMain, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { Worker } = require('worker_threads');


const BASE_URL = 'http://127.0.0.1:3000';

let mainWindow = null;

const http = require('http');

function fetchImage() {
    return new Promise((resolve, reject) => {
        http.get('http://127.0.0.1/screen', (response) => {
            const chunks = [];
            response.on('data', (chunk) => {
                chunks.push(chunk);
            });

            response.on('end', () => {
                const result = Buffer.concat(chunks);
                const arrayBuffer = Uint8Array.from(result).buffer;
                resolve(arrayBuffer);
            });
        }).on('error', (error) => {
            console.error('Error fetching image:', error);
            reject(error);
        });
    });
}

const createWindow = () => {
    const { height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        resizable: true,
        width: 800,
        height: height,
        webPreferences: {
            devTools: isDev,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
        }
    });

    if (isDev) {
        mainWindow.loadURL(BASE_URL);
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        mainWindow.loadFile(path.join(__dirname, './build/index.html'));
    }

    const worker = new Worker(`
    const { parentPort } = require('worker_threads');
    setInterval(() => {
        parentPort.postMessage('refresh');
    }, 10000);
  `, { eval: true });

    worker.on('message', (msg) => {
        if (msg === 'refresh') {
            mainWindow.webContents.send('refresh');
        }
    });

    ipcMain.on("screen", event => {
        fetchImage().then(data => {
            event.reply("screen", {
                screen: data
            });
        }).catch(err => {
            event.reply("screen", {
                screen: ""
            });
        })
    });
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});