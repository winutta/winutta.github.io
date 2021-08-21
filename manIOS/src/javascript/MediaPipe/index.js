import { Camera } from '@mediapipe/camera_utils';
import { Pose } from '@mediapipe/pose';
import Gestures from './Gestures';

export default class MediaPipe {
    constructor(_option) {
        this.$video = _option.$video;
        this.time = _option.time;

        this.smoothness = 0.8;
        this.firstCall = true;
        this.isBegin = false;

        this.setPose();
        this.setCamera();
    }

    setPose() {
        // const version = '0.4.1627343400';
        const version = "0.4.1629494275";
        this.pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${version}/${file}` });

        this.pose.setOptions({
            selfieMode: true,
            modelComplexity: 0,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        this.pose.onResults((res) => this.onResults(res));
    }

    setCamera() {
        this.camera = new Camera(this.$video, {
            onFrame: async () => {
              await this.pose.send({ image: this.$video });
            },
            width: 1280,
            height: 720,
        });
        this.camera.start();
    }

    onResults(res) {
        this.currentLandmarks = res.poseLandmarks;
        if (!this.currentLandmarks) return;

        if (this.firstCall) {
            this.time.trigger('MediaPipeStart');
            this.isBegin = true;
            this.smoothLandmarks = this.currentLandmarks;
            this.setGestures();

            this.firstCall = false;
        }

        // calculate the smooth landmarks
        this.smoothLandmarks.forEach((smoothLandmark, i) => {
            this.smoothLandmarks[i].x = this.smoothness * this.smoothLandmarks[i].x + (1 - this.smoothness) * this.currentLandmarks[i].x;
            this.smoothLandmarks[i].y = this.smoothness * this.smoothLandmarks[i].y + (1 - this.smoothness) * this.currentLandmarks[i].y;
            this.smoothLandmarks[i].z = this.smoothness * this.smoothLandmarks[i].z + (1 - this.smoothness) * this.currentLandmarks[i].z;
        });
    }

    setGestures() {
        this.gesture = new Gestures({
            time: this.time,
            smoothLandmarks: this.smoothLandmarks,
        });
    }
}
