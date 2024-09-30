const { app, BrowserWindow, ipcMain, screen } = require('electron'); // Import ipcMain
const path = require('path');
const fs = require('fs'); // Added fs for reading CSS file

let mainWindow;
let overlayWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'public', 'index.html'));

  mainWindow.on('moved', updateOverlayPosition);
  mainWindow.on('resized', updateOverlayPosition);

  // Add this IPC listener here
  ipcMain.on('learning-mode-started', () => {
    createOverlayWindow();
  });

  ipcMain.on('learning-mode-exited', () => {
    destroyOverlayWindow();
  });
}

function createOverlayWindow() {
  if (overlayWindow) return;

  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 250,
    height: 250,
    x: 20, // 20 pixels from the left edge
    y: screenHeight - 220, // 20 pixels from the bottom edge
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true, // Change this to true
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    hasShadow: false,
    backgroundColor: '#00000000'
  });

  overlayWindow.loadFile(path.join(__dirname, '..', 'public', 'waste_meter.html'));
  
  // Remove this line or modify it to only ignore events on non-draggable areas
  // overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  overlayWindow.setMenu(null);

  // Ensure the window is truly frameless on macOS
  if (process.platform === 'darwin') {
    overlayWindow.setVibrancy('ultra-dark');
  }

  // Add these lines to handle dragging
  let isDragging = false;
  let startPosition = { x: 0, y: 0 };

  overlayWindow.webContents.on('did-finish-load', () => {
    overlayWindow.webContents.executeJavaScript(`
      const dragHandle = document.getElementById('drag-handle');
      dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPosition = { x: e.screenX, y: e.screenY };
      });
      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
              const deltaX = e.screenX - startPosition.x;
              const deltaY = e.screenY - startPosition.y;
              window.postMessage({ type: 'move', x: deltaX, y: deltaY });
              startPosition = { x: e.screenX, y: e.screenY }; // Update startPosition
          window.postMessage({ type: 'move', x: newX, y: newY });
        }
      });
    `);
  });
}

ipcMain.on('overlay-move', (event, { x, y }) => {
  if (overlayWindow) {
    const [currentX, currentY] = overlayWindow.getPosition();
    overlayWindow.setPosition(currentX + x, currentY + y);
  }
});

function destroyOverlayWindow() {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  }
}

function updateOverlayPosition() {
  if (overlayWindow) {
    const [, , width, height] = mainWindow.getBounds();
    const overlayBounds = overlayWindow.getBounds();
    overlayWindow.setBounds({
      x: 20,
      y: height - overlayBounds.height - 20,
      width: overlayBounds.width,
      height: overlayBounds.height
    });
  }
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