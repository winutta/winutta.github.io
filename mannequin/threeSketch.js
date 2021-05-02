

var width = window.innerWidth, height = window.innerHeight;
var points = [];


function main(){
	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true, alpha: true});

	var width = window.innerWidth, height = window.innerHeight;
	console.log(width,height);
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(0xFFFFFF,0);// a nice burnt orange color
	
	const scene = new THREE.Scene();

	const fov = 75;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.01;
	const far = 2000;

	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);

	camera.position.z = 2;

	const controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.update();


	var vFOV = camera.fov * Math.PI / 180;

	var loaded = false;
	const loadingScreen = document.getElementById( 'loading-screen' );
	// const loadingPct = document.getElementById('progress');
	
	// 1. Want to add Google Media Pipe API data and read it to the console, from video

	const videoElement = document.getElementsByClassName('input-video')[0];

	window.addEventListener( 'resize', onWindowResize, false );
	function onWindowResize(){
	    camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();
	    renderer.setSize( window.innerWidth, window.innerHeight );
	    // width = window.innerWidth; 
	    // height = window.innerHeight;

	    console.log(window.innerWidth,window.innerHeight,document.body.clientWidth,document.body.clientHeight)

	    //seems like window innerWidth and innerHeight are giving strange values;

	    // console.log("camera", cameraGMP, width, height);
	    // cameraGMP.g.height = window.innerHeight;
	    // cameraGMP.g.width = window.innerWidth;
	    cameraGMP.g.height = document.body.clientHeight;
	    cameraGMP.g.width = document.body.clientWidth;

    console.log(videoElement.innerWidth);
// 
	    // videoElement.width = window.innerWidth;  //This grows the camera to fit the screen
	    // videoElement.height = window.innerHeight;
    // videoElement.width = document.body.clientWidth;
    // videoElement.height = document.body.clientHeight;
    

	}


	var firstPoint = true;

	var pointsMemory = [];

	function onResults(results) {

		// var smoothPoints = [];

		if(results.poseLandmarks){

			if(pointsMemory.length<5){
				pointsMemory.push(results.poseLandmarks);
			}
			else {
				var removeFirst = pointsMemory.slice(1);
				 removeFirst.push(results.poseLandmarks);
				 pointsMemory = removeFirst;
			}




			var smoothPoints = [...pointsMemory[0]];



			var memoryLength = pointsMemory.length;

			// console.log(results.poseLandmarks,smoothPoints,memoryLength);

			if(memoryLength>1){

				for(var i = 0;i<smoothPoints.length;i++){
					for(var j = 1;j<memoryLength;j++){
						smoothPoints[i].x += pointsMemory[j][i].x;
						smoothPoints[i].y += pointsMemory[j][i].y;
						smoothPoints[i].z += pointsMemory[j][i].z;
					}
					smoothPoints[i].x /= memoryLength;
					smoothPoints[i].y /= memoryLength;
					smoothPoints[i].z /= memoryLength;
				}

			}

			// console.log(memoryLength,results.poseLandmarks, smoothPoints); // this is undefined until 
			// // points = results.poseLandmarks;
			points = smoothPoints;
			if(firstPoint){
				firstPoint = false;
				console.log(points);
			}
		}
	}

	const pose = new Pose({locateFile: (file) => {
	  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
	}});
	pose.setOptions({
	  upperBodyOnly: false,
	  smoothLandmarks: true,
	  minDetectionConfidence: 0.5,
	  minTrackingConfidence: 0.5
	});
	pose.onResults(onResults);

	const cameraGMP = new Camera(videoElement, {
	  onFrame: async () => {
	    await pose.send({image: videoElement});
	  },
	  width: width,
	  height: height
	});

	console.log("camera", cameraGMP);
	cameraGMP.start();

	// 2. Want to load the 3D Model and create sliders for the bones positions.

	var sphereMaterial = new THREE.MeshBasicMaterial({color: "green", skinning: true});
	var red = new THREE.MeshBasicMaterial({color: "red", skinning: true});
	var manMat = new THREE.MeshBasicMaterial({color:"red", skinning: true});
	// sphereMaterial.skinning = true;

	var sphereMeshes = [];

	for(var i=0; i< 33; i++){
		var sphereGeometry = new THREE.SphereGeometry(0.01,32,32);
		var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
		if (i == 14 ){
			sphere = new THREE.Mesh(sphereGeometry,red);
		}
		sphere.position.set(i/10.,0,0);
		// sphere.visible = false;
		sphereMeshes.push(sphere);
		scene.add(sphere);
	}

	function makeSphere(){
		var sphereGeometry = new THREE.SphereGeometry(0.01,32,32);
		var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
		// sphere.position.set(i/10.,0,0);
		// sphereMeshes.push(sphere);
		scene.add(sphere);
		return sphere;
	}

	const loader = new THREE.GLTFLoader();
	var model;

	function getAngleFromVectors(u,v){
		var x_angle = Math.acos( math.dot( [u.y,u.z], [v.y,v.z] ) );
		var y_angle = Math.acos( math.dot( [u.x,u.z], [v.x,v.z] ) );
		var z_angle = Math.acos( math.dot( [u.x,u.y], [v.x,v.y] ) );

		return new THREE.Vector3(x_angle,y_angle,z_angle);
	}

	function onTransitionEnd( event ) {

		event.target.remove();
		
	}

	var ik = new THREE.IK();
	var ikChain = new THREE.IKChain();

	var torsoBoneLength;

	loader.load(
		// resource URL
		"mann.glb",
		// called when the resource is loaded
		function ( gltf ) {
			console.log("loading mann");
			// console.log(gltf.scene.children[2]);
			console.log(gltf.scene.children[2].children[1].material);



			model = gltf.scene.children[2];
			// console.log(model.children[1]);
			gltf.scene.children[2].children[1].material.map.encoding = 3000;
			gltf.scene.children[2].children[1].material.roughness = 2;
			// gltf.scene.children[2].children[1].material.metalness = 0.7;
			// model.children[1].material.color.setHex(0x0000c8);
			// console.log(model.children[1].skeleton);
			const helper = new THREE.SkeletonHelper(model);
			// model.children[1].skeleton.bones[10].position.x = -10.1;
			// model.children[1].material = manMat; //For some reason the mesh doesnt like sharing
			// scene.add(helper);
			scene.add( model );
			model.position.set(0,-1,0);
			model.rotateX(Math.PI/20);
			// model.scale.set(1,1,1);
			// model.children[1].scale.set(0.1,0.1,0.1);

			// console.log(model.children[1]);

			// console.log(model.rotation);
			// model.rotation.set(0,0,0);
			model.updateMatrix();
			model.updateMatrixWorld();





			for(var i = 0; i < 63; i++){
					var bone = model.children[1].skeleton.bones[i];
					// console.log(bone);
			}

			// update bones not in a loop

			var bone = model.children[1].skeleton.bones[7]; //55

			var localPoint = new THREE.Vector3();

			// localPoint.set(10,100,0);

			var worldPoint = new THREE.Vector3().copy(localPoint);

			bone.updateMatrixWorld();

			var worldP2 = new THREE.Vector3();

			bone.getWorldPosition(worldP2); // this one actually worked!

			// bone.localToWorld(worldPoint); //local to world not consitent

			var localP2 = new THREE.Vector3();
			localP2.copy(worldP2);

			bone.parent.worldToLocal(localP2);			

			var worldP3 = new THREE.Vector3();
			worldP3.copy(localP2);

			bone.parent.localToWorld(worldP3); 

			// bone.position.copy(localPoint);

			// var s1 = makeSphere();

			// // s1.position.copy(worldPoint.multiplyScalar(1));
			// var s2 = makeSphere();

			// s2.position.copy(worldP2.multiplyScalar(1));


			// console.log(localPoint,worldPoint, worldP2, bone.position, localP2, worldP3);


			/////////////////////


			var lShoulderBone = model.children[1].skeleton.bones[7];
			var rShoulderBone = model.children[1].skeleton.bones[31];

			var rHipBone = model.children[1].skeleton.bones[60];
			var lHipBone = model.children[1].skeleton.bones[55];


			var topTorsoR = new THREE.Vector3();
			var topTorsoL = new THREE.Vector3();
			rShoulderBone.getWorldPosition(topTorsoR);
			lShoulderBone.getWorldPosition(topTorsoL);
			var topTorsoAvg = new THREE.Vector3();
			topTorsoAvg.copy(topTorsoR).add(topTorsoL).multiplyScalar(0.5);

			var botTorsoR = new THREE.Vector3();
			var botTorsoL = new THREE.Vector3();
			rHipBone.getWorldPosition(botTorsoR);
			lHipBone.getWorldPosition(botTorsoL);
			var botTorsoAvg = new THREE.Vector3();
			botTorsoAvg.copy(botTorsoR).add(botTorsoL).multiplyScalar(0.5);

			var torsoUpBone = topTorsoAvg.clone().sub(botTorsoAvg);

			//Should use upTorsoBoneDiff of only the first time to get the base scale of the mesh
			torsoBoneLength = torsoUpBone.length();
			console.log(torsoBoneLength);
			
			// }


			///////////////////////////////////

			// Setup IK in render loop because points isn't available here //

			// const constraints = [new THREE.IKBallConstraint(200)];

			// var shoulder = model.children[1].skeleton.bones[32];
			// var arm = model.children[1].skeleton.bones[33];
			// var armPoint = sphereMeshes[14]; //Target
			// var falseTarget = null;
			// ikChain.add(new THREE.IKJoint(shoulder, { constraints }), { falseTarget });
			// ikChain.add(new THREE.IKJoint(arm, { constraints }), { armPoint });

			// ik.add(ikChain);

			// scene.add(ik.getRootBone());


			loaded = true;
			console.log("fade out from tex");
			loadingScreen.classList.add( 'fade-out' );
			loadingScreen.addEventListener( 'transitionend', onTransitionEnd );


		},
		// called while loading is progressing
		function ( xhr ) {
			// loadingPct.innerHTML = ( xhr.loaded / xhr.total * 100 ) + '% loaded';
			console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

		},
		// called when loading has errors
		function ( error ) {

			console.log( 'An error happened' );

		}
	);

	const color = 0xFFFFFF;
	const intensity = 1.5;
	const light = new THREE.AmbientLight(color, intensity);
	scene.add(light);


	const light2 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
	// scene.add( light2 );


	const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
	directionalLight.position.set(0,0,-2);
	scene.add( directionalLight );

	var sphereFirst = true;

	function updateSpheres(){

		for(const [index,elem] of sphereMeshes.entries()){
			var pVals = points[index];
			var z = pVals.z +0.5;

			var h =  2 * Math.tan( vFOV / 2 ) * (2 - ((1.-z) - 0.5));
			var w = h * aspect;

			if(sphereFirst){
				sphereFirst = false;
				console.log(w,h,"sphere");
			}

			elem.position.set((pVals.x-0.5)*w,h*((1.-pVals.y)-0.5),(1.-z)-0.5);

		}

	}



	var bonesIndecies = [8,9,10,32,33,34,55,56,57,60,61,62,58,63];
	var pointsIndecies = [11,13,15,12,14,16,23,25,27,24,26,28,31,32];

	var first = true;

	function getLocalPosition(bone,vec){
		var localVec = vec.clone();
		bone.parent.worldToLocal(localVec);
		return localVec;
	}

	function getWorldPoint(point) {
		var x = point.x;
		var y = point.y;
		var z = point.z+0.5;

		var h =  2 * Math.tan( vFOV / 2 ) * (2 - ((1.-z) - 0.5));
		var w = h * aspect;

		var worldPoint = new THREE.Vector3();

		var vals = {x: (x-0.5)*w, y: h*((1.-y)-0.5),z:((1.-z)-0.5)};
		worldPoint.set(vals.x,vals.y,vals.z);

		return worldPoint;
	}

	var firstResize = true;
	var torsoBoneLength;

	// var smoothPoints = [];

	function updateSkinnedMesh(time){
		if(model){


			


			
			var lHip = getWorldPoint(points[23]);
			var rHip = getWorldPoint(points[24]);

			var lShoulder = getWorldPoint(points[11]);
			var rShoulder = getWorldPoint(points[12]);

			var avgShoulder = lShoulder.clone().add(rShoulder).multiplyScalar(0.5);

			var avgHip = lHip.clone().add(rHip).multiplyScalar(0.5);

			var diffAvgs = avgShoulder.clone().sub(avgHip).multiplyScalar(0.1);

			var finalPosition = avgHip.clone().add(diffAvgs);

			// console.log(avgHip);

			var localAvgHip = getLocalPosition(model.children[1].skeleton.bones[0],finalPosition);

			model.children[1].skeleton.bones[0].position.copy(localAvgHip);









			// set rotations of arms and legs from triangles //

			// SETTING UP for later lookAt //

			var lElbow = getWorldPoint(points[13]);
			var lWrist = getWorldPoint(points[15]);

			var leftTopArm = lShoulder.clone().sub(lElbow);
			var leftLowerArm = lWrist.clone().sub(lElbow);

			var leftArmCross = leftTopArm.clone().cross(leftLowerArm);
			leftArmCross.normalize();


			var lShoulderBone = model.children[1].skeleton.bones[7];
			var lElbowBone = model.children[1].skeleton.bones[8];
			var lWristBone = model.children[1].skeleton.bones[9];

			lShoulderBone.up = leftArmCross;
			lElbowBone.up = leftArmCross;
			lWristBone.up = leftArmCross;

			//

			var rElbow = getWorldPoint(points[14]);
			var rWrist = getWorldPoint(points[16]);

			var rightTopArm = rShoulder.clone().sub(rElbow);
			var rightLowerArm = rWrist.clone().sub(rElbow);

			var rightArmCross = rightTopArm.clone().cross(rightLowerArm);
			rightArmCross.normalize().multiplyScalar(-1);

			var rShoulderBone = model.children[1].skeleton.bones[31];
			var rElbowBone = model.children[1].skeleton.bones[32];
			var rWristBone = model.children[1].skeleton.bones[33];


			rShoulderBone.up = rightArmCross;
			rElbowBone.up = rightArmCross;
			rWristBone.up = rightArmCross;

			//

			var rKnee = getWorldPoint(points[26]);
			var rAnkle = getWorldPoint(points[28]);

			var rightTopLeg = rHip.clone().sub(rKnee);
			var rightLowerLeg = rAnkle.clone().sub(rKnee);

			var rightLegCross = rightTopLeg.clone().cross(rightLowerLeg);
			rightLegCross.normalize().multiplyScalar(1);

			var rHipBone = model.children[1].skeleton.bones[60];
			var rKneeBone = model.children[1].skeleton.bones[61];
			var rAnkleBone = model.children[1].skeleton.bones[62];


			rHipBone.up = rightLegCross;
			rKneeBone.up = rightLegCross;
			// rAnkleBone.up = rightLegCross;

			//

			var lKnee = getWorldPoint(points[25]);
			var lAnkle = getWorldPoint(points[27]);

			var leftTopLeg = lHip.clone().sub(lKnee);
			var leftLowerLeg = lAnkle.clone().sub(lKnee);

			var leftLegCross = leftTopLeg.clone().cross(leftLowerLeg);
			leftLegCross.normalize().multiplyScalar(1);

			var lHipBone = model.children[1].skeleton.bones[55];
			var lKneeBone = model.children[1].skeleton.bones[56];
			var lAnkleBone = model.children[1].skeleton.bones[57];


			lHipBone.up = leftLegCross;
			lKneeBone.up = leftLegCross;
			// lAnkleBone.up = leftLegCross;



			//Torso

			var bottomTorso = lHip.clone().sub(rHip);


			var avgTopTorso = lShoulder.clone().add(rShoulder).multiplyScalar(0.5);
			var avgBottomTorso = lHip.clone().add(rHip).multiplyScalar(0.5);

			var avgTorso = avgTopTorso.clone().add(avgBottomTorso).multiplyScalar(0.5);


			var upTorso = avgTopTorso.clone().sub(avgBottomTorso);  

			var crossTorso = bottomTorso.clone().cross(upTorso);
			crossTorso.normalize();

			var rootBone = model.children[1].skeleton.bones[0];

			rootBone.up = upTorso;

			rootBone.lookAt(avgTorso.clone().add(crossTorso));
			rootBone.rotateX(Math.PI/10);// maybe find a way to make this not necessary

			// not sure if i love this becausemaybe the data is off? 
			//try to rework this
			

			var modelScale = (upTorso.length()/torsoBoneLength)/95.;
			// console.log(modelScale);
			var scaler = new THREE.Vector3();
			scaler.setScalar(modelScale);
			// console.log(model.scale);

			model.scale.copy(scaler);

			// scaler.multiply(model.scale);

			// scaler.set(1,1,1).multiplyScalar();

			// if(firstResize){
			// 	firstResize = false;
			// 	model.scale.set(0.016,0.016,0.016);
			// 	 // model.scale.copy(scaler);
			// 	 console.log(modelScale,model.scale,upTorsoBoneDiff.length(),upTorso.length());
			// }

			//
			//maybe just do it the first time?


			// model.updateMatrixWorld();
		


			for(var i = 0; i < 14; i++){
				var boneInd = bonesIndecies[i];
				var pointInd = pointsIndecies[i];

				// var point = points[pointInd];
				// var bone = model.children[1].skeleton.bones[boneInd];

				var point = points[pointInd]; //23
				var bone = model.children[1].skeleton.bones[boneInd]; //55

				var x = point.x;
				var y = point.y;
				var z = point.z+0.5;

				var h =  2 * Math.tan( vFOV / 2 ) * (2 - ((1.-z) - 0.5));
				var w = h * aspect;




				var worldPoint = new THREE.Vector3();

				var vals = {x: (x-0.5)*w, y: h*((1.-y)-0.5),z:((1.-z)-0.5)};
				worldPoint.set(vals.x,vals.y,vals.z);


				// if(boneInd == 9 || boneInd == 10){
					// bone.parent.lookAt(worldPoint);
						
				var boneList = [9,33,10,34,57,62,56,61];
				boneList = [56,57,61,62, 9,10,33,34];
				var leftArmBones = [7,8,9];


				if(boneList.includes(boneInd)){
					var rotatedBone = bone.parent;
					rotatedBone.lookAt(worldPoint);
					rotatedBone.rotateX(Math.PI/2);
					// rotatedBone.rotateZ(Math.PI);


					// worldPoint, bone.parent.getWorldPosition();
					// if(worldPoint.z<bone.parent.getWorldPosition()){
					// 	rotatedBone.rotateY(Math.PI);
					// }

					// if([9,10].includes(boneInd)) {
					// 	// rotatedBone.rotateY(Math.PI/2);
					// 	rotatedBone.rotateX(Math.PI/2);

					// }

					if([61,62,56,57].includes(boneInd)) {
						rotatedBone.rotateY(Math.PI/2);
						// rotatedBone.rotateX(Math.PI/2);

					}

					// if([34].includes(boneInd)) {
					// 	// rotatedBone.rotateY(Math.PI/2);
					// 	// rotatedBone.rotateX(Math.PI/2);

					// }
					// if(leftArmBones.includes(boneInd)){
					// 	 //right side seems to need this., but left side doesnt
					// } else {
					// 	rotatedBone.rotateY(Math.PI/2);
					// }
					// rotatedBone.rotation.y = 0.;
					// rotatedBone.rotation.y = Math.min(rotatedBone.rotation.y,Math.PI/2);



					
				}

				// Left Arm triangle



				// want to set root bone position.

				

				// if(model){
				// 	var hipL = model.children[1].skeleton.bones[55];
				// 	var pointHL = 
				// 	var hipR = model.children[1].skeleton.bones[60];
				// 	var shoulderL = model.children[1].skeleton.bones[7];
				// 	var shoulderR = model.children[1].skeleton.bones[31];
				// 	// hip.rotation.set(0,0,0);
				// 	hip.lookAt(armPoint.position); //this would be the point for the child
				// 	hip.rotateX(-Math.PI/2);
				// 	hip.rotateZ(Math.PI);
				// 	// hip.rotateY(Math.PI);
				// }

				// model.updateMatrixWorld();

				var localPoint = new THREE.Vector3();

				var localLength = bone.position.length();



				//Want to save the length of the local vector
				//Scale the resulting local vector to be unchanged;

				localPoint.copy(worldPoint);

				bone.parent.worldToLocal(localPoint);

				// localPoint.setLength(localLength);

				// Set Bone Position //
				// if(boneInd != 33){
					// bone.position.copy(localPoint);
				// }

				// }
				// model.updateMatrixWorld();


				////////////////////////////////

				// Angle Setting Manually  //

				// Need bone and bone parent world coords;
				var boneWorld = new THREE.Vector3();
				bone.getWorldPosition(boneWorld);
				var parentWorld = new THREE.Vector3();
				bone.parent.getWorldPosition(parentWorld);
				var angle = getAngleFromVectors(boneWorld,parentWorld);

				var eulerAngle = new THREE.Euler();
				eulerAngle.setFromVector3(angle);
				// This is the world angle though.. so probably want to transform it to local angle.
				// Also angle needs to be an Euler object, not a Vector3 object.

				// There are a lot of cases when you dont want to rotate towards the child object.

				// bone.parent.lookAt(worldPoint);

				// bone.parent.rotation.copy(eulerAngle);




				

				 //23
				// var rightHip = model.children[1].skeleton.bones[60];
				// var leftHip = model.children[1].skeleton.bones[55];
				// var base= model.children[1].skeleton.bones[0];

				// var rightPoint = points[24];
				// var leftPoint = points[23];

				// // var x = point.x;
				// // var y = point.y;
				// // var z = point.z+0.5;

				// // var h =  2 * Math.tan( vFOV / 2 ) * (2 - ((1.-z) - 0.5));
				// // var w = h * aspect;

				// var valsRight = {x: (rightPoint.x-0.5)*w, y: h*((1.-rightPoint.y)-0.5),z:((1.-rightPoint.z)-0.5)};

				// var rightWC = new THREE.Vector3(), leftWC = new THREE.Vector3();

				// rightWC.copy(rightPoint);
				// leftWC.copy(rightPoint);

				// // need to apply the proper transofrm like above

				// rightHip.parent.localToWorld(rightWC);
				// leftHip.parent.localToWorld(leftWC);




				// var mid = new THREE.Vector3().copy(rightWC);
				// mid.add(leftWC).multiplyScalar(0.5);

				// var baseLC = new THREE.Vector3().copy(mid);
				// base.parent.worldToLocal(baseLC);

				// // base.position.copy(baseLC);

				// base.position.z = Math.sin(time)*4 - 105;

				model.updateMatrixWorld();



				if(first){
					first = false;
					// console.log(angle, baseLC, mid);
					// console.log(prePoint, localPoint, midPoint, bone.position);

				}
				// var point = ;
			}



			// var bone = model.children[1].skeleton.bones[7];
			// bone.position.x = Math.sin(time)*2;
		}
	}


	function render(time){

		if(points){
			if(points[0]){
				updateSpheres();
				updateSkinnedMesh(time*0.01);
			}
		}

		// ik.solve();

		renderer.render(scene,camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

window.onload = main;
// main();
