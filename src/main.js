const { app, BrowserWindow, ipcMain } = require('electron'); // Import ipcMain
const path = require('path');
const fs = require('fs'); // Added fs for reading CSS file

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

  win.loadFile('public/index.html');

  // Inject the back button script and CSS
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'backButton.css'), 'utf8'));
    win.webContents.executeJavaScript(`
      const script = document.createElement('script');
      script.src = '${path.join(__dirname, 'backButton.js').replace(/\\/g, '/')}';
      document.body.appendChild(script);
    `);
  });

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