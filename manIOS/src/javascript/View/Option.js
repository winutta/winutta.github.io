export default class Option {
    constructor(_option) {
        this.debug = _option.debug;
        this.$root = _option.$root;
        this.time = _option.time;
        this.resources = _option.resources;

        this.setDOM();
    }

    setDOM() {
        this.$container = document.createElement('div');
        this.$container.className = 'options';

        // show options in debug mode (note that $root will be hidden in debug mode)
        if (this.debug) {
            document.body.appendChild(this.$container);
        } else {
            this.$root.appendChild(this.$container);
        }
    }

    setThumbnail() {
        this.items = [];
        this.thumbnails = this.resources.items.thumbnails;
        this.currentIndex = 0;

        this.thumbnails.forEach((color) => {
            const item = document.createElement('div');
            item.className = 'item';
            item.style.backgroundImage = `url(${color})`;

            this.$container.appendChild(item);
            this.items.push(item);
        });
    }

    setSelect() {
        this.items[this.currentIndex].classList.add('active');

        // trigger by space
        this.time.on('space', () => {
            this.currentIndex += 1;
            this.currentIndex %= this.thumbnails.length;
            this.items.forEach((item) => item.classList.remove('active'));
            this.items[this.currentIndex].classList.add('active');
            this.time.trigger('colorChange');
        });

        // trigger by hand gesture
        this.time.on('rightHandSwipe', () => {
            this.currentIndex += 1;
            this.currentIndex %= this.thumbnails.length;
            this.items.forEach((item) => item.classList.remove('active'));
            this.items[this.currentIndex].classList.add('active');
            this.time.trigger('colorChange');
        });

        // trigger by mouse click
        this.items.forEach((dom, i) => {
            const item = dom;
            item.onclick = () => {
                this.currentIndex = i;
                this.items.forEach((item) => item.classList.remove('active'));
                this.items[this.currentIndex].classList.add('active');
                this.time.trigger('colorChange');
            };
        });
    }

    setFinish() {
        this.setThumbnail();
        this.setSelect();
        this.setDisplay();
    }

    setHidden() {
        this.$container.classList.add('hide');
    }

    setDisplay() {
        this.$container.classList.remove('hide');
    }
}
