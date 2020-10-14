//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file
let zOff = 0;
let ru = 0;
let fired = false;
let bars = [];
let level;
//let levels = [0,0.01,0.02,0.04,0.08,0.1];;
function main(){
	const canvas = document.getElementById("c");
	canvas.addEventListener('keydown', function (event) {
		console.log("hi");
		if (event.keyCode === 32) {
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
	 
	});
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(0xE88D27,1);// a nice burnt orange color
	renderer.autoClear = false;
	const scene = new THREE.Scene();
	const scene2 = new THREE.Scene();

	const fov = 75;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 20;

	const camera2 = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera2.position.z = 20;




	//Create objects/lights and add them to the scene here!

	const geometry = new THREE.SphereGeometry(5,32,32);

	var diffTexture = new THREE.TextureLoader().load( 'earthmap1k.jpg' );
	diffTexture.minFilter = THREE.LinearFilter;
	var bumpTexture = new THREE.TextureLoader().load( 'earthbump1k.jpg' );
	bumpTexture.minFilter = THREE.LinearFilter;
	var specTexture = new THREE.TextureLoader().load( 'earthspec1k.jpg' );
	specTexture.minFilter = THREE.LinearFilter;

 	const material = new THREE.MeshPhongMaterial({map: diffTexture,bumpMap: bumpTexture,bumpScale:0.15,specularMap:specTexture});

    const sphere = new THREE.Mesh(geometry,material);
    sphere.position.set(0,0,0);
    sphere.rotateZ(0.4);
    
    scene.add(sphere);
    

    const cloudGeom = new THREE.SphereGeometry(5.1, 32, 32);
    const cloudMat = new THREE.MeshPhongMaterial({
		  map     : new THREE.TextureLoader().load('earthcloudmap.jpg'),
		  side        : THREE.DoubleSide,
		  opacity     : 0.0,
		  transparent : true,
		  depthWrite  : false,
		});
	var cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);

	scene.add(cloudMesh);
	

	var starTexture = new THREE.TextureLoader().load('galaxy_starfield.png');
	starTexture.minFilter = THREE.LinearFilter;



	const starGeom = new THREE.SphereGeometry(90, 32, 32);

	//Change to shadermaterial

	const starMat = new THREE.MeshBasicMaterial({
		map: starTexture,
		side: THREE.BackSide,
	});

  //   const starMat = new THREE.MeshPhongMaterial({
		//   map     : starTexture,
		//   side        : THREE.BackSide,
		//   lights: false
		// });
	var starMesh = new THREE.Mesh(starGeom, starMat);
	
	scene.add(starMesh);
	


	
    

    const parGeom = new THREE.SphereGeometry(0.1, 32, 32);
    const parMat = new THREE.MeshPhongMaterial({});
    const parSphere = new THREE.Mesh(parGeom,parMat);
    parSphere.position.set(0,0,0);
    //parSphere.rotateZ(0.4);
    //parSphere.rotateZ(2);
    //parSphere.rotateX(3);
    scene.add(parSphere);

    
	hlight = new THREE.AmbientLight(0x404040,1);
	hlight.intensity = 0.5;

	scene.add(hlight);
    var light = new THREE.PointLight( 0x404040, 1, 1000 );
    light.position.set( -80, 0, 0 );
    light.intensity = 7;
	parSphere.add(light);
	//scene2.add(light);
	//Try a spot light

	// var slight = new THREE.SpotLight(0x404040, 1, 100);
	// slight.position.set( 90, 0, 0 );
	// slight.intensity = 50;
	// slight.angle = Math.PI/4;
	// parSphere.add(slight);

    // var dlight = new THREE.DirectionalLight( 0x404040, 0.5 );
   	// dlight.position.set( 80, 0, 0 );
   	// // dlight.target.position.set(0,0,0);
    // dlight.intensity = 2;
    // parSphere.add(dlight);


    // Convert the field of view to radians 
	var vFOV = camera2.fov * Math.PI / 180;

	// Get the visible height 
	var h = 2 * Math.tan( vFOV / 2 ) * 20;

	// If we want a width that follows the aspect ratio of the camera, then get the aspect ratio and multiply by the height.
	var as = window.innerWidth / window.innerHeight;
	var w = h * as;

    const orthScene = new THREE.Scene();
    var nBars = 6;
    level = nBars;
    console.log(level);
     for(let i = 0; i< nBars; i++){
     	var bright = Math.floor(i/(nBars-1)*100).toString();
	    var color = new THREE.Color("hsl(44, 100%, "+bright+"%)");
	    var pGeom = new THREE.PlaneGeometry( w,h, 320 );
	    var bMaterial = new THREE.MeshBasicMaterial({color: color, transparent:true});
	    var plane = new THREE.Mesh(pGeom,bMaterial);
	    orthScene.add(plane);
	    plane.geometry.scale(0.075,(1/nBars)*0.5,0.1);
	    plane.position.set((w*0.775)/2,-h/2+(1/nBars)*0.5*h/2+h*0.2 + (h*i/nBars)*0.5,0);

	    // if(i>){
	    // 	plane.material.opacity = 0.0;
	    // }
	    bars.push(plane);
	    //plane.position.set(0,0,0);

		// var spriteMaterial = new THREE.SpriteMaterial( {  color: color } );
	 //    var rectG = new THREE.Sprite(spriteMaterial);
	 //    orthScene.add(rectG);
	 //    rectG.scale.set(1,1,1);
	 //    rectG.position.set(0,i*2,0);
	}



    //scene.add( light );


    document.addEventListener('keydown',function(event){
    	if(!fired){
    		fired = true;
    	if(event.keyCode == 87){
    		ru = Math.PI/20;
    	} else if (event.keyCode == 83){
    		ru = -Math.PI/20; 
    	}
    	}
    });

    document.addEventListener('keyup',function(event){
    	fired = false;
    	if(event.keyCode == 87){
    		ru = 0;
    	} else if (event.keyCode == 83){
    		ru = 0;
    	}
    });

    window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

	}

	document.getElementById("up").addEventListener("click",function(){
		//console.log(levels[level]);
		level += 1;
		if(level>nBars-1){
			level = nBars-1;
		}
	});

	document.getElementById("down").addEventListener("click",function(){
		//console.log(levels[level]);
		level -= 1;
		if(level<0){
			level = 0;
		}
	});


    const controls = new THREE.OrbitControls(camera, canvas);
	controls.target.set(0, 0, 0);
	controls.update();

	

	function render(time){
		zOff += ru;
		if(zOff >Math.PI/2){
			zOff = Math.PI/2;
		} else if(zOff < 0){
			zOff = 0;
		}

		if(sphere){
			sphere.rotateY(0.004);
			// var sc = (Math.sin(time/1000)+2)/2;
			// sphere.scale.set(sc,sc,sc);
		}
		if(cloudMesh){
			cloudMesh.rotateY(0.005);
		}
		if(parSphere){
			//parSphere.rotateZ(Math.sin(time/10000)/10);
			
			//console.log(zOff);
			//parSphere.rotateY(0.002)

			//parSphere.rotateZ(levels[level]);
			parSphere.rotateZ((0.15/nBars)*level);
			//parSphere.rotateZ(0.08);
			//parSphere.rotateZ(Math.sin(zOff)/5);
			//parSphere.rotateX(0.02);
		}

		for(let i = 0; i<bars.length;i++){
			if(i<=level){
				bars[i].material.opacity = 1;
			}else{
				bars[i].material.opacity = 0;
			}

		}


		renderer.clear();
		renderer.render(scene,camera);
		renderer.clearDepth();
		renderer.render(orthScene,camera2);
		
		

		

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

main();