//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file

//import { RectAreaLightUniformsLib } from './RectAreaLightUniformsLib.js';
import {GUI} from 'https://threejs.org/examples/jsm/libs/dat.gui.module.js';
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js'

function loadTexture(url){
	var texture = new THREE.TextureLoader().load( url ,function(){});
	return texture;
}

var getColor = function(r,g,b){
	return new THREE.Color("rgb(" + r.toString() + ", "+ g.toString() + ", " + b.toString() + ")");
}

let selObjs = [],colObjs = [];
let freePosition = true;

function main(){


	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.autoClear = false;
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(0xE88D27,1);// a nice burnt orange color

	document.addEventListener("mousemove",updatePosition,false);
	 if(document.pointerLockElement === canvas || !freePosition){
	} else{
		canvas.requestPointerLock();
	}
	//console.log("test",document.pointerLockElement);

	document.addEventListener("click",pointerL,false);

	function pointerL(){
		if(document.pointerLockElement === canvas || !freePosition){
		} else{
			canvas.requestPointerLock();
		}
	}
	
	var para = document.createElement("span");
	//document.body.appendChild(para);
	var xmov = 0,ymov =0;
	function updatePosition(e){
		xmov+= e.movementX;
		ymov+= e.movementY;
		ymov = Math.max(Math.min(ymov,2000*Math.PI/2),2000*-Math.PI/2);
		para.innerHTML = xmov.toString() + ", " + ymov.toString();
	}
	
	const scene = new THREE.Scene();

	const fov = 58;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 0;

	const camera2 = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera2.position.z = 2;

	const scene2 = new THREE.Scene();

	var vFOV = camera2.fov * Math.PI / 180;
	var h = 2 * Math.tan( vFOV / 2 ) * camera2.position.z;
	var w = h * aspect;


	var buttonTex = loadTexture("button2.png");

	const xSigG = new THREE.PlaneBufferGeometry(w*0.2,w*0.2*(1/3),10);
	const xSigM = new THREE.MeshBasicMaterial({map: buttonTex,transparent:true,opacity:0});
	const xSig = new THREE.Mesh(xSigG,xSigM);
	xSig.position.set(0,-h/2 + h*0.2,0);
	scene2.add(xSig);

	var colCanvas = document.createElement("CANVAS");
	var colCtx = colCanvas.getContext("2d");

	const colImg = new Image();
	colImg.src = "colors.jpeg";

	var colData;
	var colorTexture = new THREE.TextureLoader().load("colors.jpeg", function(){
		colCtx.canvas.width = colImg.width || colImg.naturalWidth;
		colCtx.canvas.height = colImg.height || colImg.naturalHeight;
		colCtx.drawImage(colImg,0,0);
		colData = colCtx.getImageData(0,0,colImg.naturalWidth,colImg.naturalHeight);
	});

	var colPw = w*0.15, colPh = w*0.15;
	var selW = colPw/2, selH = h*0.2;

	const colG = new THREE.PlaneBufferGeometry(1,1,10);
	const colM = new THREE.MeshBasicMaterial({map:colorTexture,transparent:true,opacity:0});
	const colPlane = new THREE.Mesh(colG,colM);
	colPlane.scale.set(colPw,colPh,1);
	colPlane.position.set(w/2-colPw/2,-h/2+ selH + colPh/2,0);
	scene2.add(colPlane);
	colObjs.push(colPlane);

	

	const Geom = new THREE.PlaneGeometry(1,1,10);
	const Mat1 = new THREE.MeshPhongMaterial({color: new THREE.Color("rgb(72, 111, 184)"),emissiveIntensity:0.2, transparent:true,opacity:0});
	const Mat2 = new THREE.MeshPhongMaterial({color: new THREE.Color("rgb(235, 229, 218)"),emissiveIntensity:0.2, transparent:true,opacity:0});
	const sel1 = new THREE.Mesh(Geom,Mat1);
	const sel2 = new THREE.Mesh(Geom,Mat2);
	sel1.scale.set(selW,selH,1);
	sel2.scale.set(selW,selH,1);
	sel1.position.set(w/2-selW*(3/2),-h/2+selH/2,0);
	sel2.position.set(w/2-selW/2,-h/2+selH/2,0);
	scene2.add(sel1);
	scene2.add(sel2);
	selObjs.push(sel1);
	selObjs.push(sel2);

	

	const ambLight = new THREE.AmbientLight(0xFFFFFF,1);
	scene2.add(ambLight);

	function getCols(u,v){
		var tx = Math.min(u*colData.width | 0, colData.width - 1);
		var ty = Math.min(v*colData.height | 0, colData.height - 1);
		ty = colData.height - ty;

		var offset = (ty * colData.width + tx) *4;
		var r = colData.data[offset + 0];
		var g = colData.data[offset + 1];
		var b = colData.data[offset + 2];
		var a = colData.data[offset + 3];

		return new THREE.Vector4(r,g,b,a);
	}

	// var controls = new THREE.OrbitControls( camera, renderer.domElement );
	// //camera.position.set( 0, 20, 100 );
	// controls.target = new THREE.Vector3(0,0,8);
	// controls.update();

	const ya = new THREE.Vector3(0,1,0);
	const xa = new THREE.Vector3(1,0,0);
	const za = new THREE.Vector3(0,0,1);

	var wcTex = loadTexture("wallTextures/wallTex.jpeg");
	var whTex = loadTexture("wallTextures/White_stucco_wall_01_1K_Height.png");
	var wnTex = loadTexture("wallTextures/White_stucco_wall_01_1K_Normal.png");
	var wrTex = loadTexture("wallTextures/White_stucco_wall_01_1K_Roughness.png");
	var waTex = loadTexture("wallTextures/White_stucco_wall_01_1K_AO.png");

	var wcTex2 = loadTexture("wallTextures/Marble_09_1K_Base_Color.png");

	var fcTex = loadTexture("floorTextures/Marble_08_1K_Base_Color.png");
	var fhTex = loadTexture("floorTextures/Marble_08_1K_Height.png");
	var frTex = loadTexture("floorTextures/Marble_08_1K_Roughness.png");

	var fcTex2 = loadTexture("floorTextures/Light_wooden_parquet_flooring_01_1K_Base_Color.png");
	var fhTex2 = loadTexture("floorTextures/Light_wooden_parquet_flooring_01_1K_Height.png");

	const wallG1 = new THREE.PlaneGeometry(14,10,10);
	const wallG2 = new THREE.PlaneGeometry(16,10,10);
	const wallG3 = new THREE.PlaneGeometry(14,16,10);
	const wallM = new THREE.MeshStandardMaterial({
		map: fcTex,
		//color:new THREE.Color("rgb(100, 100, 100)"),
		color:new THREE.Color("rgb(220, 196, 255)"),
		//normalMap:nTex,
		//normalScale: new THREE.Vector2( 0.15, 0.15 ),
		// aoMap: aTex,
		roughnessMap:wrTex,
		bumpMap: whTex,
		bumpScale: 0.01,
		roughness:0.5,
		metalness:0,
		side:THREE.DoubleSide});//side: THREE.DoubleSide

	const floorM = new THREE.MeshStandardMaterial({
		map: fcTex2,

		color:new THREE.Color("rgb(74, 70, 65)"),
		//color:new THREE.Color("rgb(220,220,220)"),
		roughnessMap: fhTex2,
		roughness:0.5,
		bumpMap: fhTex2,
		bumpScale: 0.05,

	})
	const wall1 = new THREE.Mesh(wallG1,wallM);
	const wall2 = new THREE.Mesh(wallG1,wallM);
	const wall3 = new THREE.Mesh(wallG2,wallM);
	const wall4 = new THREE.Mesh(wallG2,wallM);
	const wall5 = new THREE.Mesh(wallG3,floorM);
	const wall6 = new THREE.Mesh(wallG3,wallM);
	wall2.position.set(0,0,16);
	wall2.rotation.y = Math.PI;
	wall3.position.set(-7,0,8);
	wall3.rotation.y = Math.PI/2;
	wall4.position.set(7,0,8);
	wall4.rotation.y = -Math.PI/2;
	wall5.position.set(0,-5,8);
	wall5.rotation.x = -Math.PI/2;
	wall6.position.set(0,5,8);
	wall6.rotation.x = Math.PI/2;

	scene.add(wall1);
	scene.add(wall2);
	scene.add(wall3);
	scene.add(wall4);
	scene.add(wall5);
	scene.add(wall6);

	const playerG = new THREE.SphereBufferGeometry(1,10,10);
	const playerM = new THREE.MeshBasicMaterial({transparent:true,opacity:0});
	const player = new THREE.Mesh(playerG,playerM);
	const playerRot = new THREE.Mesh(playerG,playerM);
	player.position.set(0,-1.2,16);
	player.add(playerRot);
	playerRot.add(camera);
	scene.add(player);

	

	//Add Easel

	var gltfLoader = new GLTFLoader();
	var easel; 

	gltfLoader.load("easel_together.glb",
	function ( gltf ) {
		easel = gltf.scene.children[0];
		var easelM = new THREE.MeshStandardMaterial({
			map: fcTex2,
			color:new THREE.Color("rgb(125, 112, 101)"),
			//roughnessMap: frTex2,
			roughness:0.5,
			bumpMap: fhTex2,
			bumpScale: 0.05,
		});
		easel.material = easelM;
		easel.position.set(0,-5.2,4);
		scene.add(easel);
		console.log(gltf.scene);
	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened' );
	});

	var imgTex;

	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  	document.addEventListener(eventName, preventDefaults, false)
	});

	function preventDefaults (e) {
	  e.preventDefault();
	  e.stopPropagation();
	}

	document.addEventListener('drop',function(e){
		var dt = e.dataTransfer;
		loadAndSaveFiles(dt);
	},false);


	function loadAndSaveFiles(dt){
		if (dt.files && dt.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
            	console.log(e);
            	var mediaType = e.target.result.split(";")[0].split(":")[1].split("/")[0];
            	//console.log(mediaType);
            	if(mediaType == "image"){
	            	imgTex = new THREE.TextureLoader().load( e.target.result ,function(){
	            		console.log(canM2);
	            		canM2.uniforms.tex.value = imgTex;
						canM.map = imgTex;
						can.material.needsUpdate = true;
						var texDim = new THREE.Vector2(imgTex.image.width,imgTex.image.height);
						var cS = canv.scale;
						canv.scale.set(cS.y*(texDim.x/texDim.y),cS.y*1,cS.z*1);
					});
        		}
        		 else if (mediaType == "video"){
        			var video = document.getElementById("video");
        			video.src = e.target.result;
        			video.pause();
					video.currentTime = 0;
					video.play();
        			imgTex = new THREE.VideoTexture( video );
					video.addEventListener("loadedmetadata",function(e){
						var texDim = new THREE.Vector2(this.videoWidth,this.videoHeight);
						canM.map = imgTex;
						canM2.uniforms.tex.value = imgTex;
						can.material.needsUpdate = true;
						var cS = canv.scale;
						canv.scale.set(cS.y*(texDim.x/texDim.y),cS.y*1,cS.z*1);	
					})
        		}
            }
            reader.readAsDataURL(dt.files[0]);
        }
	}

	const renderTarget = new THREE.WebGLRenderTarget(w,h); // this is for a gradient between the two colors
	const rtFov = 58;
	const rtAspect = w/h;
	const rtNear = 0.1;
	const rtFar = 5;
	const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
	rtCamera.position.z = 2;

	const rtScene = new THREE.Scene();

	const rtG = new THREE.PlaneGeometry(w,h,10);
	const rtM = new THREE.ShaderMaterial({
		uniforms: {
			col1: {value: new THREE.Vector3(0.,0.,0.)},
			col2: {value: new THREE.Vector3(1.,1.,1.)},
			res: {value: new THREE.Vector2(w,h)},
		},
		vertexShader: document.getElementById("vertShader").textContent,
		fragmentShader: document.getElementById("rt_fragShader").textContent,
	});
	const rtPlane = new THREE.Mesh(rtG,rtM);

	rtScene.add(rtPlane);

	const canvG = new THREE.BoxBufferGeometry(1,1,1);
	const canvM = new THREE.MeshBasicMaterial({color: "white"});
	const canv = new THREE.Mesh(canvG,canvM);


	const canG = new THREE.PlaneBufferGeometry(1,1,1);
	const canM = new THREE.MeshBasicMaterial({map:imgTex,transparent:true});
	const canM2 = new THREE.ShaderMaterial({
		uniforms: {
			tex: { type: "t", value: imgTex },
			iTime: {type: 'f', value: 0.0},
			res: {value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
			cBuffer: {type: "t", value: renderTarget.texture},
			nL: {type: 'f', value: 4.},
			sR: {type: 'f', value: 4.}
		},
		transparent:true,
		side: THREE.DoubleSide,
		vertexShader: document.getElementById("vertShader").textContent,
		fragmentShader: document.getElementById("fragShader").textContent,
	})
	const can = new THREE.Mesh(canG,canM2);
	can.position.set(0,0,0.505);
	canv.add(can);
	canv.position.set(0,-1.92,3.16);
	canv.scale.set(1,2.64,0.05);
	canv.rotateOnWorldAxis(xa,-Math.PI/12);
	
	scene.add(canv);

	// imgTex = loadTexture("DragPhotoTex.png");
	imgTex  = new THREE.TextureLoader().load( "DragPhotoTex.png" ,function(){

		var canvSc = canv.scale;
		canv.scale.set(canvSc.y*(imgTex.image.width/imgTex.image.height),canvSc.y,canvSc.z);

	});
	canM.map = imgTex;
	canM2.uniforms.tex.value = imgTex;
	
	



	var mouldC;
	var mouldE;

	gltfLoader.load("corner_moulding.glb",
	function ( gltf ) {
		mouldC = gltf.scene.children[0];
		mouldE = gltf.scene.children[1];
		var mouldM = new THREE.MeshStandardMaterial({
			color:new THREE.Color("rgb(200,200,255)"),
			roughness:0.5,
			side:THREE.DoubleSide,
		});
		var eG = mouldE.geometry;
		var cG = mouldC.geometry;

		var edge1 = new THREE.Mesh(eG,mouldM);
		var edge2 = new THREE.Mesh(eG,mouldM);
		var edge3 = new THREE.Mesh(eG,mouldM);
		var edge4 = new THREE.Mesh(eG,mouldM);

		var corner1 = new THREE.Mesh(cG,mouldM);
		var corner2 = new THREE.Mesh(cG,mouldM);
		var corner3 = new THREE.Mesh(cG,mouldM);
		var corner4 = new THREE.Mesh(cG,mouldM);

		
		var xS = 1/12;
		var zS = xS*1.2;

		var curSc = {...edge1.scale};
		
		edge1.scale.set(curSc.x*xS,curSc.y*16-xS*4,curSc.z*zS);
		edge2.scale.set(curSc.x*xS,curSc.y*16-xS*4,curSc.z*zS);
		edge3.scale.set(curSc.x*xS,curSc.y*14-xS*4,curSc.z*zS);
		edge4.scale.set(curSc.x*xS,curSc.y*14-xS*4,curSc.z*zS);

		var curCSc = {...corner1.scale};

		corner1.scale.set(curCSc.x*xS,curCSc.y*xS,curCSc.z*zS);
		corner2.scale.set(curCSc.x*xS,curCSc.y*xS,curCSc.z*zS);
		corner3.scale.set(curCSc.x*xS,curCSc.y*xS,curCSc.z*zS);
		corner4.scale.set(curCSc.x*xS,curCSc.y*xS,curCSc.z*zS);

		edge1.position.set(7,-5,8);
		edge1.rotateOnWorldAxis(xa,Math.PI/2);
		edge2.position.set(-7,-5,8);
		edge2.rotateOnWorldAxis(xa,Math.PI/2);
		edge2.rotateOnWorldAxis(ya,Math.PI);
		edge3.position.set(0,-5,0);
		edge3.rotateOnWorldAxis(xa,Math.PI/2);
		edge3.rotateOnWorldAxis(ya,Math.PI/2);
		edge4.position.set(0,-5,16);
		edge4.rotateOnWorldAxis(xa,Math.PI/2);
		edge4.rotateOnWorldAxis(ya,-Math.PI/2);

		corner1.position.set(7,-5,0);
		corner1.rotateOnWorldAxis(xa,Math.PI/2);
		corner1.rotateOnWorldAxis(ya,Math.PI/2);
		corner2.position.set(-7,-5,0);
		corner2.rotateOnWorldAxis(xa,Math.PI/2);
		corner2.rotateOnWorldAxis(ya,Math.PI);
		corner3.position.set(7,-5,16);
		corner3.rotateOnWorldAxis(xa,Math.PI/2);
		corner4.position.set(-7,-5,16);
		corner4.rotateOnWorldAxis(xa,Math.PI/2);
		corner4.rotateOnWorldAxis(ya,-Math.PI/2);

		scene.add(edge1);
		scene.add(edge2);
		scene.add(edge3);
		scene.add(edge4);

		scene.add(corner1);
		scene.add(corner2);
		scene.add(corner3);
		scene.add(corner4);
	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened' );
	});

	const light = new THREE.AmbientLight(0xFFFFFF,0.2);
	scene.add(light);

	const ballLight = new THREE.PointLight(0xFFFFFF,1);
	ballLight.position.set(0,0,8);
	scene.add(ballLight);

	var lights = [];

	for(let i = 0; i<10;i++){
		var cLight = new THREE.SpotLight(0xFFFFFF,2);
		cLight.position.set(-6.5,-4.5,15 + (i/9)*-14);
		cLight.target.position.set(-6.5 -0.5,-4.5+0.5,15 + (i/9)*-14);
		cLight.angle = Math.PI/4;
		cLight.penumbra = 1;
		cLight.decay = 0.1;
		scene.add(cLight);
		scene.add(cLight.target);
		lights.push(cLight);
	}

	for(let i = 0; i<10;i++){
		var cLight = new THREE.SpotLight(0xFFFFFF,3);
		cLight.position.set(6.5,-4.5,15 + (i/9)*-14);
		cLight.target.position.set(6.5 +0.5,-4.5+0.5,15 + (i/9)*-14);
		cLight.angle = Math.PI/4;
		cLight.penumbra = 1;
		scene.add(cLight);
		scene.add(cLight.target);
		lights.push(cLight);
	}

	// var params = {
	// 	intensity:1,
	// 	decay:1,
	// 	tall:2.6,
	// 	depth:0.11,
	// 	y:-1.9,
	// 	z:3.2,
	// }

	var params = {
		numLayers:4,
		blurRadius:4,
		toggleColor:changeOpacity,
		toggleFilter: toggleFilter,
		widthColor:0.3,
	}

	function changeOpacity(){
		//console.log(params["toggleColor"]);
		colPlane.material.opacity = 1.- colPlane.material.opacity;
		sel1.material.opacity = 1. - sel1.material.opacity;
		sel2.material.opacity = 1. - sel2.material.opacity;
	}

	function toggleFilter(){
		if(can.material == canM){
			can.material = canM2;
		}else if (can.material == canM2){
			can.material = canM;
		}
	}

	var gui = new GUI();
	GUI.toggleHide();
	gui.add(params,"numLayers").min(2).max(10).step(1).onChange(function(){
		canM2.uniforms.nL.value = params["numLayers"];
	});
	gui.add(params,"blurRadius").min(0).max(8).step(1).onChange(function(){
		canM2.uniforms.sR.value = params["blurRadius"];
	});
	gui.add(params,"toggleColor");
	gui.add(params,"widthColor").min(0.1).max(1).step(0.01).onChange(function(){
		var cpScale = colPlane.scale;
		colPlane.scale.set(colPw*params["widthColor"],cpScale.y,1);
		colPlane.position.set(w/2-colPw*params["widthColor"]/2,-h/2+selH + colPh/2,0);
		var selScale = sel1.scale;
		sel1.scale.set(selW*params["widthColor"],selScale.y,1);
		sel2.scale.set(selW*params["widthColor"],selScale.y,1);
		sel1.position.set(w/2-selW*params["widthColor"]*(3/2),-h/2+selH/2,0);
		sel2.position.set(w/2-selW*params["widthColor"]/2,-h/2+selH/2,0);
	});
	gui.add(params,"toggleFilter");

	var movL = 0,movR = 0,movF = 0,movB = 0;
	//var freePosition = true;
	var xFired = false;
	var jumpFired = false;
	var jumpAcc = 0;
	var jumping = false;
	document.addEventListener("keydown",function(e){
		if(e.keyCode == 65){//A
			movL = 1;
		} else if (e.keyCode == 87){//W
			movF = 1;
		}else if (e.keyCode == 68){//D
			movR = 1;
		}else if (e.keyCode == 83){//S
			movB = 1;
		} else if (e.keyCode == 88){
			var dist = Math.pow(Math.pow(player.position.x,2)+Math.pow(player.position.z-easel.position.z,2),0.5);
			if(dist<4){
			freePosition = !freePosition;
			if(!xFired){
				xFired = true;
				GUI.toggleHide();
				if(!freePosition){
					colM.opacity = 1;
				    Mat1.opacity = 1;
				    Mat2.opacity = 1;
					document.exitPointerLock();
					xFired = !xFired;
					player.position.set(0,-1.2,6.2);
					player.rotation.set(0,0,0);
					playerRot.rotation.set(-0.21,0,0);
				} else {
					canvas.requestPointerLock();
					colM.opacity = 0;
				    Mat1.opacity = 0;
				    Mat2.opacity = 0;
				}
			}
			
			}
		}
		 else if (e.keyCode == 32){
		 	// console.log(jumpFired,)
		 	
			if(player.position.y == -1.2 && freePosition){
				jumpAcc = 1;
				jumping = true;
				//setTimeout(function(){jumpAcc = 0},1000);
			}
			//console.log(jumpAcc,player.position.y,freePosition);
		}
	});

	document.addEventListener("keyup",function(e){
		if(e.keyCode == 65){//A
			movL = 0;
		} else if (e.keyCode == 87){//W
			movF = 0;
		}else if (e.keyCode == 68){//D
			movR = 0;
		}else if (e.keyCode == 83){//S
			movB = 0;
		} else if (e.keyCode == 88){
			xFired = false;
		}
		//  else if (e.keyCode == 32){
		// 	jumpFired = false;
		// 	jumpAcc = 0;
		// }
	});

	// var gui = new GUI();
	// gui.add(params,"intensity").min(0).max(10).step(0.01).onChange(function(){
	// lights.forEach(function(item, index){item.intensity = params["intensity"];})
	// });
	// gui.add(params,"decay").min(0).max(10).step(0.01).onChange(function(){
	// lights.forEach(function(item, index){item.decay = params["decay"];})
	// });
	// gui.add(params,"tall").min(0).max(3).step(0.01).onChange(function(){
	// 	var cS = canv.scale;
	// 	canv.scale.set(cS.x,params["tall"],cS.z);
	// });
	// gui.add(params,"depth").min(0).max(3).step(0.01).onChange(function(){
	// 	var cS = canv.scale;
	// 	canv.scale.set(cS.x,cS.y,params["depth"]);
	// });
	// gui.add(params,"z").min(0).max(5).step(0.01).onChange(function(){
	// 	canv.position.z = params["z"];
	// });
	// gui.add(params,"y").min(-3).max(3).step(0.01).onChange(function(){
	// 	canv.position.y = params["y"];
	// });

	class PickHelper {
		constructor() {
		    this.raycaster = new THREE.Raycaster();
		    this.pickedObject = null;
		    this.selectedObject = null;
		    this.pickedObjectSavedColor = 0;
		    this.uvs = new THREE.Vector2(0.,0.);
		    this.blinkColor = 0;
		    this.savedColor = 0;
		    this.useUVs = new THREE.Vector2(0.,0.);
	  }

	   pick(normalizedPosition, scene, camera, time,selObjs) {
	   		
	   		if(selObjs.includes(this.selectedObject)){
	   		//this.blinkColor = (time * 8) % 2 > 1 ? 0xFFFF00 : this.savedColor;
	   		this.blinkColor = Math.sin(time*8) > 0.5 ? 0xFFFF00 : 0x000000;
	   		this.selectedObject.material.color.setHex(this.savedColor);
	   		this.selectedObject.material.emissive.setHex(this.blinkColor);
	   		}
	   		this.raycaster.setFromCamera(normalizedPosition, camera);
	   		// console.log("pick");

	   		const intersectedObjects = this.raycaster.intersectObjects(scene.children);

	   		if (intersectedObjects.length) {
		      // pick the first object. It's the closest one
		    this.pickedObject = intersectedObjects[0].object;
		    this.uvs = intersectedObjects[0].uv;
	    	} else{

	    		this.pickedObject = null;
	    	}
		}
	}

	const pickPosition = {x: 0, y: 0};
	clearPickPosition();
	 
	function getCanvasRelativePosition(event) {
	  const rect = canvas.getBoundingClientRect();
	  return {
	    x: (event.clientX - rect.left) * canvas.width  / rect.width,
	    y: (event.clientY - rect.top ) * canvas.height / rect.height,
	  };
	}
	 
	function setPickPosition(event) {
	  const pos = getCanvasRelativePosition(event);
	  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
	  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
	}
	 
	function clearPickPosition() {
	  // unlike the mouse which always has a position
	  // if the user stops touching the screen we want
	  // to stop picking. For now we just pick a value
	  // unlikely to pick something
	  pickPosition.x = -100000;
	  pickPosition.y = -100000;
	}

	const pickHelper = new PickHelper();

	var ind;

	function selectionHandler(){
		//console.log(colObjs,pickHelper.pickedObject);

		clearInterval(ind);
		ind = setInterval(function(){
		if(colObjs.includes(pickHelper.pickedObject)){
			//console.log("pick col");
			pickHelper.useUVs = pickHelper.uvs;
			var uvs = {x: pickHelper.useUVs.x, y: pickHelper.useUVs.y};
			if(colData){
			var rgb = getCols(uvs.x,uvs.y);
			pickHelper.savedColor = getColor(rgb.x,rgb.y,rgb.z).getHex();
			}
		}
		//console.log(!pickHelper.pickedObject);

		//could also write : else if(pickHelper.selectedObject)
		if(pickHelper.selectedObject && !colObjs.includes(pickHelper.pickedObject)){
				pickHelper.selectedObject.material.color.setHex(pickHelper.savedColor);
				pickHelper.selectedObject.material.emissive.setHex(0x000000);
				//Set selected shader color uniform to savedColor
				pickHelper.selectedObject = null;
				//Set selected shader uniform variable to null
			}
		if(selObjs.includes(pickHelper.pickedObject)){
			//set selected shader uniform variable to uniform variable placeholder based on selObjs index 
			pickHelper.selectedObject = pickHelper.pickedObject;
			pickHelper.savedColor = pickHelper.selectedObject.material.color.getHex();
		
		}
		},1000/30);

		
	}

	canvas.addEventListener("mousedown", selectionHandler);
	canvas.addEventListener("mouseup", function(){clearInterval(ind)})

	 
	window.addEventListener('mousemove', setPickPosition);
	window.addEventListener('mouseout', clearPickPosition);
	window.addEventListener('mouseleave', clearPickPosition);

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

	}

	var viewer = document.createElement("div");
	//document.body.appendChild(viewer);
	
	var distInt;
	var notInDist = true;
	var jumpVel = 0;
	var first = true;
	var nu = 0;

	function render(time){

		if(first){
			
			if(sel1){
				rtM.uniforms.col1.value = new THREE.Vector3(sel1.material.color.r,sel1.material.color.g,sel1.material.color.b);
			}
			if(sel2){
				rtM.uniforms.col2.value = new THREE.Vector3(sel2.material.color.r,sel2.material.color.g,sel2.material.color.b);
			}
			renderer.setRenderTarget(renderTarget);
			renderer.render(rtScene, rtCamera);
			renderer.setRenderTarget(null);
			// if(nu>1){
			// 	first = false;
			// }
			// nu++;
			first = false;
		}


		time *= 0.001;

		if(freePosition){
		if(player){

			if(jumping){
				console.log(jumpVel,jumpAcc);
				jumpVel += jumpAcc*1;
				jumpAcc -= 0.2;
				if(jumpAcc <-0.2){jumpAcc = -0.2;}
				player.translateY(jumpVel/10);
			}
				
			if(player.position.y < -1.2){
				jumping = false;
				jumpAcc = 0;
				jumpVel = 0;
				player.position.y = -1.2;
			}

			
			

			var movFB = movF-movB;
			var movLR = movR-movL;
			playerRot.rotation.set(0,0,0);
			player.rotation.set(0,0,0);
			player.rotateOnWorldAxis(ya,-xmov/2000);
			playerRot.rotateOnAxis(xa,-ymov/2000);
			 player.translateZ(-movFB/10);
			 player.translateX(movLR/10);
			 if(Math.abs(player.position.x)>6.7){player.position.x -= Math.sign(player.position.x)*0.1;}
			 if(Math.abs(player.position.z-8)>7.7){player.position.z -= Math.sign(player.position.z-8)*0.1;}
			 if(easel){
			 var dist = Math.pow(Math.pow(player.position.x,2)+Math.pow(player.position.z-easel.position.z,2),0.5);
			 if(dist<4){
			 	if(notInDist){
			 		notInDist = false;
			 		xSigM.opacity = 1;
			 		distInt = setInterval(function(){
			 			xSigM.opacity -= 1/60;
			 			if(xSigM.opacity<=0){
			 				clearInterval(distInt);
			 			}
			 		},2000/60);

			 	}
			 } else {
			 	notInDist = true;
			 	//xSigM.opacity = 0;
			 }
			  
			 }
		}
		} else {
			

			if(sel1){
				rtM.uniforms.col1.value = new THREE.Vector3(sel1.material.color.r,sel1.material.color.g,sel1.material.color.b);
			}
			if(sel2){
				rtM.uniforms.col2.value = new THREE.Vector3(sel2.material.color.r,sel2.material.color.g,sel2.material.color.b);
			}

			renderer.setRenderTarget(renderTarget);
			renderer.render(rtScene, rtCamera);
			renderer.setRenderTarget(null);

			pickHelper.pick(pickPosition, scene2, camera2, time,selObjs);
			notInDist = true;
			xSigM.opacity = 0;
			// colM.opacity = 1;
			// Mat1.opacity = 1;
			// Mat2.opacity = 1;
		}
		if(player){
			viewer.innerText = player.position.x.toFixed(4) + ", " + player.position.y.toFixed(4) + ", " +player.position.z.toFixed(4)
			 + ";   "+ playerRot.rotation.x.toFixed(4) + ", " +player.rotation.y.toFixed(4) + ", " +playerRot.rotation.z.toFixed(4)+ ";; xFired " + xFired;
		}

		renderer.clear();
	 	renderer.render(scene,camera);
	 	renderer.clearDepth();
	 	renderer.render(scene2,camera2);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

main();