import Outline from './Outline';
import LoadingPage from './LoadingPage';
import Option from './Option';

export default class View {
    constructor(_option) {
        this.$root = _option.$root;
        this.time = _option.time;
        this.debug = _option.debug;
        this.resources = _option.resources;
        this.mediaPipe = _option.mediaPipe;

        if (this.debug) {
            this.setOptions();
            this.$root.style.display = 'none';
            return;
        }

        this.setOutline();
        this.setLoadingPage();
        this.setOptions();
    }

    setOutline() {
        this.outline = new Outline({ $root: this.$root });
        this.outline.setHidden();

        this.resources.on('ready', () => {
            if (!this.mediaPipe.isBegin) this.outline.setDisplay();
        });
        this.time.on('MediaPipeStart', () => this.outline.setHidden());
    }

    setLoadingPage() {
        this.loadingPage = new LoadingPage({ $root: this.$root });

        this.resources.on('progess', (percent) => this.loadingPage.setProgress(percent));
        this.resources.on('ready', () => this.loadingPage.setFinish());
    }

    setOptions() {
        this.option = new Option({
            debug: this.debug,
            $root: this.$root,
            time: this.time,
            resources: this.resources,
        });
        this.option.setHidden();
        this.resources.on('ready', () => this.option.setFinish());
    }
}
