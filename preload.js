const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload: Script starting...');

// Single electronAPI exposure with all functionality
contextBridge.exposeInMainWorld('electronAPI', {
    // IPC communication
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    on: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),

    // Learning mode
    toggleLearningMode: (isLearningMode) => ipcRenderer.send('toggle-learning-mode', isLearningMode),
    moveOverlay: (x, y) => ipcRenderer.send('overlay-move', { x, y }),

    // Screen recording
    checkScreenPermission: () => ipcRenderer.invoke('check-screen-permission'),
    requestScreenPermission: () => ipcRenderer.invoke('request-screen-permission'),
    startScreenRecording: () => ipcRenderer.invoke('start-screen-recording'),
    stopScreenRecording: () => ipcRenderer.invoke('stop-screen-recording'),
    handleStream: (sourceId) => ipcRenderer.invoke('handle-stream', sourceId),
    getScreenSources: () => ipcRenderer.invoke('get-screen-sources'),
    saveRecording: (buffer, type) => ipcRenderer.send('save-recording', buffer, type),

    // Microphone
    checkMicrophonePermission: () => ipcRenderer.invoke('check-microphone-permission'),
    requestMicrophonePermission: () => ipcRenderer.invoke('request-microphone-permission'),
    startMicrophoneRecording: () => ipcRenderer.invoke('start-recording'),
    stopMicrophoneRecording: () => ipcRenderer.invoke('stop-recording'),
    onStartWebAudioRecording: (callback) => ipcRenderer.on('start-web-audio-recording', callback),
    onStopWebAudioRecording: (callback) => ipcRenderer.on('stop-web-audio-recording', callback),
    requestWebcamAccess: () => ipcRenderer.invoke('request-webcam-access'),
    requestMicrophoneAccess: () => ipcRenderer.invoke('request-microphone-access'),
});

// Event listener for overlay movement
window.addEventListener('message', (event) => {
    if (event.data.type === 'move') {
        window.electronAPI.moveOverlay(event.data.x, event.data.y);
    }
});

console.log('Preload script loaded');

