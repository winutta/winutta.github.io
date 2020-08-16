//To allow for ios usage maybe need to use

//document.body.clientWidth;
//document.body.clientHeight;

//compared to

//window.innerWidth;
//window.innerHeight;

var renderer, scene, camera, stats;

var particleSystem, uniforms, geometry;
var shaderMaterial;
var bufferMaterial;
var textureA , textureB;
var bufferScene;
var iF = 0;
var attract = false;
var trueW = 0;
var w = 0;
var menu;

var particles = 1000000;

init();
animate();

function init() {
	//////
	//Camera, Scene initialization
	//////

	var aspect = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera( 40, aspect, 1, 10000 );
	camera.position.z = 300;

	camera2 = new THREE.PerspectiveCamera( 40, aspect, 1, 10000 );
	camera2.position.z = 300;

	var vFOV = camera.fov * Math.PI / 180;
	var h = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
	w = h * aspect;
	trueW = w;
	//w = h;
	console.log(w,h);

	scene = new THREE.Scene();

	/////
	//Creating Renderer, Orbit Controller, adding scene canvas to div container
	/////

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	var container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );
	var canvas = renderer.domElement;

	// const controls = new THREE.OrbitControls(camera2, renderer.domElement);
	// controls.target.set(0, 0, 0);
	// controls.update();

	////////
	//Creating initial Position, Color, and Index data for points
	////////

	var radius = 10;

	var positions = [];
	var colors = [];
	var indices = [];

	var color = new THREE.Color();

	for ( var i = 0; i < particles; i ++ ) {

		var p = {x:0,y:0,z:0};

		var r = i/particles;

		p.x = Math.cos(r*Math.PI*2)*50;
		p.y = Math.sin(r*Math.PI*2)*50;
		p.z = 0;

		var theta = Math.random()*Math.PI*2;
		var r1 = Math.random();
		var phi = Math.acos(2*r1-1);
		r1 = Math.pow(Math.random(),1/3);
		var sinP = Math.sin(phi);
		var cosP = Math.cos(phi);
		var cosT = Math.cos(theta);
		var sinT = Math.sin(theta);
		var rx = r1 * sinP * cosT;
		var ry = r1 * sinP * sinT;
		var rz = r1 * cosP;

		var xval = rx * radius + p.x;
		var yval = ry * radius + p.y;
		var zval = rz * radius + p.z;

		positions.push(xval);
		positions.push(yval);
		positions.push(zval);

		color.setHSL( i / particles, 1.0, 0.5 );

		colors.push( color.r, color.g, color.b );
		indices.push(i);

	}

	////
	//Creating Render Targets
	////

	const rtWidth = 1000;
    const rtHeight = 1000;
	textureA = new THREE.WebGLRenderTarget(rtWidth, rtHeight,
		{
			magFilter: THREE.NearestFilter, 
			// minFilter: THREE.NearestFilter,
			// type: THREE.FloatType,
			type: THREE.HalfFloatType,
		});
	textureB = new THREE.WebGLRenderTarget(rtWidth, rtHeight,
		{
			magFilter: THREE.NearestFilter, 
			// minFilter: THREE.NearestFilter,
			// type: THREE.FloatType,
			type: THREE.HalfFloatType,
		});

	/////
	//Creating Points Geometry, Shader Material, and Object
	/////

	geometry = new THREE.BufferGeometry();

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	geometry.setAttribute( 'i', new THREE.Float32BufferAttribute( indices, 1 ) );
	geometry.setDrawRange(0,997500);

	uniforms = {

		pointTexture: { value: new THREE.TextureLoader().load( "spark1.png" ) },
		iTime: {value: 0},
		particles: {value: particles},
		positionTexture: {value: textureB.texture},
		sizes: {value: new THREE.Vector2(w,h)},

	};

	shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

		side: THREE.DoubleSide,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent: true,
		vertexColors: true

	} );

	particleSystem = new THREE.Points( geometry, shaderMaterial );

	scene.add( particleSystem );


	/////////
    //Creating Movement Buffer Plane, and Shader 
    /////////

	bufferScene = new THREE.Scene();

	bufferMaterial = new THREE.ShaderMaterial({
		uniforms: {
			iTime: {type: 'f', value: 0.},
			iFrame: {type: 'f', value: 0},
			tex : {type: "t", value: textureA.texture},
			res : {type: 'v2',value:new THREE.Vector2(rtWidth,rtHeight)},
			size: {type: 'v2',value:new THREE.Vector2(w,h)},
			// originalPos: {type: 't', value: originalPosTex},
			mousePos: { type: 'v2', value: new THREE.Vector2(0.5,0.5)},
			attract: {type: 'f', value: 0},
		},
		vertexShader: document.getElementById("vertShaderBuffer").textContent,
        fragmentShader: document.getElementById("fragShaderBuffer").textContent

	});

	var bufferGeometry = new THREE.PlaneBufferGeometry(w,h,1000,1000);
	bufferGeometry.setAttribute( 'posInit', new THREE.Float32BufferAttribute( positions, 3 ) );
	bufferGeometry.setAttribute( 'i', new THREE.Float32BufferAttribute( indices, 1 ) );
	
	var bufferObject = new THREE.Mesh(bufferGeometry,bufferMaterial);

	bufferScene.add(bufferObject);

	/////
	//Add audio for pushing and pulling
	/////

	

	/////
	//Creating Event Listeners
	/////

	window.addEventListener( 'resize', onWindowResize, false );
	container.addEventListener('mousedown',setAttract, false);
	container.addEventListener('mouseup',setNeutral,false);
	container.addEventListener('mousemove',updateMousePos, false)
	window.addEventListener('contextmenu',setNotDefault, false);

	var resetButton = document.getElementById('reset');
	resetButton.addEventListener("click",resetSimulation,false);

	var minimizeButton = document.getElementById('minimize');
	minimizeButton.addEventListener('click',minimizeInfo,false);
	menu = document.getElementById('startMenu');
	menuButton = document.getElementById('menuButton');
	menuButton.addEventListener('click',getInfo, false);

	
	// canvas.onclick = function() {
	//   // canvas.requestPointerLock();
	//   if (canvas.requestFullscreen) {
	// 	    canvas.requestFullscreen();
	// 	  } else if (canvas.mozRequestFullScreen) { /* Firefox */
	// 	    canvas.mozRequestFullScreen();
	// 	  } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	// 	    canvas.webkitRequestFullscreen();
	// 	  } else if (canvas.msRequestFullscreen) { /* IE/Edge */
	// 	    canvas.msRequestFullscreen();
	// 	  }
	// }

}

function getInfo(e){
	menuButton.style.display = "none";
	menu.style.display = "block"
}

function minimizeInfo(e){
	menu.style.display = "none";
	menuButton.style.display = "block";
}

function resetSimulation(e){
	// console.log('Clicked reset button');
	iF = 0;
	bufferMaterial.uniforms.iFrame.value = iF;
}

function setNotDefault(e){
	e.preventDefault();
}

function setNeutral(e){
	attract = false;
	bufferMaterial.uniforms.attract.value = 0;
}

function setAttract(e){
	console.log("clicked");
	attract = true;
	if(e.button == 0){
	bufferMaterial.uniforms.attract.value = 1;
	} else if(e.button == 2){
		bufferMaterial.uniforms.attract.value = -1;
	}
	updateMousePos(e);
}

function setRepel(e){
	attract = true;
	bufferMaterial.uniforms.attract.value = -1;
}

function updateMousePos(e){
	if(attract){
		// var mouseX = e.clientX/window.innerWidth;
		// console.log(trueW,w);
		var wPortion = (w/trueW)*window.innerWidth;
		// console.log(wPortion,window.innerHeight);
		var zero = (window.innerWidth - wPortion)/2;
		var mouseX = (e.clientX-zero)/wPortion;
		var mouseY = 1.-e.clientY/window.innerHeight;

		bufferMaterial.uniforms.mousePos.value = new THREE.Vector2(mouseX,mouseY);
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(time) {
	//time *= 0.001;
	requestAnimationFrame( animate );

	render(time);
}

function render(time) {
	
	shaderMaterial.uniforms.iTime.value = time;

	if(iF % 1 == 0){
	renderer.setRenderTarget(textureB);
    renderer.render(bufferScene,camera);
    renderer.setRenderTarget(null);

    var t = textureA;
    textureA = textureB;
    textureB = t;

    shaderMaterial.uniforms.positionTexture.value = textureB.texture;
	bufferMaterial.uniforms.tex.value = textureA.texture;
	
	
	}
	renderer.render( scene, camera2 );

	iF++;
	bufferMaterial.uniforms.iFrame.value = iF;

}