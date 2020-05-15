//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file
let counter = 0;
let updateTime = true;
function main(){
	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xE88D27,1);// a nice burnt orange color
	const width = window.innerWidth;
	const scene = new THREE.Scene();

	const fov = 75;
	const aspect =  window.innerWidth/window.innerHeight;

	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 2;

	var vFOV = camera.fov * Math.PI / 180;
	var h = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
	var w = h * aspect;

	const planeG = new THREE.PlaneGeometry(1,1,32);
	const planeM = new THREE.ShaderMaterial({
		uniforms: {
			iTime: {type: 'f', value: 0.0},
			res: {value: new THREE.Vector2(window.innerWidth,window.innerHeight)}	
		},
		vertexShader: document.getElementById("vertShader").textContent,
		fragmentShader: document.getElementById("fragShader").textContent,
	});

	const plane = new THREE.Mesh(planeG,planeM);
	plane.scale.set(w,h,1);
	scene.add(plane);
	
	document.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){

	planeM.uniforms.res.value = new THREE.Vector2(window.innerWidth,window.innerHeight);
    	camera.aspect = window.innerWidth / window.innerHeight;
    	camera.updateProjectionMatrix();
	w = h*camera.apect;
	plane.scale.set(w,h,1);

    renderer.setSize( window.innerWidth, window.innerHeight );

	}





	//Create objects/lights and add them to the scene here!

	function render(time){
		if(updateTime){
			planeM.uniforms.iTime.value = time;
		}
		renderer.render(scene,camera);
		counter++;
		requestAnimationFrame(render);
	}
	setInterval(function(){
		if(counter <30){
			updateTime = false;
		} else{
			updateTime = true;
		}
		//console.log(counter,updateTime);
		counter = 0;

	},1000);

	requestAnimationFrame(render);


}

main();
