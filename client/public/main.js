const { BrowserWindow, app } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const BASE_URL = 'http://127.0.0.1:3000';

let mainWindow = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    mainWindow.loadURL(BASE_URL);
    mainWindow.webContents.openDevTools({mode: 'detach'});
  } else {
    mainWindow.loadFile(path.join(__dirname, './build/index.html'));
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});