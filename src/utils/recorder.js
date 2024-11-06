const { desktopCapturer } = require('electron');

class ScreenRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.stream = null;
        this.startTime = null;
    }

    async startRecording(sourceId) {
        try {
            const constraints = {
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                },
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId,
                        minWidth: 1280,
                        maxWidth: 1920,
                        minHeight: 720,
                        maxHeight: 1080
                    }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: 'video/webm; codecs=vp9'
            });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.start(1000);
            this.isRecording = true;
            this.startTime = Date.now();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            return new Promise((resolve, reject) => {
                this.mediaRecorder.onstop = async () => {
                    try {
                        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                        const buffer = await blob.arrayBuffer();
                        window.electronAPI.saveRecording(Buffer.from(buffer));
                        this.recordedChunks = [];
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };
                
                this.mediaRecorder.stop();
                this.stream.getTracks().forEach(track => track.stop());
                this.isRecording = false;
            });
        }
    }
}

module.exports = ScreenRecorder;