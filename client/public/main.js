const { BrowserWindow, app, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const axios = require('axios');

const BASE_URL = 'http://127.0.0.1:3000';

let mainWindow = null;

async function fetchPythonVersion() {
    const response = await axios.get('http://127.0.0.1/python-version')
    return response.data
}

async function fetchImage() {
    try {
        const response = await axios.get('http://127.0.0.1/screen', {
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'image/png'
            }
        });
        const imageBuffer = Buffer.from(response.data, 'binary');
        return imageBuffer;
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        resizable: true,
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

    ipcMain.on("versions", event => {
        event.reply("versions", {
            node: process.versions.node,
            chrome: process.versions.chrome,
            electron: process.versions.electron,
        });
    });

    ipcMain.on("py-version", event => {
        fetchPythonVersion().then(data => {
            event.reply("py-version", {
                py: data
            });
        }).catch(err => {
            event.reply("py-version", {
                py: "Python not found!"
            });
          } )
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
          } )
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