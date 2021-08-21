import * as THREE from 'three';

export default class Light {
    constructor(_option) {
        this.debug = _option.debug;

        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;

        if (this.debug) {
            this.debugFolder = this.debug.addFolder('Light');
            // this.debugFolder.open();
        }

        this.setInstance();
    }

    setInstance() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        this.directionalLight.position.set(2, 3, 4);

        this.container.add(this.ambientLight);
        this.container.add(this.directionalLight);

        if (this.debug) {
            this.debugFolder.add(this.ambientLight, 'intensity').min(0).max(2).step(0.05).name('ambient Intensity');
            this.debugFolder.add(this.directionalLight, 'intensity').min(0).max(2).step(0.05).name('directional Intensity');
            this.debugFolder.add(this.directionalLight.position, 'x').min(-10).max(10).step(0.1).name('position X');
            this.debugFolder.add(this.directionalLight.position, 'y').min(-10).max(10).step(0.1).name('position Y');
            this.debugFolder.add(this.directionalLight.position, 'z').min(-10).max(10).step(0.1).name('position Z');
        }
    }
}
