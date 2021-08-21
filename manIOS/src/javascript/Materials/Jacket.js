import * as THREE from 'three';

export default function jacket(_option) {
    const { normalTexture } = _option.resources.items;
    const colorTexture = _option.resources.items.colorTextures[0];

    const material = new THREE.MeshPhongMaterial();
    material.normalMap = normalTexture;
    material.map = colorTexture;

    return material;
}
