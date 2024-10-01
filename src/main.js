const { app, BrowserWindow, ipcMain, screen } = require('electron'); // Import ipcMain
const path = require('path');
const fs = require('fs'); // Added fs for reading CSS file
app.name = 'StudyReel';

let mainWindow;
let overlayWindow;
let overlayOffset = { x: 20, y: 20 };

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
  mainWindow.on('maximize', () => {
    calculateOverlayOffset();
    updateOverlayPosition();
  });
  mainWindow.on('unmaximize', () => {
    calculateOverlayOffset();
    updateOverlayPosition();
  });
  mainWindow.on('restore', () => {
    calculateOverlayOffset();
    updateOverlayPosition();
  });

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
    parent: mainWindow,
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

  // Ensure the overlay appears in full-screen spaces
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

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
      let isDragging = false;
      let startPosition = { x: 0, y: 0 };

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
          window.postMessage({ type: 'move', deltaX, deltaY });
          startPosition = { x: e.screenX, y: e.screenY };
        }
      });
    `);
  });
}

ipcMain.on('overlay-move', (event, { deltaX, deltaY }) => {
  if (overlayWindow) {
    const [currentX, currentY] = overlayWindow.getPosition();
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;
    
    overlayWindow.setPosition(newX, newY);
    calculateOverlayOffset();
  }
});

function destroyOverlayWindow() {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  }
}

function updateOverlayPosition() {
  if (overlayWindow && mainWindow) {
    const mainBounds = mainWindow.getBounds();
    const overlayBounds = overlayWindow.getBounds();
    const displayBounds = screen.getDisplayMatching(mainBounds).workArea;
    
    let newX, newY;

    // Position in the bottom left corner
    newX = mainBounds.x + overlayOffset.x;
    newY = mainBounds.y + mainBounds.height - overlayBounds.height - overlayOffset.y;

    // Ensure the overlay stays within the screen bounds
    newX = Math.max(displayBounds.x, Math.min(newX, displayBounds.x + displayBounds.width - overlayBounds.width));
    newY = Math.max(displayBounds.y, Math.min(newY, displayBounds.y + displayBounds.height - overlayBounds.height));
    
    overlayWindow.setBounds({
      x: newX,
      y: newY,
      width: overlayBounds.width,
      height: overlayBounds.height
    });
  }
}

function calculateOverlayOffset() {
  if (overlayWindow && mainWindow) {
    const mainBounds = mainWindow.getBounds();
    const overlayBounds = overlayWindow.getBounds();
    const displayBounds = screen.getDisplayMatching(mainBounds).workArea;

    if (mainWindow.isMaximized()) {
      overlayOffset.x = overlayBounds.x - displayBounds.x;
      overlayOffset.y = displayBounds.y + displayBounds.height - overlayBounds.y - overlayBounds.height;
    } else {
      overlayOffset.x = overlayBounds.x - mainBounds.x;
      overlayOffset.y = mainBounds.y + mainBounds.height - overlayBounds.y - overlayBounds.height;
    }
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