//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file

function main(){
	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(0x000000,1);// a nice burnt orange color
	
	const scene = new THREE.Scene();

	const fov = 75;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 10;
	camera.position.y = 10;
	camera.position.x = -10;

	const controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.update();

	// var sceneTex = new THREE.TextureLoader().load("allbake4k.png");
	var sceneTex = new THREE.TextureLoader().load("denoiseAllBake.png");
	sceneTex.flipY = false; //need to make sure not to flipY (this now makes the texture correct!)
	sceneTex.minFilter = THREE.LinearFilter;
	// var centerL = new THREE.TextureLoader().load("cactusSide.png");
	// centerL.flipY = false; //need to make sure not to flipY (this now makes the texture correct!)
	// var centerR = new THREE.TextureLoader().load("cactusSide2.png");
	// centerR.flipY = false; //need to make sure not to flipY (this now makes the texture correct!)
	var smat = new THREE.ShaderMaterial({
		uniforms:{
			iTime: {value:1.0},
			tex: {value: sceneTex}
		},
		vertexShader: document.getElementById("vertexShader").textContent,
		fragmentShader: document.getElementById("fragmentShader").textContent
	});

	var mat = new THREE.MeshBasicMaterial({map:sceneTex});

	var colMat = new THREE.MeshBasicMaterial({color: new THREE.Color("rgb(235, 226, 206)")})

	const modelLoader = new THREE.GLTFLoader();
	modelLoader.load("scene.glb",
		function(gltf){
			var objectList = gltf.scene.children;
			console.log(objectList);

			// var mat = new THREE.MeshBasicMaterial({map:sceneTex});

			// var mat = new THREE.MeshPhysicalMaterial({
			// 	map:sceneTex,
			// 	roughness:0.42,
				
			// });

			for(var i = 0;i<objectList.length;i++){
				if(i==4){
					objectList[i].material = smat;
				}
				// else if(i==0){
				// 	objectList[i].material = colMat;
				// }
				else{
					objectList[i].traverse((obj)=>{
						obj.material = mat;
						console.log(obj.scale);
					});
				}
			}

			scene.add(gltf.scene);
			// var cactObj = gltf.scene.children[1];
			// var mat = new THREE.MeshBasicMaterial({map: cactus});
			// var mat = new THREE.MeshLambertMaterial({map:cactus});
			// var mat = new THREE.MeshPhysicalMaterial({
			// 	map:cactus,
			// 	// roughness:0.7,
				
			// });
			// cactObj.material = mat;
			// cactObj.position.set(0.,0.,0.);
			// cactObj.scale.divideScalar(3.);
			// scene.add(gltf.scene);
		})

	var ambLight = new THREE.AmbientLight(0x404040 ,2.);
	scene.add(ambLight);

	var pntLight = new THREE.PointLight(0x404040,1.);
	// pntLight.position.set(-1.,3.,1.);
	pntLight.position.set(-12.5,11.2,6.13);
	scene.add(pntLight);

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

	}
	
	function render(time){
		time *= 0.001;
		smat.uniforms.iTime.value = time;

		renderer.render(scene,camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

main();