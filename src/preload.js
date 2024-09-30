const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleLearningMode: (isLearningMode) => {
    console.log('Sending toggle-learning-mode:', isLearningMode);
    ipcRenderer.send('toggle-learning-mode', isLearningMode);
  },
});

contextBridge.exposeInMainWorld('electron', {
  moveOverlay: (x, y) => ipcRenderer.send('overlay-move', { x, y }),
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'move') {
    window.electron.moveOverlay(event.data.x, event.data.y);
  }
});

console.log('Preload script loaded');
