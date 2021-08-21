export default class Outline {
    constructor(_option) {
        this.$root = _option.$root;

        this.setDOM();
    }

    setDOM() {
        this.$container = document.createElement('div');
        this.$container.className = 'outline';
        this.$container.style.backgroundImage = 'url("./outline.png")';

        this.$root.appendChild(this.$container);
    }

    setHidden() {
        this.$container.classList.add('hide');
    }

    setDisplay() {
        this.$container.classList.remove('hide');
    }
}
