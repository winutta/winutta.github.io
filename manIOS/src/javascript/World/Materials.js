import JacketMaterial from '../Materials/Jacket';

export default class Materials {
    constructor(_option) {
        this.resources = _option.resources;
        this.items = {};
    }

    setMaterials() {
        this.items.jacket = new JacketMaterial({ resources: this.resources });
    }
}
