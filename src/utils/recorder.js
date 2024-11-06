const { desktopCapturer } = require('electron');

class ScreenRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.webcamRecorder = null;
        this.recordedChunks = [];
        this.webcamChunks = [];
        this.isRecording = false;
        this.stream = null;
        this.webcamStream = null;
        this.startTime = null;
    }

    async startRecording(sourceId) {
        try {
            this.recordedChunks = [];
            this.webcamChunks = [];

            console.log('Requesting webcam access...');
            const webcamAccess = await window.electronAPI.requestWebcamAccess();
            if (!webcamAccess) {
                console.error('Webcam access denied');
            } else {
                try {
                    this.webcamStream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        },
                        audio: false
                    });
                    
                    this.webcamRecorder = new MediaRecorder(this.webcamStream, {
                        mimeType: 'video/webm; codecs=vp9'
                    });

                    this.webcamRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            this.webcamChunks.push(event.data);
                        }
                    };
                } catch (webcamError) {
                    console.error('Failed to initialize webcam:', webcamError);
                }
            }

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
            
            if (this.webcamRecorder) {
                console.log('Starting webcam recording...');
                this.webcamRecorder.start(1000);
            }

            this.isRecording = true;
            this.startTime = Date.now();
            return true;
        } catch (error) {
            if (this.webcamStream) {
                this.webcamStream.getTracks().forEach(track => track.stop());
            }
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
            throw error;
        }
    }

    async stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            return new Promise((resolve, reject) => {
                let savedCount = 0;
                const totalToSave = this.webcamRecorder ? 2 : 1;

                const checkComplete = () => {
                    savedCount++;
                    if (savedCount === totalToSave) {
                        resolve();
                    }
                };

                this.mediaRecorder.onstop = async () => {
                    try {
                        const screenBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
                        const screenBuffer = await screenBlob.arrayBuffer();
                        await window.electronAPI.saveRecording(Buffer.from(screenBuffer), 'screen');
                        this.recordedChunks = [];
                        checkComplete();
                    } catch (error) {
                        reject(error);
                    }
                };

                if (this.webcamRecorder) {
                    this.webcamRecorder.onstop = async () => {
                        try {
                            const webcamBlob = new Blob(this.webcamChunks, { type: 'video/webm' });
                            const webcamBuffer = await webcamBlob.arrayBuffer();
                            await window.electronAPI.saveRecording(Buffer.from(webcamBuffer), 'webcam');
                            this.webcamChunks = [];
                            checkComplete();
                        } catch (error) {
                            reject(error);
                        }
                    };
                    this.webcamRecorder.stop();
                    this.webcamStream.getTracks().forEach(track => track.stop());
                }

                this.mediaRecorder.stop();
                this.stream.getTracks().forEach(track => track.stop());
                
                this.isRecording = false;
            });
        }
    }
}

module.exports = ScreenRecorder;