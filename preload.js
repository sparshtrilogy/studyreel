const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  toggleLearningMode: (isLearningMode) => ipcRenderer.send('toggle-learning-mode', isLearningMode),
  checkMicrophonePermission: () => ipcRenderer.invoke('check-microphone-permission'),
  requestMicrophonePermission: () => ipcRenderer.invoke('request-microphone-permission'),
  // Add this line to handle the start-web-audio-recording event
  onStartWebAudioRecording: (callback) => ipcRenderer.on('start-web-audio-recording', callback),
  onStopWebAudioRecording: (callback) => ipcRenderer.on('stop-web-audio-recording', callback),
});

contextBridge.exposeInMainWorld('electron', {
  moveOverlay: (x, y) => ipcRenderer.send('overlay-move', { x, y }),
});

// Expose microphone utility functions
contextBridge.exposeInMainWorld('microphoneAPI', {
  checkPermission: () => ipcRenderer.invoke('check-microphone-permission'),
  requestPermission: () => ipcRenderer.invoke('request-microphone-permission'),
  startRecording: () => ipcRenderer.invoke('start-recording'),
  stopRecording: () => ipcRenderer.invoke('stop-recording'),
});

window.addEventListener('message', (event) => {
  if (event.data.type === 'move') {
    window.electron.moveOverlay(event.data.x, event.data.y);
  }
});

console.log('Preload script loaded');
