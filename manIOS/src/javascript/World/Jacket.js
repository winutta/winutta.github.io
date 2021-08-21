import * as THREE from 'three';
import Bones from './Bones';
import Manipulator from './Manipulator';

export default class Jacket {
    constructor(_option) {
        this.view = _option.view;
        this.time = _option.time;
        this.debug = _option.debug;
        this.camera = _option.camera;
        this.materials = _option.materials;
        this.resources = _option.resources;
        this.mediaPipe = _option.mediaPipe;

        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;

        this.setModel();
		this.setVisible();
		this.setColor();
		this.setGUItexture();
		this.setGUIbone();
        this.setBones();
    }

    setModel() {
        this.fbx = this.resources.items.model;
        this.fbx.traverse((child) => { if (child.type === 'SkinnedMesh') this.instance = child; });

        const material = this.materials.items.jacket;
        this.instance.material = material;

        const rootBone = this.instance.skeleton.bones[0];
        this.instance.add(rootBone);

        this.container.add(this.instance);
    }

	setVisible() {
		if (!this.debug && !this.mediaPipe.isBegin) {
			this.instance.visible = false;
			this.time.on('MediaPipeStart', () => { this.instance.visible = true; });
		}
	}

	setColor() {
		this.time.on('colorChange', () => {
			const { colorTextures } = this.resources.items;
			const { currentIndex } = this.view.option;
			this.instance.material.map = colorTextures[currentIndex];
		});
	}

    setGUItexture() {
		if (this.debug) {
            const colorVisible = { visible: true };
            const normalVisible = { visible: true };
			const debugTextureFolder = this.debug.addFolder('Textures');
            // debugTextureFolder.open();

            debugTextureFolder.add(colorVisible, 'visible').name('diffusion map').onChange(() => {
                const { colorTextures } = this.resources.items;
                const { currentIndex } = this.view.option;
                if (colorVisible.visible) this.instance.material.map = colorTextures[currentIndex];
                if (!colorVisible.visible) this.instance.material.map = null;
                this.instance.material.needsUpdate = true;
            });

            debugTextureFolder.add(normalVisible, 'visible').name('normal map').onChange(() => {
                if (normalVisible.visible) this.instance.material.normalMap = this.resources.items.normalTexture;
                if (!normalVisible.visible) this.instance.material.normalMap = null;
                this.instance.material.needsUpdate = true;
            });
        }
    }

	setGUIbone() {
		if (this.debug) {
			const debugBoneFolder = this.debug.addFolder('Bones');
            const helper = new THREE.SkeletonHelper(this.instance);
            this.container.add(helper);

            this.instance.skeleton.bones.forEach((bone, i) => {
                const { x, y, z } = bone.position;
                const guiFolder = debugBoneFolder.addFolder(`${i} ${bone.name}`);
                guiFolder.add(bone.position, 'x').min(-10 + x).max(10 + x).step(0.1).name('posX');
                guiFolder.add(bone.position, 'y').min(-10 + y).max(10 + y).step(0.1).name('posY');
                guiFolder.add(bone.position, 'z').min(-10 + z).max(10 + z).step(0.1).name('posZ');
            });
        }
	}

	setBones() {
        this.manipulator = new Manipulator({ mediaPipe: this.mediaPipe });

		this.bones = new Bones({
			camera: this.camera,
			instance: this.instance,
			manipulator: this.manipulator,
        });

        this.time.on('tick', () => {
			if (!this.mediaPipe || !this.mediaPipe.smoothLandmarks) return;
            this.manipulator.update();
			this.bones.update();
		});
	}
}
