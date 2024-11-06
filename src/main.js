const { app, BrowserWindow, ipcMain, screen, systemPreferences, desktopCapturer, dialog } = require('electron'); // Import ipcMain
const path = require('path');
const fs = require('fs'); // Added fs for reading CSS file
const { enable } = require('@electron/remote/main');
require('@electron/remote/main').initialize();
const ScreenRecorder = require('./utils/recorder');
let recorder = null;

app.name = 'StudyReel';

let mainWindow;
let overlayWindow;
let aiTutorOverlayWindow;
let overlayOffset = { x: 20, y: 20 };
let aiTutorOverlayOffset = { x: 20, y: 20 }; // Add this line

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const preloadPath = path.join(__dirname, '..', 'preload.js');
console.log('Preload path:', preloadPath);

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

  mainWindow.webContents.session.clearCache().then(() => {
    mainWindow.loadFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

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

  enable(mainWindow.webContents);

  // Initialize the recorder with mainWindow
  recorder = new ScreenRecorder(mainWindow);
}

// Move these listeners outside of createWindow
ipcMain.on('learning-mode-started', () => {
  createOverlayWindow();
  createAiTutorOverlayWindow();
});

ipcMain.on('learning-mode-exited', () => {
  destroyOverlayWindow();
  destroyAiTutorOverlayWindow();
});

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

function createAiTutorOverlayWindow() {
  if (aiTutorOverlayWindow) return;

  try {
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    aiTutorOverlayWindow = new BrowserWindow({
      width: 400,
      height: 600,
      x: screenWidth - 420, // 20 pixels from the right edge
      y: 20, // 20 pixels from the top edge
      parent: mainWindow,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      focusable: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      hasShadow: false,
      backgroundColor: '#00000000'
    });

    aiTutorOverlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    aiTutorOverlayWindow.loadFile(path.join(__dirname, '..', 'public', 'ai_tutor.html'))
      .catch(error => console.error('Error loading AI tutor HTML:', error));

    aiTutorOverlayWindow.setMenu(null);

    if (process.platform === 'darwin') {
      aiTutorOverlayWindow.setVibrancy('ultra-dark');
    }

    aiTutorOverlayWindow.webContents.on('did-finish-load', () => {
      aiTutorOverlayWindow.webContents.executeJavaScript(`
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
            window.postMessage({ type: 'move-ai-tutor', deltaX, deltaY });
            startPosition = { x: e.screenX, y: e.screenY };
          }
        });
      `);
    });
  } catch (error) {
    console.error('Error creating AI tutor overlay window:', error);
  }
}

ipcMain.on('ai-tutor-overlay-move', (event, { deltaX, deltaY }) => {
  if (aiTutorOverlayWindow) {
    const [currentX, currentY] = aiTutorOverlayWindow.getPosition();
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;
    
    aiTutorOverlayWindow.setPosition(newX, newY);
    calculateAiTutorOverlayOffset();
  }
});

function destroyAiTutorOverlayWindow() {
  if (aiTutorOverlayWindow) {
    aiTutorOverlayWindow.close();
    aiTutorOverlayWindow = null;
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

  if (aiTutorOverlayWindow && mainWindow) {
    const mainBounds = mainWindow.getBounds();
    const overlayBounds = aiTutorOverlayWindow.getBounds();
    const displayBounds = screen.getDisplayMatching(mainBounds).workArea;
    
    let newX, newY;

    // Position in the top right corner
    newX = mainBounds.x + mainBounds.width - overlayBounds.width - aiTutorOverlayOffset.x;
    newY = mainBounds.y + aiTutorOverlayOffset.y;

    // Ensure the overlay stays within the screen bounds
    newX = Math.max(displayBounds.x, Math.min(newX, displayBounds.x + displayBounds.width - overlayBounds.width));
    newY = Math.max(displayBounds.y, Math.min(newY, displayBounds.y + displayBounds.height - overlayBounds.height));
    
    aiTutorOverlayWindow.setBounds({
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

function calculateAiTutorOverlayOffset() {
  if (aiTutorOverlayWindow && mainWindow) {
    const mainBounds = mainWindow.getBounds();
    const overlayBounds = aiTutorOverlayWindow.getBounds();
    const displayBounds = screen.getDisplayMatching(mainBounds).workArea;

    if (mainWindow.isMaximized()) {
      aiTutorOverlayOffset.x = displayBounds.x + displayBounds.width - overlayBounds.x - overlayBounds.width;
      aiTutorOverlayOffset.y = overlayBounds.y - displayBounds.y;
    } else {
      aiTutorOverlayOffset.x = mainBounds.x + mainBounds.width - overlayBounds.x - overlayBounds.width;
      aiTutorOverlayOffset.y = overlayBounds.y - mainBounds.y;
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

// Add these handlers for microphone permissions and recording
ipcMain.handle('check-microphone-permission', async () => {
  // Check if the app has permission to access the microphone
  if (process.platform === 'darwin') {
    // macOS specific permission check
    return systemPreferences.getMediaAccessStatus('microphone');
  } else {
    // For Windows and Linux, you might need to implement custom checks
    // For now, we'll assume permission is granted
    return 'granted';
  }
});

ipcMain.handle('request-microphone-permission', async () => {
  // Request permission to access the microphone
  if (process.platform === 'darwin') {
    // macOS specific permission request
    return systemPreferences.askForMediaAccess('microphone');
  } else {
    // For Windows and Linux, you might need to implement custom requests
    // For now, we'll assume permission is granted
    return true;
  }
});

// Add these permission-related functions
async function checkScreenCapturePermission() {
  if (process.platform !== 'darwin') {
    return true;
  }
  return systemPreferences.getMediaAccessStatus('screen') === 'granted';
}

async function requestScreenCapturePermission() {
  if (process.platform !== 'darwin') {
    return true;
  }
  const result = await dialog.showMessageBox({
    type: 'info',
    title: 'Screen Capture Permission Required',
    message: 'StudyReel needs permission to capture your screen for the screen recording feature.',
    buttons: ['Open System Preferences', 'Cancel'],
    defaultId: 0,
    cancelId: 1
  });

  if (result.response === 0) {
    return systemPreferences.askForMediaAccess('screen');
  }
  return false;
}

// Update the existing screen recording handlers
ipcMain.handle('start-screen-recording', async () => {
    try {
        if (!recorder) {
            recorder = new ScreenRecorder(mainWindow);
        }
        if (!await checkScreenCapturePermission()) {
            const granted = await requestScreenCapturePermission();
            if (!granted) {
                throw new Error('Screen capture permission denied');
            }
        }
        
        const sources = await desktopCapturer.getSources({ 
            types: ['screen', 'window'],
            thumbnailSize: { width: 0, height: 0 }
        });
        
        if (sources.length > 0) {
            await recorder.startRecording(sources[0].id);
        }
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('stop-screen-recording', async () => {
  try {
    if (recorder) {
      await recorder.stopRecording();
    }
    return { success: true };
  } catch (error) {
    console.error('Error stopping recording:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('handle-stream', async (event, sourceId) => {
  try {
    // This will be handled in the renderer process
    return { success: true, sourceId };
  } catch (error) {
    console.error('Error handling stream:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-screen-sources', async () => {
    try {
        const sources = await desktopCapturer.getSources({ 
            types: ['screen', 'window'],
            thumbnailSize: { width: 0, height: 0 }
        });
        return sources;
    } catch (error) {
        throw error;
    }
});

ipcMain.on('save-recording', async (event, arrayBuffer) => {
    try {
        const { filePath } = await dialog.showSaveDialog({
            buttonLabel: 'Save Recording',
            defaultPath: `recording-${Date.now()}.webm`,
            filters: [{ name: 'WebM files', extensions: ['webm'] }]
        });

        if (filePath) {
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(filePath, buffer);
            event.sender.send('recording-status', `Recording saved to ${filePath}`);
        }
    } catch (error) {
        event.sender.send('recording-status', 'Failed to save recording');
    }
});
