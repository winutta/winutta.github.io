import * as THREE from 'three';
import * as dat from './Libs/dat.gui.module';

import Time from './Utils/Time';
import Sizes from './Utils/Sizes';
import Resources from './Resources';

import View from './View';
import World from './World';
import Camera from './Camera';
import Light from './Light';
import MediaPipe from './MediaPipe';

export default class Application {
    constructor(_options) {
        this.$canvas = _options.$canvas;
        this.$video = _options.$video;
        this.$root = _options.$root;

        this.time = new Time();
        this.sizes = new Sizes();
        this.resources = new Resources();

        this.setConfig();
        this.setDebug();
        this.setMediaPipe();
        this.setRenderer();
        this.setCamera();
        this.setLight();
        this.setView();
        this.setWorld();
    }

    setConfig() {
        this.config = {};
        this.config.debug = window.location.hash === '#debug';
    }

    setDebug() {
        if (this.config.debug) {
            this.debug = new dat.GUI({ width: 350 });

            this.$canvas.style.backgroundColor = 'black';
            this.$canvas.style.zIndex = 0;
            this.$video.style.visibility = 'hidden';
        }
    }

    setMediaPipe() {
        if (this.config.debug) return;

        this.mediaPipe = new MediaPipe({
            $video: this.$video,
            time: this.time,
        });
    }

    setRenderer() {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.$canvas,
            alpha: true,
        });

        const { width, height } = this.sizes.viewport;
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.sizes.on('resize', () => {
            const { width, height } = this.sizes.viewport;
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    setCamera() {
        this.camera = new Camera({
            time: this.time,
            sizes: this.sizes,
            debug: this.debug,
            renderer: this.renderer,
            $canvas: this.$canvas,
        });

        this.scene.add(this.camera.container);

        this.time.on('tick', () => {
            this.renderer.render(this.scene, this.camera.instance);
        });
    }

    setLight() {
        this.light = new Light({
            debug: this.debug,
        });
        this.scene.add(this.light.container);
    }

    setView() {
        this.view = new View({
            $root: this.$root,
            time: this.time,
            debug: this.debug,
            resources: this.resources,
            mediaPipe: this.mediaPipe,
        });
    }

    setWorld() {
        this.world = new World({
            view: this.view,
            time: this.time,
            sizes: this.sizes,
            debug: this.debug,
            camera: this.camera,
            resources: this.resources,
            mediaPipe: this.mediaPipe,
        });
        this.scene.add(this.world.container);
    }
}
