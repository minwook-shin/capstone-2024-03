
const { BrowserWindow, app, ipcMain, screen } = require('electron');
const path = require('path');
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

async function show_manager() {
    try {
        if (manager_window && !manager_window.isDestroyed()) {
            manager_window.show();
            manager_window.focus();
        }
    } catch (error) {
        console.error('Error showing manager window:', error);
    }
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        resizable: true,
        width: 1200,
        height: 900,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, 'favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
        }
    });

    manager_window = new BrowserWindow({
        show: false,
        parent: mainWindow,
        resizable: true,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadURL(BASE_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });

    manager_window.loadURL('http://127.0.0.1' + '/manager');

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
    ipcMain.on("show_manager", show_manager);

    manager_window.on('close', (event) => {
        event.preventDefault();
        manager_window.hide();
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