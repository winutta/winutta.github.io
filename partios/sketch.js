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
var attractVal = 0;
var trueW = 0;
var w = 0;
var h = 0;
var menu;
var mouseX = 0.5, mouseY = 0.5;
var velocities, positions;
var firstTouch;

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
	h = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
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

	positions = [];
	velocities = [];
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
		velocities.push(0.);
		velocities.push(0.);

	}

	
	/////
	//Creating Points Geometry, Shader Material, and Object
	/////

	geometry = new THREE.BufferGeometry();

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	geometry.setAttribute( 'i', new THREE.Float32BufferAttribute( indices, 1 ) );
	geometry.setDrawRange(0,997500);

	uniforms = {

		pointTexture: { value: new THREE.TextureLoader().load( "spark1.png" ) },
		iTime: {value: 0},
		particles: {value: particles},
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

	container.addEventListener('touchstart',setTouchAttract,false);
	window.addEventListener('touchmove',stopDefaultScroll,false);
	container.addEventListener('touchmove',updateTouchPos,false);
	container.addEventListener('touchend',setTouchNeutral,false);
	

	var resetButton = document.getElementById('reset');
	resetButton.addEventListener("click",resetSimulation,false);
	resetButton.addEventListener('touchstart',resetSimulation,false);

	var minimizeButton = document.getElementById('minimize');
	minimizeButton.addEventListener('click',minimizeInfo,false);
	minimizeButton.addEventListener('touchstart',minimizeInfo,false);

	menu = document.getElementById('startMenu');
	
	menuButton = document.getElementById('menuButton');
	menuButton.addEventListener('click',getInfo, false);
	menuButton.addEventListener('touchstart',getInfo,false);

	
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

function setTouchAttract(e){
	attract = true;
	if(e.touches.length == 1){
		firstTouch = e.touches[0].identifier;
		attractVal = 1;
		updateMousePos(e.touches[0]);
	} else if(e.touches.length >= 2){
		attractVal = -1;
	}
	
}

function setTouchNeutral(e){
	if(e.touches.length == 0){
		attract = false;
	} else if(e.touches.length == 1){
		firstTouch = e.touches[0].identifier;
		attractVal = 1;
		updateMousePos(e.touches[0]);
	}
	
}

function updateTouchPos(e){
	for(let i = 0; i<e.touches.length;i++){
		if(e.touches[i].identifier == firstTouch){
			updateMousePos(e.touches[0]);
		}
	}
}

function stopDefaultScroll(e){
	e.preventDefault();
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

	var positionVals = geometry.attributes.position.array;

	for(let i = 0;i<particles;i++){
		var stride = i*3;
		var velStride = i*2;

		positionVals[stride] = positions[stride];
		positionVals[stride + 1] = positions[stride + 1];

		velocities[velStride] = 0;
		velocities[velStride + 1] = 0;
	}

	geometry.attributes.position.needsUpdate = true;
}

function setNotDefault(e){
	e.preventDefault();
}

function setNeutral(e){
	attract = false;
	attractVal = 0;
}

function setAttract(e){
	attract = true;
	if(e.button == 0){
		attractVal = 1;
	} else if(e.button == 2 || e.isControlPressed()){
		attractVal = -1;
	}
	updateMousePos(e);
}

function updateMousePos(e){
	if(attract){
		// var mouseX = e.clientX/window.innerWidth;
		var wPortion = (w/trueW)*window.innerWidth;
		var zero = (window.innerWidth - wPortion)/2;
		mouseX = (e.clientX-zero)/wPortion;
		mouseY = 1.-e.clientY/window.innerHeight;
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(time) {
	requestAnimationFrame( animate );

	render(time);
}

function render(time) {
	
	shaderMaterial.uniforms.iTime.value = time;

	var positionVals = geometry.attributes.position.array;

	for (let i = 0; i< particles;i++){
		var stride = i*3.;
		var velStride = i*2;

		var mouseXPos = (mouseX -0.5)*w;
		var mouseYPos = (mouseY - 0.5)*h;

		var mouseMove = new THREE.Vector2(positionVals[stride] - mouseXPos,positionVals[stride+1] - mouseYPos);
		mouseMove.divide(new THREE.Vector2((w+h)/2,(w+h)/2));
		// mouseMove.x *= w/h;
		var mouseMoveLen = mouseMove.lengthSq();
		var useMouseMove = mouseMove.divideScalar(mouseMoveLen);
		useMouseMove.multiply(new THREE.Vector2((w+h)/2,(w+h)/2));


		var velX = velocities[velStride];
		var velY = velocities[velStride + 1];

		var posX = positionVals[stride];
		var posY = positionVals[stride + 1];


		velX += useMouseMove.x*-0.00005*attractVal;
		velY += useMouseMove.y*-0.00005*attractVal;

		velX *= 0.995;
		velY *= 0.995;


		posX += velX;
		posY += velY;


		if(posX > w/2.){
			velX  *= -1; 
			posX = w - posX;
		} else if(posX < -w/2.){
			velX  *= -1;
			posX = -w - posX;
		}

		if(posY > h/2){
			velY *= -1;
			posY = h - posY;
		} else if(posY < -h/2){
			velY *= -1;
			posY = -h - posY;
		}

		velocities[velStride] = velX;
		velocities[velStride + 1] = velY;

		positionVals[stride] = posX;
		positionVals[stride + 1] = posY;
	}

	geometry.attributes.position.needsUpdate = true;

	renderer.render( scene, camera2 );

}