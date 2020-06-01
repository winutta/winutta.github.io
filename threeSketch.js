//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file
let counter = 0;
let updateTime = true;
function main(){
	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	var width = document.body.scrollWidth;
	var height = document.body.scrollHeight;
	// console.log(document.body.scrollWidth,document.body.scrollWidth);
	renderer.setSize(width,height);
	renderer.setClearColor(0xE88D27,1);// a nice burnt orange color
	// const width = window.innerWidth;
	const scene = new THREE.Scene();

	const fov = 75;
	const aspect =  width/height;


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
			res: {value: new THREE.Vector2(width,height)},
			M: {value: new THREE.Vector2(0,0)}	
		},
		vertexShader: document.getElementById("vertShader").textContent,
		fragmentShader: document.getElementById("fragShader").textContent,
	});

	var clicking = false;
	window.addEventListener("mousedown",function(event){
		clicking = true;
		var x = event.pageX;
		var y = event.pageY;
		//console.log(x,y)

		planeM.uniforms.M.value = new THREE.Vector2(x,y);
	});

	window.addEventListener("mousemove",function(event){
		if(clicking){
		var x = event.pageX;
		var y = event.pageY;
		//console.log(x,y)

		planeM.uniforms.M.value = new THREE.Vector2(x,y);
		// console.log(x,y,planeM.uniforms.M.value);
		}
	});

	window.addEventListener("mouseup",function(event){
		clicking = false;
		planeM.uniforms.M.value = new THREE.Vector2(-10,-10);
	});



	const plane = new THREE.Mesh(planeG,planeM);
	plane.scale.set(w,h,1);
	scene.add(plane);
	document.body.onload = function(){
		var width = document.body.scrollWidth;
		var height = document.body.scrollHeight;
		renderer.setSize(width,height);
	};
	


	
	// document.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){
	var width = document.body.scrollWidth;
	var height = document.body.scrollHeight;
	// width = document.body.clientWidth;
	// console.log(document.body.clientWidth,document.body.scrollWidth);

	planeM.uniforms.res.value = new THREE.Vector2(width,height);
    	camera.aspect = width/height;
    	camera.updateProjectionMatrix();
	w = h*camera.aspect;
	plane.scale.set(w,h,1);
	// console.log(document.body.scrollHeight)
    renderer.setSize(width,height);

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
