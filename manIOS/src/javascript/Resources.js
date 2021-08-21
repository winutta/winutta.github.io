import Loader from './Utils/Loader';
import EventEmitter from './Utils/EventEmitter';

export default class Resources extends EventEmitter {
    constructor() {
        super();
        this.loader = new Loader();

        // {'name1': texture1, 'name2': texture2, ...}
        this.items = {};
        this.items.colorTextures = [];
        this.items.thumbnails = [];

        this.start();
    }

    async start() {
        await this.setConfigInternal();
        await this.setConfigExternal();

        this.setPath();
        this.setEvent();
    }

    async setConfigInternal() {
        // relative path (in production)
        const configs = await fetch('./models/config.json').then((res) => res.json());
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        configs.forEach((v, i) => {
            if (i === 0) this.config = v;
            if (v.id === params.id) this.config = v;
        });
    }

    async setConfigExternal() {
        // absolute path (in production)
        const response = await fetch('/wp-json/fitting/item');
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        if (!response.ok) return;

        const configs = await response.json();

        configs.forEach((v) => { if (v.id === params.id) this.config = v; });
    }

    setPath() {
        const paths = [];

        // model path
        paths.push({ name: 'model', source: `${this.config.path}/${this.config.model}` });
        // normal texture path
        paths.push({ name: 'normalTexture', source: `${this.config.path}/${this.config.normalTexture}` });
        // color texture paths
        this.config.colorTextures.forEach((value, i) => {
            paths.push({ name: 'colorTexture', order: i, source: `${this.config.path}/${value}` });
            this.items.colorTextures.push(null);
        });
        // thumbnail paths (don't need to pass to the loader)
        this.config.thumbnails.forEach((value) => {
            this.items.thumbnails.push(`${this.config.path}/${value}`);
        });

        this.loader.load(paths);
    }

    setEvent() {
        // execute after loading each asset
        this.loader.on('fileEnd', (_resource, _data) => {
            switch (_resource.name) {
                case 'model':
                    this.items.model = _data; break;
                case 'normalTexture':
                    this.items.normalTexture = _data; break;
                case 'colorTexture':
                    this.items.colorTextures[_resource.order] = _data; break;
                default:
                    this.items[_resource.name] = _data;
            }

            const { loaded, toLoad } = this.loader;
            const percent = Math.round((loaded / toLoad) * 100);
            this.trigger('progess', [percent]);
        });

        // all finished
        this.loader.on('end', () => {
            this.trigger('ready');
        });
    }
}
