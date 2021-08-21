import * as THREE from 'three';

import Materials from './Materials';
import Controls from './Controls';
import Jacket from './Jacket';

export default class World {
    constructor(_option) {
        this.view = _option.view;
        this.time = _option.time;
        this.sizes = _option.sizes;
        this.debug = _option.debug;
        this.camera = _option.camera;
        this.resources = _option.resources;
        this.mediaPipe = _option.mediaPipe;

        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;
        this.materials = new Materials({ resources: this.resources });

        this.resources.on('ready', () => this.start());
    }

    start() {
        this.materials.setMaterials();

        this.setControls();
        this.setJacket();
    }

    setControls() {
        this.controls = new Controls({
            time: this.time,
            sizes: this.sizes,
        });
    }

    setJacket() {
        this.jacket = new Jacket({
            view: this.view,
            time: this.time,
            debug: this.debug,
            camera: this.camera,
            materials: this.materials,
            resources: this.resources,
            mediaPipe: this.mediaPipe,
        });
        this.container.add(this.jacket.container);
    }
}
