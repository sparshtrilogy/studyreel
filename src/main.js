const { app, BrowserWindow, ipcMain } = require('electron'); // Import ipcMain
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  const loginPath = path.join(__dirname, '..', 'public', 'login.html');
  console.log('Login path:', loginPath);
  win.loadFile(loginPath);

  // Open the DevTools.
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// IPC handler for authentication (if needed for additional functionality)
ipcMain.handle('authenticate', async (event, { email, password }) => {
  console.log(`Authentication request received for: ${email}`);
  // Implement any additional authentication logic here if needed
  // For now, we'll just return a success message as Firebase handles the actual auth
  return { success: true, message: 'Authentication request received' };
});

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