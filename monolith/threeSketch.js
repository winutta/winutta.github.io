
function main(){
	const canvas = document.getElementById("c");
	
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;

	renderer.outputEncoding = THREE.sRGBEncoding;

	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor(0x000000,1);// a nice burnt orange color
	
	const scene = new THREE.Scene();

	const fov = 75;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 6;
	camera.position.y = 4;
	camera.lookAt(0,-2,0);


	///////Setup Complete
	

	//LoadTextures

	const manager = new THREE.LoadingManager();
	var loaded = false;
	const loadingScreen = document.getElementById( 'loading-screen' );
	const loadingPct = document.getElementById('progress');

	function onTransitionEnd( event ) {
		event.target.remove();
	}
	
	manager.onProgress = (url,itemsLoaded,itemsTotal) => {
			// console.log(url,itemsLoaded,itemsTotal);
			loadingPct.innerHTML = "Loaded " + (itemsLoaded/itemsTotal*100).toFixed(2) + "%";
	}

	manager.onLoad = () => {
		// console.log("finished Loading");
		loadingScreen.classList.add( 'fade-out' );
		loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

	}


	var textureLoader = new THREE.TextureLoader(manager);

	var normalGold = textureLoader.load("materials/gold_normal_1k.png");

	var loader = new THREE.CubeTextureLoader(manager);

	////Cubemap Textures sourced from Humus.name

	var names = [];
	var  affixes = [["pos","neg"],["x","y","z"]];
 
	for(var i = 0;i<3;i++){
		for(var j = 0;j<2;j++){
			names.push("materials/forestCubemap/"+affixes[0][j]+affixes[1][i]+".jpg");
		}
	}

	var textureCube = loader.load(names);
	textureCube.minFilter = THREE.LinearFilter;

	var mats = names.map(pic => {

		return new THREE.MeshBasicMaterial({map: textureLoader.load(pic),side        : THREE.DoubleSide});
	});

	//Monolith

    const cGeom = new THREE.CubeGeometry(1,1,1);
	var cMat = new THREE.MeshStandardMaterial( {
		metalness:1.,
		roughness:0.,
		envMap: textureCube,
		normalMap:normalGold} );

    const cube = new THREE.Mesh(cGeom,cMat);
    cube.position.set(0,-2.5,0);
    cube.scale.set(2,10,2);

    scene.add(cube);

    //Background Cube

    var cubeGeom = new THREE.BoxBufferGeometry(10,10,10,100,100,100);
    var positions = cubeGeom.getAttribute("position");

    for(var i = 0; i<positions.count;i++){
    	var x = positions.getX(i);
    	var y = positions.getY(i);
    	var z = positions.getZ(i);

    	var length = new THREE.Vector3(x,y,z).length();

    	x *= 10/length;
    	y *= 10/length;
    	z *= 10/length;

    	if(y<0){
    		y -= y*0.3;
    	}

    	positions.setXYZ(i,x,y,z);


    }

    var cubeMat = new THREE.MeshBasicMaterial({});
    var backgroundCube = new THREE.Mesh(cubeGeom,mats);
    scene.add(backgroundCube);
    backgroundCube.position.set(0,0,0);

    
    var hlight = new THREE.AmbientLight(0x404040,1);
	hlight.intensity = 0.5;

	scene.add(hlight);

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
	}

	const controls = new THREE.OrbitControls(camera, canvas);
	controls.maxPolarAngle = Math.PI*3/4.;
	controls.minDistance = 3.;
	controls.maxDistance = 8.;
	controls.enablePan = false;
	controls.target.set(0, 0, 0);
	controls.update();


	function render(time){

		renderer.render(scene,camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

main();