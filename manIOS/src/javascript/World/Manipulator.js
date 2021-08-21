import * as THREE from 'three';

export default class Manipulator {
    constructor(_option) {
        this.mediaPipe = _option.mediaPipe;
    }

    update() {
        this.setPoint();
        this.setArm();
        this.setLeg();
        this.setRootBone();
    }

    setPoint() {
		this.points = [];
        const points = this.mediaPipe.smoothLandmarks;
		const pointsIndex = [11, 13, 15, 12, 14, 16, 23, 25, 27, 24, 26, 28];
		pointsIndex.forEach((ind) => this.points.push(points[ind]));

        this.lShoulder = Manipulator.vector(points[11]);
		this.lHip = Manipulator.vector(points[23]);
		this.lElbow = Manipulator.vector(points[13]);
		this.lWrist = Manipulator.vector(points[15]);
		this.lKnee = Manipulator.vector(points[25]);
		this.lAnkle = Manipulator.vector(points[27]);

        this.rShoulder = Manipulator.vector(points[12]);
		this.rHip = Manipulator.vector(points[24]);
		this.rElbow = Manipulator.vector(points[14]);
		this.rWrist = Manipulator.vector(points[16]);
		this.rKnee = Manipulator.vector(points[26]);
		this.rAnkle = Manipulator.vector(points[28]);
    }

    static vector(point) { return new THREE.Vector3(point.x, point.y, point.z); }

    setArm() {
		const leftTopArm = this.lShoulder.clone().sub(this.lElbow);
		const leftLowerArm = this.lWrist.clone().sub(this.lElbow);
		this.leftArmCross = leftTopArm.clone().cross(leftLowerArm);

		const rightTopArm = this.rShoulder.clone().sub(this.rElbow);
		const rightLowerArm = this.rWrist.clone().sub(this.rElbow);
		this.rightArmCross = rightTopArm.clone().cross(rightLowerArm).multiplyScalar(-1);
    }

    setLeg() {
		const leftTopLeg = this.lHip.clone().sub(this.lKnee);
		const leftLowerLeg = this.lAnkle.clone().sub(this.lKnee);
		this.leftLegCross = leftTopLeg.clone().cross(leftLowerLeg);

		const rightTopLeg = this.rHip.clone().sub(this.rKnee);
		const rightLowerLeg = this.rAnkle.clone().sub(this.rKnee);
		this.rightLegCross = rightTopLeg.clone().cross(rightLowerLeg);
    }

    setRootBone() {
		const bottomTorso = this.lHip.clone().sub(this.rHip);
		const avgTopTorso = this.lShoulder.clone().add(this.rShoulder).multiplyScalar(0.5);
		const avgBottomTorso = this.lHip.clone().add(this.rHip).multiplyScalar(0.5);

		this.avgTorso = avgTopTorso.clone().add(avgBottomTorso).multiplyScalar(0.5);
		this.upTorso = avgTopTorso.clone().sub(avgBottomTorso);
		this.crossTorso = bottomTorso.clone().cross(this.upTorso);
    }
}
