// Determine when to trigger the event

export default class Discriminator {
    constructor() {
        this.step = 0.3;
        this.valuation = 0;
        this.upperThreshold = 0.7;
        this.lowerThreshold = 0.4;
        this.trigger = false;
        this.enable = true;
    }

    evaluate(statement) {
        if (statement) this.valuation += this.step;
        if (!statement) this.valuation -= this.step;
        this.valuation = Discriminator.clamp(this.valuation, 0, 1);

        if (this.trigger) this.trigger = false;
        if (this.valuation < this.lowerThreshold) this.enable = true;
        if (this.valuation > this.upperThreshold && this.enable) {
            this.trigger = true;
            this.enable = false;
        }
    }

    static clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
}
