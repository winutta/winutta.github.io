//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file

let N = 256;
let stride;
let xstride,ystride;
let vertices = [];
let indices = [];
let pMaterial;
let offsets = [];
let offScale = [];
let coord = new THREE.Vector2(0,0);
let particleList = [];
let offVel = [];
let offsetMax = [];
let speed = 0;

function main(){

	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(0x000000,1);// black background
	renderer.sortObjects = true;
	const scene = new THREE.Scene();


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
	const fov = 75;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 5;

	// const controls = new THREE.OrbitControls(camera, canvas);
	// controls.target.set(0, 0, 0);
	// controls.update();

	//Create objects/lights and add them to the scene here!
	// var url = "animals.png";
	// var url = "wave.png";
	// var url = "mosq.png";
	// var url = "shark.png";
	// var url = "giraffe.png";
	var url = "elephantCC.png";
	// var url = "dinoCC.png";
	// var url = "dinoCC2.png";
	// var url = "tree.png";
	// var url = "rhino.png";
	// var url = "gorillaCC.png";
	// var url = "dino.png"; //COOL
	// var url = "dog.png";
	// var url = "pug.png";
	// var url = "skeleton.png";
	// var url = "elephant.png";// beautiful to rotate
	// var url = "pumpkin.png"; //cool to rotate
	// var url = "girl.png"; //cool to rotate
	// var url = "face.jpeg";
	// var url = "barn.jpg";
	// var url = "arr.png"; //cool to rotate
	var texture = new THREE.TextureLoader().load( url, (t) =>{
		// console.log(pMaterial);
		// pMaterial.uniforms.pRes.value = new THREE.Vector2(texture.image.width,texture.image.height);
		t.minFilter = THREE.LinearFilter;
	// console.log(texture);
	//var imagedata = canvasgetImageData( texture.image );
	// var imagedata = texture.data;
	// console.log(imagedata);
	//texture.anisotropy = renderer.getMaxAnisotropy(); // may help with texture sharpness
	

	 var vFOV = camera.fov * Math.PI / 180;
	// Get the visible height 
	var h = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
	var w = h * aspect;

	var dimen = 0.;
	console.log(t.image.width/t.image.height,w/h);
	if(t.image.width/t.image.height > w/h){
		dimen = 1.;
	}
	console.log(dimen);



	var particleCount = N*N,
    particles = new THREE.BufferGeometry(),
    pMaterial = new THREE.ShaderMaterial({
        uniforms: {
                 iTime: { type: 'f', value: 0.0 },
                 res : {type: 'v2',value:new THREE.Vector2(window.innerWidth,window.innerHeight)},//Keeps the resolution
                 tex : {type: "t", value: t },
                 wh  : {type: 'v2', value: new THREE.Vector2(w,h)},
                 pRes: {type: "v2", value: new THREE.Vector2(t.image.width, t.image.height)},
                 dimen: {type: 'f', value: dimen},
                },
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
      transparent:true,
      blending: THREE.NormalBlending,
      depthWrite: false,

    });

    // console.log(pMaterial.uniforms.pRes.value);

   
	stride = w/(N-1);
	xN = N-1; // for almost filling screen
	yN = Math.floor(h/stride)+1; // for almost filling screen

	//for filling screen use i,j = 0 and xN = N, xN = Math.floor(h/stride)+1 (add one particle on each side)

	for(let i = 0; i<N*N;i++){
		var randX = Math.random()*w - w/2;
		var randY = Math.random()*h - h/2;

		var offX = (Math.random()*2.-1.)*w/10.;
		var offY = (Math.random()*2.-1.)*w/10.;

		offsetMax.push(new THREE.Vector2(offX,offY));
		offScale.push(0);
		offVel.push(0.);
		offsets.push(0);
		offsets.push(0);

		var particle = new THREE.Vector3(randX,randY,0);
		particleList.push(particle);
		vertices.push(particle.x);
		vertices.push(particle.y);
		vertices.push(particle.z);
		indices.push(i);
	}
	//   for (let i = 1; i < xN; i++) {
 //      for (let j = 1; j < yN; j++) {
	//   var pX = i*stride-w/2,
	//       pY = j*stride-h/2,
	//       pZ = 0,
	//       particle = new THREE.Vector3(pX, pY, pZ);
	//       vertices.push(pX);
	//       vertices.push(pY);
	//       vertices.push(pZ);
	// }}
	// }

	var verticesT = new Float32Array(vertices);
	particles.setAttribute( 'position', new THREE.BufferAttribute( verticesT, 3 ) );
	particles.setAttribute( 'i', new THREE.Float32BufferAttribute( indices, 1 ) );
	particles.setAttribute("pOff", new THREE.Float32BufferAttribute(offsets,2).setUsage( THREE.DynamicDrawUsage ));

	//var densT = new Float32Array(dens);
	
	//particles.setAttribute( 'density', new THREE.BufferAttribute( densT, 1 ) );


	// create the particle system
	var particleSystem = new THREE.Points(particles,pMaterial);
	scene.add(particleSystem);
	var timeout;

	document.addEventListener("mousemove", e =>{
		clearTimeout(timeout);
		timeout = setTimeout(()=> {speed = 0.},10);
		var x = e.clientX/window.innerWidth;
		x *= w;
		x -= w/2.;

		var y = e.clientY/window.innerHeight;
		y *= h;
		y -= h/2.;

		coord.x = x;
		coord.y = y;

		speed = (Math.sqrt(e.movementX*e.movementX + e.movementY*e.movementY))/15.;
		// console.log(speed);
	})

	// window.addEventListener( 'resize', onWindowResize, false );

	// function onWindowResize() {

	// camera.aspect = window.innerWidth / window.innerHeight;
	// camera.updateProjectionMatrix();

	// renderer.setSize( window.innerWidth, window.innerHeight );

	// }

	function render(time){
		time *= 0.01;

		pMaterial.uniforms.iTime.value = time;

		var pOffs = particles.attributes.pOff.array;

		for(let i = 0;i<N*N;i++){
			var stride = i*2;

			var part = particleList[i];
			var diff = new THREE.Vector2(coord.x-part.x,-coord.y-part.y);
			var dist = diff.length();

			// var move = -(0.2*(Math.pow(dist,0.5)-0.7))*speed;
			var move = Math.min(speed*speed,20)*Math.exp(-7*dist)/16;

			var px = pOffs[stride];
			var py = pOffs[stride + 1];

			var vel = offVel[i];

			var scale = offScale[i];

			vel += Math.max(move,-0.05);
			vel -= scale*0.02;

			if(vel > 0.08){
				vel = 0.08;
			}
			if(vel <-0.01){
				vel = -0.01;
			}

			offVel[i] = vel;

			scale += vel;

			if(scale >1){
				scale = 1;
			}
			if(scale <0){
				scale = 0;
			}

			offScale[i] = scale;

			var offMax = offsetMax[i];

			pOffs[stride] = scale*offMax.x;
			pOffs[stride + 1] = scale*offMax.y;
		}

		particles.attributes.pOff.needsUpdate = true;

		renderer.render(scene,camera);
		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
	} );

}

main();