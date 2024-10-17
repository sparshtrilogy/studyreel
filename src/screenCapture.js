const { desktopCapturer, ipcRenderer } = require('electron');
const { systemPreferences, dialog } = window.electron.remote;

let mediaRecorder;
let recordedChunks = [];

function checkScreenCapturePermission() {
  if (process.platform !== 'darwin') {
    return true; // On non-macOS platforms, assume permission is granted
  }

  const status = systemPreferences.getMediaAccessStatus('screen');
  return status === 'granted';
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

async function ensureScreenCapturePermission() {
  if (!checkScreenCapturePermission()) {
    const granted = await requestScreenCapturePermission();
    if (!granted) {
      throw new Error('Screen capture permission denied');
    }
  }
}

async function takeScreenshot() {
  await ensureScreenCapturePermission();
  
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  const screenSource = sources[0];

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: screenSource.id,
      },
    },
  });

  const video = document.createElement('video');
  video.srcObject = stream;
  video.onloadedmetadata = async () => {
    video.play();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');

    ipcRenderer.send('save-screenshot', imageData);

    stream.getTracks()[0].stop();
  };
}

async function startRecording() {
  await ensureScreenCapturePermission();
  
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  const screenSource = sources[0];

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: screenSource.id,
      },
    },
  });

  mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
  mediaRecorder.start();
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

async function handleStop() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const buffer = await blob.arrayBuffer();
  ipcRenderer.send('save-recording', Buffer.from(buffer));
  recordedChunks = [];
}

module.exports = {
  takeScreenshot,
  startRecording,
  stopRecording,
  checkScreenCapturePermission,
  requestScreenCapturePermission
};
