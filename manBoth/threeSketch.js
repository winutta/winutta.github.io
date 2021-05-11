

var width = window.innerWidth, height = window.innerHeight;
var points = [];


function main(){
	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true, alpha: true});

	// var width = window.innerWidth, height = window.innerHeight;
	var width = document.documentElement.clientWidth, height = document.documentElement.clientHeight; 
	console.log(width,height);
	renderer.setSize(width, height);
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
	// videoE
	// videoElement.width = width;
	// videoElement.height = height;

	var userAgent = navigator.userAgent.toLowerCase();

	console.log("android", userAgent,userAgent.indexOf("android"));
	var android = false;

	if(userAgent.indexOf('android') >-1){
		android = true;
	} else {
		videoElement.classList.add("desktop-window");
	}




	var firstPoint = true;

	var pointsMemory = [];

	function onResults(results) {

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
	  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.3.1620246326/${file}`;
	}});
	pose.setOptions({
	  selfieMode: true,
	  upperBodyOnly: false,
	  smoothLandmarks: true,
	  minDetectionConfidence: 0.5,
	  minTrackingConfidence: 0.5
	});
	pose.onResults(onResults);

	const getMethods = (obj) => {
	  let properties = new Set()
	  let currentObj = obj
	  do {
	    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
	  } while ((currentObj = Object.getPrototypeOf(currentObj)))
	  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
	}


	console.log(getMethods(pose));

	var cameraGMP = new Camera(videoElement, {
	  onFrame: async () => {
	    await pose.send({image: videoElement});
	  },
	  width: Math.max(height,width),
	  height: Math.min(height,width)
	});

	console.log("camera", cameraGMP);
	var videoStream = cameraGMP.start();

	// var userAgent = navigator.userAgent.toLowerCase();

	// console.log("android", userAgent,userAgent.indexOf("android"));
	// videoStream.then((vidStream) => {
	// 	console.log("VideoStream", vidStream);
	// });

	// console.log(videoStream);

	// if (document.documentElement.requestFullscreen) {
	//     document.documentElement.requestFullscreen();
	//   } else if (document.documentElement.mozRequestFullScreen) {
	//     document.documentElement.mozRequestFullScreen();
	//   } else if (document.documentElement.webkitRequestFullscreen) {
	//     document.documentElement.webkitRequestFullscreen();
	//   } else if (document.documentElement.msRequestFullscreen) {
	//     document.documentElement.msRequestFullscreen();
	//   }

	// window.addEventListener('touchstart',lockOrientation,false);

	// var unlocked = true;

	// function lockOrientation() {
	// 	if(unlocked){

	// 		if (document.documentElement.requestFullscreen) {
	// 		    document.documentElement.requestFullscreen();
	// 		  } else if (document.documentElement.mozRequestFullScreen) {
	// 		    document.documentElement.mozRequestFullScreen();
	// 		  } else if (document.documentElement.webkitRequestFullscreen) {
	// 		    document.documentElement.webkitRequestFullscreen();
	// 		  } else if (document.documentElement.msRequestFullscreen) {
	// 		    document.documentElement.msRequestFullscreen();
	// 		  }

	// 		window.screen.orientation.lock('portrait');
	// 	}
	// }

	


	window.addEventListener( 'resize', onWindowResize, false );
	function onWindowResize(){
	    camera.aspect = window.innerWidth / window.innerHeight;
	    camera.updateProjectionMatrix();
	    width = document.documentElement.clientWidth;
	    height = document.documentElement.clientHeight;
	    renderer.setSize( width, height );
	    // videoStream.then((value) => console.log("streaming",value));
	    // console.log("V stream",videoStream);
	    if(android && medStream){
		    var constraints = medStream.getVideoTracks()[0].getConstraints();
		    constraints.width = Math.max(height,width);
		    constraints.height = Math.min(height,width);
		    medStream.getVideoTracks()[0].applyConstraints(constraints);
		}
	    // console.log("ms", medStream.getVideoTracks()[0].getConstraints());



	    //changing width on camera object didnt work.

	    // console.log(cameraGMP);
	    // cameraGMP.g.width = Math.max(height,width);
	    // cameraGMP.g.height = Math.max(height,width);
	    
	    // videoElement.style.width = Math.max(height,width);
	    // videoElement.style.height = Math.min(height,width);
	    // width = window.innerWidth;
	    // height = window.innerHeight;

	    //Try changing width on video element
	    //Didnt seem to work

	    // var vid = cameraGMP.video;
	    // vid.clientHeight = Math.max(height,width);
	    // vid.clientWidth = Math.max(height,width);
	    // console.log(cameraGMP);

	 //    cameraGMP = new Camera(videoElement, {
		//   onFrame: async () => {
		//     await pose.send({image: videoElement});
		//   },
		//   width: Math.max(height,width),
		//   height: Math.min(height,width)
		// });

		// console.log("camera", cameraGMP);
		// cameraGMP.start();

	}

	// 2. Want to load the 3D Model and create sliders for the bones positions.

	var sphereMaterial = new THREE.MeshBasicMaterial({color: "green", skinning: true});
	var red = new THREE.MeshBasicMaterial({color: "red", skinning: true});
	var manMat = new THREE.MeshBasicMaterial({color:"red", skinning: true});

	var sphereMeshes = [];

	for(var i=0; i< 33; i++){
		var sphereGeometry = new THREE.SphereGeometry(0.01,32,32);
		var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
		if (i == 14 ){
			sphere = new THREE.Mesh(sphereGeometry,red);
		}
		sphere.position.set(i/10.,0,0);
		sphere.visible = false;
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

	var torsoBoneLength;

	// Load GLTF file //

	var manager = new THREE.LoadingManager();



	const progress = document.getElementById( 'progress' );

	manager.onProgress = (url,itemsLoaded,itemsTotal) => {
			console.log(url,itemsLoaded,itemsTotal); // use a loading manager instead..... work for another day
			progress.innerHTML = "Loaded " + (itemsLoaded/itemsTotal*100).toFixed(2) + "%";
	}

	manager.onLoad = () => {
		console.log("fade out");
		loadingScreen.classList.add( 'fade-out' );
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
	}

	const textureLoader = new THREE.TextureLoader(manager);


	var loaded;
	loaded.diffuse = false;
	loaded.normal = false;
	loaded.roughhness = false;


	texture_diffuse = textureLoader.load(
		"textures/diffuse.png",
		(tex) => {
			loaded.diffuse = true;
			// console.log(texture_diffuse);
		}
	);
	texture_diffuse.flipY = false;

	// texture_diffuse.repeat.set(1, 1);

	texture_normal = textureLoader.load(
		"textures/normal.png",
		(tex) => {
			loaded.normal = true;
		}
	);

	texture_normal.flipY = false;

	texture_roughness = textureLoader.load(
		"textures/roughness.png",
		(tex) => {
			loaded.roughness = true;
		}
	);

	texture_roughness.flipY = false;

	const loader = new THREE.GLTFLoader(manager);

	loader.load(
		// resource URL
		// "mann.glb",
		"mann_no_mats.glb",
		// called when the resource is loaded
		function ( gltf ) {
			console.log("loading mann");

			console.log(gltf.scene.children[2].children[1].material);


			// need to scale the textures?


			model = gltf.scene.children[2];
			var mesh = model.children[1];
			var mat = mesh.material;
			mat.map = texture_diffuse;
			mat.roughnessMap = texture_roughness; 
			mat.normalMap = texture_normal;
			mat.metalness = 0.5;
			mat.roughness = 2;


			console.log(model);

			// gltf.scene.children[2].children[1].material.map.encoding = 3000;
			// gltf.scene.children[2].children[1].material.roughness = 2;

			scene.add( model );
			model.position.set(0,-1,0);
			model.rotateX(Math.PI/20);

			model.updateMatrix();
			model.updateMatrixWorld();


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

			torsoBoneLength = torsoUpBone.length();
			console.log(torsoBoneLength);

			loaded = true;
			// console.log("fade out from tex");
			// loadingScreen.classList.add( 'fade-out' );
			// loadingScreen.addEventListener( 'transitionend', onTransitionEnd );


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
	const intensity = 2;
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
		// var z = point.z+1.5;

		var h =  2 * Math.tan( vFOV / 2 ) * (2 - ((1.-z) - 0.5));
		var w = h * aspect;

		var worldPoint = new THREE.Vector3();

		var vals = {x: (x-0.5)*w, y: h*((1.-y)-0.5),z:((1.-z)-0.5)};
		worldPoint.set(vals.x,vals.y,vals.z);

		return worldPoint;
	}

	var firstResize = true;
	var torsoBoneLength;

	function updateSkinnedMesh(time){
		if(model){


			// Set Hip Position in world space //
			
			var lHip = getWorldPoint(points[23]);
			var rHip = getWorldPoint(points[24]);

			var lShoulder = getWorldPoint(points[11]);
			var rShoulder = getWorldPoint(points[12]);

			var avgShoulder = lShoulder.clone().add(rShoulder).multiplyScalar(0.5);
			var avgHip = lHip.clone().add(rHip).multiplyScalar(0.5);

			var diffAvgs = avgShoulder.clone().sub(avgHip).multiplyScalar(0.1);
			var finalPosition = avgHip.clone().add(diffAvgs);
			var localAvgHip = getLocalPosition(model.children[1].skeleton.bones[0],finalPosition);

			model.children[1].skeleton.bones[0].position.copy(localAvgHip);


			//  Set Arm Bone "up" parameter "bone.up" to arm bone plane normal for left and right arm bones //

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

			////////////

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

			// Set Leg Bone "up" parameter "bone.up" to arm bone plane normal for left and right Leg bones //

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

			// Set Root Bone "up" parameter "bone.up" to torso plane normal //

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
			rootBone.rotateX(Math.PI/10);


			// Set model Scale based on ratio to initial torso length to match scene //
			
			var modelScale = (upTorso.length()/torsoBoneLength)/95.;

			var scaler = new THREE.Vector3();
			scaler.setScalar(modelScale);

			model.scale.copy(scaler);

			// call lookAt function of parent bones to orient towards the child bones //
			// Rotate to fix offset rotations //

			for(var i = 0; i < 14; i++){
				var boneInd = bonesIndecies[i];
				var pointInd = pointsIndecies[i];

				var point = points[pointInd];
				var bone = model.children[1].skeleton.bones[boneInd];

				var x = point.x;
				var y = point.y;
				var z = point.z+0.5;
				// var z = point.z+1.5;

				var h =  2 * Math.tan( vFOV / 2 ) * (2 - ((1.-z) - 0.5));
				var w = h * aspect;

				var worldPoint = new THREE.Vector3();

				var vals = {x: (x-0.5)*w, y: h*((1.-y)-0.5),z:((1.-z)-0.5)};
				worldPoint.set(vals.x,vals.y,vals.z);
						
				var boneList = [9,33,10,34,57,62,56,61];
				boneList = [56,57,61,62, 9,10,33,34];
				var leftArmBones = [7,8,9];


				if(boneList.includes(boneInd)){
					var rotatedBone = bone.parent;
					rotatedBone.lookAt(worldPoint);
					rotatedBone.rotateX(Math.PI/2);


					if([61,62,56,57].includes(boneInd)) {
						rotatedBone.rotateY(Math.PI/2);

					}
					
				}

				model.updateMatrixWorld();

			}

		}
	}


	function render(time){

		if(points){
			if(points[0]){
				updateSkinnedMesh(time*0.01);
			}
		}

		renderer.render(scene,camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

window.onload = main;
// main();
