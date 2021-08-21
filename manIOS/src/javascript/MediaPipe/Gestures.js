import Discriminator from './Discriminator';

export default class Gestures {
    constructor(_option) {
        this.time = _option.time;
        this.smoothLandmarks = _option.smoothLandmarks;

        this.setUp();
        // this.setTest();
    }

    setUp() {
        this.config = {};
        this.config.enable = true;
        this.config.duration = 10;

        this.leftHandRaised = new Discriminator();
        this.rightHandRaised = new Discriminator();
        this.leftHandSwipe = new Discriminator();
        this.rightHandSwipe = new Discriminator();

        this.setUpdate();
    }

    setUpdate() {
        this.time.on('tick', async () => {
            if (!this.config.enable) return;

            this.setPoint();
            this.setDetect();
            this.setEvent();

            this.config.enable = false;
            await new Promise((resolve) => setTimeout(resolve, this.config.duration));
            this.config.enable = true;
        });
    }

    setPoint() {
        this.handLeft = { x: 0, y: 0 };
        this.handLeft.x += this.smoothLandmarks[16].x;
        this.handLeft.y += this.smoothLandmarks[16].y;

        this.handRight = { x: 0, y: 0 };
        this.handRight.x += this.smoothLandmarks[15].x;
        this.handRight.y += this.smoothLandmarks[15].y;

        this.mouth = { y: 0 };
        this.mouth.y += this.smoothLandmarks[9].y;
        this.mouth.y += this.smoothLandmarks[10].y;
        this.mouth.y /= 2;

        this.spine = { x: 0 };
        this.spine.x += this.smoothLandmarks[11].x;
        this.spine.x += this.smoothLandmarks[12].x;
        this.spine.x += this.smoothLandmarks[23].x;
        this.spine.x += this.smoothLandmarks[24].x;
        this.spine.x /= 4;
    }

    setDetect() {
        this.leftHandRaised.evaluate(this.handLeft.y < this.mouth.y);
        this.rightHandRaised.evaluate(this.handRight.y < this.mouth.y);
        this.leftHandSwipe.evaluate(this.handLeft.x > this.spine.x);
        this.rightHandSwipe.evaluate(this.handRight.x < this.spine.x);
    }

    setEvent() {
        if (this.leftHandRaised.trigger) this.time.trigger('leftHandRaised');
        if (this.rightHandRaised.trigger) this.time.trigger('rightHandRaised');
        if (this.leftHandSwipe.trigger) this.time.trigger('leftHandSwipe');
        if (this.rightHandSwipe.trigger) this.time.trigger('rightHandSwipe');
    }

    setTest() {
        this.time.on('leftHandRaised', () => console.log('leftHandRaised'));
        this.time.on('rightHandRaised', () => console.log('rightHandRaised'));
        this.time.on('leftHandSwipe', () => console.log('leftHandSwipe'));
        this.time.on('rightHandSwipe', () => console.log('rightHandSwipe'));
    }
}
