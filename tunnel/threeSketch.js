//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file

function main(){



	///Canvas and Renderer
	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(0x000000,1);// a nice burnt orange color
	///

	///fullscreen for recording

	canvas.onclick = function() {
	  // canvas.requestPointerLock();
	  if (canvas.requestFullscreen) {
		    canvas.requestFullscreen();
		  } else if (canvas.mozRequestFullScreen) { /* Firefox */
		    canvas.mozRequestFullScreen();
		  } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		    canvas.webkitRequestFullscreen();
		  } else if (canvas.msRequestFullscreen) { /* IE/Edge */
		    canvas.msRequestFullscreen();
		  }
	}

	///Scene, Camera, and Controls.
	const scene = new THREE.Scene();

	const fov = 75;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.001;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 1;

	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.update();
	///

	///Particle (point) System
	var particles = 1000000;
	// var radius = 0.02;

	positions = [];
	var colors = [];
	var indices = [];

	var color = new THREE.Color();

	for ( var i = 0; i < particles; i ++ ) {

		var p = {x:0,y:0,z:0};

		var r = i/particles;

		var a = Math.random()*2*Math.PI;

		p.x = Math.cos(a);
		p.y = Math.sin(a);
		p.z = r;

		// var v = Math.exp(-5*r)*2;
		var v = Math.pow(r-1,6)*2;

		var xval = p.x*v;
		var yval = p.y*v;
		var zval = p.z;

		positions.push(xval);
		positions.push(yval);
		positions.push(zval);

		color.setHSL( i / particles, 1.0, 0.5 );
		colors.push( color.r, color.g, color.b );

		indices.push(i);
	}

	geometry = new THREE.BufferGeometry();

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
	geometry.setAttribute( 'i', new THREE.Float32BufferAttribute( indices, 1 ) );

	uniforms = {

		pointTexture: { value: new THREE.TextureLoader().load( "spark1.png" ) },
		iTime: {value: 0},
		xoff: {value: 0},
		// particles: {value: particles},
		// positionTexture: {value: textureB.texture},
		// sizes: {value: new THREE.Vector2(w,h)},
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

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

	}

	// window.addEventListener('mousedown', accelerate,false);
	// window.addEventListener('contextmenu',preventDef, false);
	// window.addEventListener('mouseup', stopAcc, false);
	var vel = 0;
	var pos = 0;
	var decay = 1;
	var acc = 0;

	function preventDef(e){
		e.preventDefault();
	}
	function accelerate(e){
		console.log("changing vel");
		decay = 1;
		if(e.button == 0){
			acc = 0.1;
			// if(vel >1000){
			// 	vel = 1000;
			// }
		} else if(e.button == 2){
			acc = -0.1;
			// if(vel < -1000){
			// 	vel = -1000;
			// }
		}
	}

	function stopAcc(e){
		acc = 0;
		decay = 0.9;
	}

	function updatePos(time){
		acc = Math.sin(time/25.2)/15.;
		vel += acc;
		if(vel >0.8){
			vel = 0.8;
		}
		if(vel < -1.){
			vel = -1.;
		}
		vel *= decay;
		pos += vel;
	}

	
	function render(time){
		time *= 0.01;
		
		updatePos(time);
		var zval = 1 + 0.2*(Math.sin(time/5.)+1)/2;
		camera.position.set(Math.cos(time/25)/10,Math.sin(2*time/25)/10,zval);
		camera.lookAt(new THREE.Vector3(0,0,0));

		shaderMaterial.uniforms.iTime.value = time;
		shaderMaterial.uniforms.xoff.value = pos;

		renderer.render(scene,camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

main();