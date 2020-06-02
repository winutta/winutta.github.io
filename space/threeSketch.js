//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file


//Want to add environment map to this, but unsure how to do this yet!

let ru = 0, rl = 0;
let zvel = 0,zacc = 0,zoff = 0;
let ygrav;
let yacc = 0, yvel = 0, bu = 0;
let jumping = false;
let fired = false;
let stopped = false;
let boost = false;
let timeStart = 0, timeStop = 0,time_val = 0,delay = 0;
let mouse;
let xa,ya,za;
let xrot,yrot;
let angle;
let collidableMeshs = [];
let originPoint;
let hit = "nothing";
let ray = new THREE.Raycaster();
let stopper;
function wrapp(tex,numX,numY){
	tex.wrapS = THREE.RepeatWrapping;
	tex.wrapT = THREE.RepeatWrapping;
	tex.repeat.set( numX,numY);
}

function main(){
	const canvas = document.getElementById("c");

	xa = new THREE.Vector3(1,0,0);
	ya = new THREE.Vector3(0,1,0);
	za = new THREE.Vector3(0,0,1);
	//angle = new THREE.Vector3(0,0,1);

	mouse = new THREE.Vector3(0,0,1);
	canvas.addEventListener("mousemove", onDocumentMouseMove,false);

	function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.x *= window.innerWidth/window.innerHeight;
    //console.log(mouse);
	}



	canvas.addEventListener('click', function (event) {
		//console.log("hi");
	  if (canvas.requestFullscreen) {
		    canvas.requestFullscreen();
		  } else if (canvas.mozRequestFullScreen) { /* Firefox */
		    canvas.mozRequestFullScreen();
		  } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		    canvas.webkitRequestFullscreen();
		  } else if (canvas.msRequestFullscreen) { /* IE/Edge */
		    canvas.msRequestFullscreen();
		  }
	});

	
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;

	//

	renderer.outputEncoding = THREE.sRGBEncoding;

	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor(0xE88D27,1);// a nice burnt orange color
	
	const scene = new THREE.Scene();

	const fov = 56;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 13;
	camera.position.y = 4;
	camera.lookAt(0,0,0);

	var cubeCamera = new THREE.CubeCamera( 1, 100000, 128 );
	scene.add( cubeCamera );

	//Load textures

	
	var textureLoader = new THREE.TextureLoader();
	var golfN = textureLoader.load( "golfball.jpg" );
	var earthC = textureLoader.load( "earth.png" );
	var earthMap = textureLoader.load( "earthmap1k.jpg" );

	var stoneC = textureLoader.load( "stone/stoneC.png" );
	var stoneN = textureLoader.load( "stone/stoneN.png" );
	var stoneH = textureLoader.load( "stone/stoneH.png" );
	var stoneR = textureLoader.load( "stone/stoneR.png" );

	var ragH = textureLoader.load("ragH.png");
	var ragN = textureLoader.load("ragN.png");
	 var sunC = textureLoader.load( "gold.png" );
	 var sunR = textureLoader.load( "gold_rough.png" );

	 var terrain = textureLoader.load("terrainB.bmp")

	//var sunN = textureLoader.load( "gold_normal.png" );



	numX = 3;
	numY = 3;

	wrapp(stoneC,numX,numY);
	wrapp(stoneN,numX,numY);
	wrapp(stoneH,numX,numY);
	wrapp(stoneR,numX,numY);

	// earthC.wrapS = THREE.RepeatWrapping;
	// earthC.wrapT = THREE.RepeatWrapping;
	// earthC.repeat.set( numX,numY);

	// ragN.wrapS = THREE.RepeatWrapping;
	// ragN.wrapT = THREE.RepeatWrapping;
	// ragN.repeat.set( numX,numY);

	// ragH.wrapS = THREE.RepeatWrapping;
	// ragH.wrapT = THREE.RepeatWrapping;
	// ragH.repeat.set( numX,numY);

	// sunC.wrapS = THREE.RepeatWrapping;
	// sunC.wrapT = THREE.RepeatWrapping;
	// sunC.repeat.set( numX,numY);

	terrain.minFilter = THREE.LinearFilter;

	golfN.minFilter = THREE.LinearFilter;
	earthC.minFilter = THREE.LinearFilter;
	earthMap.minFilter = THREE.LinearFilter;

	// If texture is used for color information, set colorspace.
earthC.encoding = THREE.sRGBEncoding;

// UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
earthC.flipY = false;

	stoneC.minFilter = THREE.LinearFilter;
	stoneH.minFilter = THREE.LinearFilter;
	stoneN.minFilter = THREE.LinearFilter;
	stoneR.minFilter = THREE.LinearFilter;

	ragH.minFilter = THREE.LinearFilter;
	ragN.minFilter = THREE.LinearFilter;
	 sunC.minFilter = THREE.LinearFilter;
	 sunR.minFilter = THREE.LinearFilter;

	//sunN.minFilter = THREE.LinearFilter;

	var loader = new THREE.CubeTextureLoader();
	var textureCube = loader.load( [
	'stars/px.jpg', 'stars/nx.jpg',
	'stars/py.jpg', 'stars/ny.jpg',
	'stars/pz.jpg', 'stars/nz.jpg'
	] );
	textureCube.mapping = THREE.CubeReflectionMapping;



	var gLoader = new THREE.GLTFLoader();

	gLoader.load("mountain3k.glb",
		function(gltf){
			var model = gltf.scene;
			// console.log(model)
			var newMat = new THREE.MeshStandardMaterial({side : THREE.DoubleSide,map: stoneC,
				// displacementMap:stoneH,displacementScale:0.02,
			});
			model.traverse((o) => {
				if (o.isMesh){
				o.material = newMat;
				var me = o.clone();
				me.position.set(0,-200,0);
				me.scale.set(400,400,400)	
				//me.rotation.x = Math.PI;			
				scene.add(me);
				collidableMeshs.push(me);
				}
			});
			// console.log(model.children[0]);
			// scene.add(model.children[0]);


			// console.log(model.children);
			// var mobj = model.children[0];
			// console.log(mobj);
		
			//  //var mountainObj = model.children[0].children;
			//  console.log(mobj.children.length);
			//  for(let i = 0; i< model.children.length;i++){
			//  	for(let j = 0; j< model.children[i].children.length;j++){

			//  	model.children[i].children[j]
			//  	//mountainObj.children[i].position.set(4,0,0);
			//  	model.children[i].children[j].position.set(4,0,0);
			//  	model.children[i].children[j].scale.set(4,4,4);
			//  	scene.add(model.children[i].children[j]);
			//  }
			//  }

			 //scene.add(mountainObj.children[0]);
			//mountainObj.material = newMat;
			// mountainObj.position.set(4,0,0);
			//mountainObj.material.side = THREE.DoubleSide;
			//mountainObj.scale.set(10,10,4);
			// scene.add(mountainObj);
			// collidableMeshs.push(mountainObj);
		},
		function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	function ( error ) {

		console.log( 'An error happened' );

	});
	
    //p.add(camera);

	const earthG = new THREE.SphereGeometry(1, 100, 100);
	var earthM = new THREE.MeshPhysicalMaterial( {
								metalness: 0.0,
								roughness: 0.1,
								clearcoat: 1.0,
								map: stoneC,
								normalMap: stoneN,
								//normalScale: new THREE.Vector2( 0.15, 0.15 ),
								displacementMap: stoneH,
								displacementScale: 0.2,
								roughnessMap: stoneR,
								//clearcoatNormalMap: normalMap4,
								//envMap: textureCube,
								//envMap: cubeCamera.renderTarget.texture,

								// y scale is negated to compensate for normal map handedness.
								clearcoatNormalScale: new THREE.Vector2( 2.0, - 2.0 )
							} );
    //const parMat = new THREE.MeshPhongMaterial({});
    const earth = new THREE.Mesh(earthG,earthM);
    earth.position.set(0,0,0);


    
    const g1 = new THREE.SphereGeometry(0.1, 3, 3);
    const m1 = new THREE.MeshPhongMaterial({});
    const p1 = new THREE.Mesh(g1,m1);
    p1.position.set(0,0,0);
    //parSphere.visible = false;
    scene.add(p1);

    const xG = new THREE.Geometry();
    xG.vertices.push(
    	new THREE.Vector3(0,0,0),
    	new THREE.Vector3(3,0,0)
    	);
    const xM = new THREE.LineBasicMaterial({color: "blue"});
    const xL = new THREE.LineSegments(xG,xM);

    const yG = new THREE.Geometry();
    yG.vertices.push(
    	new THREE.Vector3(0,0,0),
    	new THREE.Vector3(0,3,0)
    	);
    const yM = new THREE.LineBasicMaterial({color: "red"});
    const yL = new THREE.LineSegments(yG,yM);

    const zG = new THREE.Geometry();
    zG.vertices.push(
    	new THREE.Vector3(0,0,0),
    	new THREE.Vector3(0,0,3)
    	);
    const zM = new THREE.LineBasicMaterial({color: "green"});
    const zL = new THREE.LineSegments(zG,zM);

    p1.add(xL);
    p1.add(yL);
    p1.add(zL);

    p1.add(earth);

    p1.add(camera);

    const sunG = new THREE.SphereGeometry(0.7, 320, 320);
   // var sunM = new THREE.MeshStandardMaterial( { color: 0xffcc88,normalMap:sunN, envMap: textureCube,metalness:0.9,roughness:0.05} );
	var sunM = new THREE.MeshPhysicalMaterial( {
								metalness: 1,
								//roughness: 0.05,
								clearcoat: 1.0,
								//emissive: "yellow",
								//emissiveIntensity: 0.2,
								//clearcoatRoughness: 0.1,
								//reflectivity: 1,
								//refractionRatio: 1.5,
								//combine: THREE.MixOperation,
								map: sunC,
								//normalMap: sunN,
								roughnessMap:sunR,
								//metalnessMap:sunR,
								//normalScale: new THREE.Vector2( 0.15, 0.15 ),
								//clearcoatNormalMap: sunN,
								envMap: textureCube,
								//envMap: cubeCamera.renderTarget.texture,

								// y scale is negated to compensate for normal map handedness.
								clearcoatNormalScale: new THREE.Vector2( 2.0, - 2.0 )
							} );
    //const parMat = new THREE.MeshPhongMaterial({});
    const sun = new THREE.Mesh(sunG,sunM);
    sun.position.set(0,0,0);
    
    const g2 = new THREE.SphereGeometry(0.1, 32, 32);
    const m2 = new THREE.MeshPhongMaterial({});
    const p2 = new THREE.Mesh(g2,m2);
    p2.position.set(0,0,0);
    //parSphere.visible = false;
    p1.add(p2);

    p2.add(sun);

    //Sphere golf ball
	const golfG = new THREE.SphereGeometry(0.5, 320, 320);
	var golfM = new THREE.MeshPhysicalMaterial( {
								metalness: 0.0,
								roughness: 0.1,
								clearcoat: 1.0,
								normalMap: golfN,
								//clearcoatNormalMap: normalMap4,
								//envMap: textureCube,
								//envMap: cubeCamera.renderTarget.texture,

								// y scale is negated to compensate for normal map handedness.
								clearcoatNormalScale: new THREE.Vector2( 2.0, - 2.0 )
							} );
    //const parMat = new THREE.MeshPhongMaterial({});
    const golf = new THREE.Mesh(golfG,golfM);
    golf.position.set(0,0,0);


    //Parent to sphere
    const g = new THREE.SphereGeometry(0.1, 32, 32);
    const m = new THREE.MeshPhongMaterial({});
    const p = new THREE.Mesh(g,m);
    p.position.set(0,0,0);
    //parSphere.visible = false;
    p1.add(p);

    p.add(golf);

    //scene.environment = textureCube;
    scene.background = textureCube;

	const parGeom = new THREE.SphereGeometry(0.1, 32, 32);
    const parMat = new THREE.MeshPhongMaterial({transparent:true,opacity:0});
    const parSphere = new THREE.Mesh(parGeom,parMat);
    parSphere.position.set(0,0,0);
    //parSphere.visible = false;
    scene.add(parSphere);

    //parSphere.add(cube)
    //console.log(terrain);

    const planeG = new THREE.PlaneGeometry(100,100,32,32);
    const planeM = new THREE.MeshStandardMaterial({side: THREE.DoubleSide,map: terrain, displacementMap: terrain, displacementScale: 15});
    const plane = new THREE.Mesh(planeG,planeM);
    plane.position.set(0,-2,0);
    plane.rotateX(Math.PI/2);
    //scene.add(plane);

    //collidableMeshs.push(plane);

    
	hlight = new THREE.AmbientLight(0x404040,1);
	hlight.intensity = 1;

	scene.add(hlight);

	const ballG = new THREE.SphereGeometry(5,32,32);
	const ballM = new THREE.MeshPhongMaterial({color: "red"});
	const ballObj = new THREE.Mesh(ballG,ballM)
	ballObj.position.set( -80, 0, 0 );
	parSphere.add(ballObj);

    var light = new THREE.PointLight( 0x404040, 1, 1000 );
    //light.position.set( -80, 0, 0 );
    light.intensity = 4;
	ballObj.add(light);

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

	}

	// const controls = new THREE.OrbitControls(camera, canvas);
	// controls.target.set(0, 0, 0);
	// controls.update();

	document.addEventListener('keydown',function(event){
    	if(event.keyCode == 87){
    		ru = -1;
    	} else if (event.keyCode == 83){
    		ru = 1; 
    	}else if (event.keyCode == 65){
    		rl = Math.PI/40;
    	}else if (event.keyCode == 68){
    		rl = -Math.PI/40;
		}else if (event.keyCode == 32){
			if(!fired){
				if(!stopped){
					timeStop = performance.now();
				}else{
					//timeStart = performance.now();
					delay += performance.now()-timeStop;
				}

				//console.log(time_val,timeStop,timeStart);
				stopped = !stopped;
				fired = true;
				
				//console.log(performance.now());
			}
			// if(!jumping){
			// 	jumping = true;
			// 	bu = 3;
			// }
			// setTimeout(function(){ bu = 0; }, 10);
			// //
		} else if (event.keyCode == 16){
			boost = true;
		}
    	
    });

    document.addEventListener('keyup',function(event){
    	if(event.keyCode == 87){
    		ru = 0;
    	} else if (event.keyCode == 83){
    		ru = 0; 
    	}else if (event.keyCode == 65){
    		rl = 0;
    	}else if (event.keyCode == 68){
    		rl = 0;
		}else if (event.keyCode == 32){
			fired = false;
			//bu = 0;
			//setTimeout(function(){ bu = 0; }, 3000);
		}else if (event.keyCode == 16){
			boost = false;
		}
    });

    function clamp(val,min,max){
    	return Math.min(Math.max(min, val), max)
    }


    class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(scene, camera, time,meshList,obj) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

	const originPoint = obj.position.clone();
	//const dirV = {vec: 0};
	const push = {x:0,y:0,z:0};
	const hit = {nothit:true};
	const startVal = 4
	const closeness = {val:startVal};
	stopper = false;
	for (var vertexIndex = 0; vertexIndex < obj.geometry.vertices.length; vertexIndex++)
	{       
		//if(vertexIndex = 0) hit = " hit";

	    var localVertex = obj.geometry.vertices[vertexIndex].clone();
	    var globalVertex = localVertex.applyMatrix4( obj.matrix );
	    var directionVector = globalVertex.sub( obj.position );
	    this.raycaster.set(originPoint,directionVector.clone().normalize());

	    // get the list of objects the ray intersected
	    //const intersectedObjects = this.raycaster.intersectObjects(scene.children);
	    const intersectedObjects = this.raycaster.intersectObjects(meshList);
	    if (intersectedObjects.length) {
	      // pick the first object. It's the closest one
	      if(intersectedObjects[0].distance < closeness.val && hit.nothit){
	      hit.nothit = false;
	      closeness.val = intersectedObjects[0].distance;
	      this.pickedObject = intersectedObjects[0].object;
	      //dirV.vec = directionVector;
	      stopper = true;
	      push.x = -directionVector.clone().normalize().x*(startVal-closeness.val+0.005);
	      push.y = -directionVector.clone().normalize().y*(startVal-closeness.val+0.005);
	      push.z = -directionVector.clone().normalize().z*(startVal-closeness.val+0.005);
	      // push.x = clamp(directionVector.clone().x-1,-1,0);
	      // push.y = clamp(directionVector.clone().y-1,-1,0);
	      // push.z = clamp(directionVector.clone().z-1,-1,0);
  		  }
	    }
	  }



	      
	      // obj.translateY(-directionVector.y);
	      // obj.translateZ(-directionVector.z);
	      
	      if(this.pickedObject){
	      // save its color
	      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
	      // set its emissive color to flashing red/yellow
	      this.pickedObject.material.emissive.setHex(0x0000FF);
	  		}


		  obj.position.x += push.x;
		  obj.position.y += push.y;
		  obj.position.z += push.z;
	}
	}

	const pickHelper = new PickHelper();

	function render(time){

		pickHelper.pick(scene,camera,time,collidableMeshs,p1);

		// document.getElementById("info").innerHTML = "Mouse X: "+mouse.x.toPrecision(2).toString()+
		// ", Mouse Y: "+mouse.y.toPrecision(2).toString() +
		//  "<br/>" + 
		//  "Rot X: " + p1.rotation.x.toPrecision(2).toString()+ 
		//  ", Rot Y: " + p1.rotation.y.toPrecision(2).toString()+
		//  ", Rot Z: " + p1.rotation.z.toPrecision(2).toString()+
		//  "<br/>" + stopper;
		//  ;
		if(parSphere){
			parSphere.rotateY(Math.PI/400);

			//parSphere.translateZ(ru);

			//parSphere.position.set(Math.sin(time/1000)*1,1,0);
			//var val = Math.abs(Math.sin(time*0.001));
			//var val = 0.0;
			//parSphere.material.clearcoat = val
		}

			//if(boost) ru-=1.01;
			zacc = ru/20;
			zvel += zacc;
			zvel *= 0.95;
			// console.log(boost);
			

		if(p){
						//p.translateZ(zvel);
			//console.log(timeStart-timeStop,delay);
			//if(!stopped){
			//time_val = time-delay;
			time_val += zvel*100;
			
			p.position.set(Math.sin(time_val/500)*3,-Math.sin(time_val/500)*3,-Math.cos(time_val/500)*2);
			//}
			golf.rotateX(zvel/2);

			//camera.rotateX(-Math.PI/10);

			p.rotateY(rl);
		}

		if(p2){
			//if(!stopped){
			off = Math.PI/2;

			p2.position.set(-Math.sin(time_val/500+off)*3,-Math.sin(time_val/500+off)*3,Math.cos(time_val/500+off)*2);
			//}
			sun.rotateX(zvel/2);

			//camera.rotateX(-Math.PI/10);

			p2.rotateY(rl);
		}

		if(p1){
			if(!stopped){
				// console.log(p1.rotation);
			// p1.rotation.z = Math.PI/2;	


			//p1.lookAt(mouse.x+p1.position.x,-mouse.y-p1.position.y,-1);

			 //behaving strangle, may need to use quaternions
			 // yrot = Math.acos(mouse.x/2)*4- 4*Math.PI/2;
			 // xrot = -Math.acos(mouse.y/2)*4+ 4*Math.PI/2;
			 
			 //p1.rotateOnWorldAxis(xa,mouse.y/100);
			//p1.rotateOnWorldAxis(ya,-mouse.x/100);
			 p1.rotateOnAxis(xa,mouse.y/50);
			 p1.rotateOnAxis(ya,-mouse.x/80);
			 //p1.rotateOnAxis(za,-mouse.x/80);
			 p1.rotateOnAxis(za,rl/5)
			 // p1.rotation.y = Math.acos(mouse.x/2)*4- 4*Math.PI/2;
			 // p1.rotation.x = -Math.acos(mouse.y/2)*4+ 4*Math.PI/2;
			//p1.translateX(mouse.x/10);
			//p1.translateY(mouse.y/10);

			p1.translateZ(1/2*zvel);
			}
		}
		

		// golf.visible = false;
		// cubeCamera.position.copy( golf.position );
		// cubeCamera.update( renderer, scene );
		// golf.visible = true;

		renderer.render(scene,camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

main();
