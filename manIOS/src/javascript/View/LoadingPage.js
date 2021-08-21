export default class LoadingPage {
    constructor(_option) {
        this.$root = _option.$root;

        this.setTrademark();
    }

    setTrademark() {
        this.$loading = document.createElement('div');
        this.$loading.className = 'loading';
        this.$root.appendChild(this.$loading);

        this.$loader = document.createElement('div');
        this.$loader.setAttribute('class', 'icon');
        this.$loading.appendChild(this.$loader);

        this.$progress = document.createElement('div');
        this.$progress.setAttribute('class', 'progress');
        this.$progress.innerText = 'Loaded 0%';
        this.$loading.appendChild(this.$progress);
    }

    setProgress(percent) {
        console.log(`progress ${percent}/100`);
        this.$progress.innerText = `Loaded ${percent}%`;
    }

    // fade out the black plane and trandemark when finished
    async setFinish() {
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.$loading.classList.add('fadeout');

        await new Promise((resolve) => setTimeout(resolve, 500));
        this.$loading.style.display = 'none';
    }
}
