const { app, BrowserWindow, ipcMain, screen } = require('electron'); // Import ipcMain
const path = require('path');
const fs = require('fs'); // Added fs for reading CSS file

let mainWindow;
let overlayWindows = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true  // Add this line
    }
  });

  // Load the educational website or local HTML file
  mainWindow.loadURL('https://www.khanacademy.org');

  // Inject the back button script and CSS
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'backButton.css'), 'utf8'));
    mainWindow.webContents.executeJavaScript(`
      const script = document.createElement('script');
      script.src = '${path.join(__dirname, 'backButton.js').replace(/\\/g, '/')}';
      document.body.appendChild(script);
    `);
  });

  // Open the DevTools (you may want to remove this in production)
  mainWindow.webContents.openDevTools();

  createOverlayWindows();
}

function createOverlayWindows() {
  const displays = screen.getAllDisplays();
  displays.forEach((display) => {
    const { x, y, width, height } = display.bounds;

    const overlay = new BrowserWindow({
      x,
      y,
      width,
      height,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      focusable: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    overlay.loadFile(path.join(__dirname, '..', 'public', 'overlay.html'));
    overlay.setAlwaysOnTop(true, 'screen-saver');
    overlay.setIgnoreMouseEvents(true, { forward: true });
  });
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