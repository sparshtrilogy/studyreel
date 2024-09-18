import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../app/config/firebase';

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js')
    },
  });

  win.loadFile(path.join(__dirname, '../public/login.html'));
  
  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('authenticate', async (event, { email, password }) => {
    console.log('Authenticate request received in main process');
    try {
      console.log('Attempting to sign in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful');
      return { user: userCredential.user, isNewUser: false };
    } catch (error) {
      console.log('Sign in failed, error:', error);
      if (error.code === 'auth/user-not-found') {
        console.log('User not found, attempting to create new account...');
        try {
          const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log('New account created successfully');
          await sendEmailVerification(newUserCredential.user);
          console.log('Verification email sent');
          return { user: newUserCredential.user, isNewUser: true };
        } catch (createError) {
          console.error('Error creating new account:', createError);
          throw createError;
        }
      } else {
        console.error('Authentication error:', error);
        throw error;
      }
    }
  });
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
// ... rest of the Electron app setup