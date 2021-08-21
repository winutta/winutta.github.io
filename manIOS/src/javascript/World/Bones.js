/* eslint-disable prefer-destructuring */
import * as THREE from 'three';

export default class Bones {
	constructor(_option) {
		this.camera = _option.camera;
        this.instance = _option.instance;
        this.manipulator = _option.manipulator;

        this.setPoint();
		this.setBody();
		this.setScale();
    }

	setPoint() {
		this.rootBone = this.instance.skeleton.bones[0];

		this.lShoulderBone = this.instance.skeleton.bones[16];
		this.lHipBone = this.instance.skeleton.bones[1];
		this.lElbowBone = this.instance.skeleton.bones[17];
		this.lWristBone = this.instance.skeleton.bones[18];
		this.lKneeBone = this.instance.skeleton.bones[2];

		this.rShoulderBone = this.instance.skeleton.bones[12];
		this.rHipBone = this.instance.skeleton.bones[5];
		this.rElbowBone = this.instance.skeleton.bones[13];
		this.rWristBone = this.instance.skeleton.bones[14];
		this.rKneeBone = this.instance.skeleton.bones[6];

		this.bonesIndecies = [17, 18, 19, 13, 14, 15, 1, 2, 3, 5, 6, 7];
		this.boneArm = [18, 19, 14, 15];
		this.boneLeg = [2, 3, 6, 7];
	}

	setBody() {
		const topTorsoR = new THREE.Vector3();
		const topTorsoL = new THREE.Vector3();
        const botTorsoR = new THREE.Vector3();
		const botTorsoL = new THREE.Vector3();

		this.rShoulderBone.getWorldPosition(topTorsoR);
		this.lShoulderBone.getWorldPosition(topTorsoL);
		this.rHipBone.getWorldPosition(botTorsoR);
		this.lHipBone.getWorldPosition(botTorsoL);

		this.body = new THREE.Vector3();
		this.center = new THREE.Vector3();

		this.body.add(topTorsoR).sub(botTorsoR);
		this.body.add(topTorsoL).sub(botTorsoL);
		this.body.multiplyScalar(0.5);

		this.center.add(topTorsoR).add(botTorsoR);
		this.center.add(topTorsoL).add(botTorsoL);
		this.center.multiplyScalar(0.25);
		this.center.sub(this.instance.position.clone());
	}

	setScale() {
		const { fov, position } = this.camera.instance;
		const viewHieght = 2 * Math.tan((fov / 2) * (Math.PI / 180)) * position.length();

		this.scaling = 0.35 * viewHieght / this.body.length();

		const scaling = new THREE.Vector3(1, 1, 1);
		scaling.multiplyScalar(this.scaling);
		this.instance.scale.copy(scaling);

		const shift = this.center.clone();
		shift.multiplyScalar(this.scaling * -1);
		this.instance.position.copy(shift);
	}

    update() {
		this.setPosition();
		this.setJoint();
		this.setConnect();
    }

	setPosition() {
		const { upTorso, avgTorso } = this.manipulator;
		const { fov, aspect, position } = this.camera.instance;

		const h = this.scaling * (this.body.length() / upTorso.length());
		const w = h * aspect;
		this.factor = { fx: w, fy: -h, fz: -h };

		const vFOV = fov * Math.PI / 180;
		const zCenter = position.z - h / (2 * Math.tan(vFOV / 2));
		const zShift = avgTorso.z * this.factor.fz;
		this.zOffset = zCenter - zShift;

		const shift = this.center.clone();
		shift.multiplyScalar(this.scaling * -1);

		const worldPoint = this.getWorldPoint(avgTorso);
		this.instance.position.copy(worldPoint).add(shift);
	}

	setJoint() {
		const { leftArmCross, rightArmCross } = this.manipulator;
		const { leftLegCross, rightLegCross } = this.manipulator;
		const { upTorso, avgTorso, crossTorso } = this.manipulator;

        // Set Arm Bone "up" parameter to arm bone plane normal (left & right)
		this.lShoulderBone.up = this.getWorldPoint(leftArmCross, 'cross');
		this.lElbowBone.up = this.getWorldPoint(leftArmCross, 'cross');
		this.lWristBone.up = this.getWorldPoint(leftArmCross, 'cross');
		this.rShoulderBone.up = this.getWorldPoint(rightArmCross, 'cross');
		this.rElbowBone.up = this.getWorldPoint(rightArmCross, 'cross');
		this.rWristBone.up = this.getWorldPoint(rightArmCross, 'cross');

		// Set Leg Bone "up" parameter to leg bone plane normal (left & right)
		this.lHipBone.up = this.getWorldPoint(leftLegCross, 'cross');
		this.lKneeBone.up = this.getWorldPoint(leftLegCross, 'cross');
		this.rHipBone.up = this.getWorldPoint(rightLegCross, 'cross');
		this.rKneeBone.up = this.getWorldPoint(rightLegCross, 'cross');

		// Set Root Bone "up" parameter to torso plane normal
		const center = this.getWorldPoint(avgTorso).clone();
		const lookAt = this.getWorldPoint(crossTorso, 'cross');

		this.rootBone.up = this.getWorldPoint(upTorso, 'direction');
		this.rootBone.lookAt(center.add(lookAt));
		this.rootBone.rotateX(Math.PI / 10);
	}

	setConnect() {
		this.manipulator.points.forEach((point, i) => {
			const boneInd = this.bonesIndecies[i];
			const bone = this.instance.skeleton.bones[boneInd];
			const worldPoint = this.getWorldPoint(point);

			if (this.boneArm.includes(boneInd)) {
				bone.parent.lookAt(worldPoint);
				bone.parent.rotateX(Math.PI / 2);
			}
			if (this.boneLeg.includes(boneInd)) {
				bone.parent.lookAt(worldPoint);
				bone.parent.rotateX(Math.PI / 2);
				bone.parent.rotateY(Math.PI / 2);
			}
		});
	}

	getWorldPoint(point, mode = 'point') {
		const H = new THREE.Matrix3();
		const p = new THREE.Vector3();
		const worldPoint = new THREE.Vector3();

		const { x, y, z } = point;
		const { fx, fy, fz } = this.factor;

		if (mode === 'point') {
			H.set(
				fx, 0, 0,
				0, fy, 0,
				0, 0, fz,
			);
			p.set(fx, fy, fz).multiplyScalar(-0.5);
			p.z = this.zOffset;
		}
		if (mode === 'direction') {
			H.set(
				fx, 0, 0,
				0, fy, 0,
				0, 0, fz,
			);
		}
		if (mode === 'cross') {
			const c = fx * fy * fz;
			H.set(
				c / fx, 0, 0,
				0, c / fy, 0,
				0, 0, c / fz,
			);
		}

		worldPoint.set(x, y, z).applyMatrix3(H).add(p);
		if (mode !== 'point') worldPoint.normalize();
		return worldPoint;
	}
}
