const { app, BrowserWindow } = require('electron');
const path = require('path');

function isUserSignedIn() {
  return false;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const loginPath = path.join(__dirname, '..', 'public', 'login.html');
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');

  console.log('Login path:', loginPath);
  console.log('Index path:', indexPath);

  if (isUserSignedIn()) {
    console.log('Loading index.html');
    win.loadFile(indexPath);
  } else {
    console.log('Loading login.html');
    win.loadFile(loginPath);
  }

  // Open the DevTools.
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});