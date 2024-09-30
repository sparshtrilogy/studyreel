const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleLearningMode: (isLearningMode) => {
    console.log('Sending toggle-learning-mode:', isLearningMode);
    ipcRenderer.send('toggle-learning-mode', isLearningMode);
  },
});

console.log('Preload script loaded');
