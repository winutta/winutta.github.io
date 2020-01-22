

 
function main() {
  let boxe,mixer,fileAnimations;
  let clock = new THREE.Clock()
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  renderer.setClearColor("#e5e5e5");
  renderer.setSize( window.innerWidth, window.innerHeight );
  const fov = 75;
  const aspect = window.innerWidth/window.innerHeight;  // the canvas default
  const near = 0.1;
  const far = 20000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 20;
  

	
  const scene = new THREE.Scene();
  
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
  
  
  const cube = new THREE.Mesh(geometry, material);
  
  //scene.add(cube);

  hlight = new THREE.AmbientLight(0x404040,100);
  scene.add(hlight);
	
  var loader = new THREE.GLTFLoader();

  loader.load("bounceBox.glb",function(gltf){
	  
	boxe = gltf.scene.children[0];
	fileAnimations = gltf.animations;
	  
	
	//boxe.name = “body”;
	boxe.rotation.set ( 0, -1.5708, 0 );
	boxe.scale.set (5,5,5);
	boxe.position.set ( 0, 3.6, 0 );
	boxe.castShadow = true;
	
	scene.add(boxe);
	  
	mixer = new THREE.AnimationMixer(boxe);
	let idleAnim = THREE.AnimationClip.findByName(fileAnimations,'Bounce');
	let idle = mixer.clipAction(idleAnim);
	idle.play();
	  
	console.log("trying glb at z = 20 along with the mixer");
      //bus.frame.add(bus.body);
	//gltf.scene.traverse(function (child) {
	
//     gltf.scene.scale.set( 2, 2, 2 );			   
// 	   gltf.scene.position.x = 0;				    //Position (x = right+ left-) 
//     gltf.scene.position.y = 0;				    //Position (y = up+, down-)
// 	   gltf.scene.position.z = 0;
//     scene.add(gltf.scene);
//    console.log("Resizing and repositioning scene!");
    //console.log(gltf.scene,gltf.scenes,gltf.animations,gltf.asset,gltf.cameras);
    // gltf.animations; // Array<THREE.AnimationClip>
    // gltf.scene; // THREE.Scene
    // gltf.scenes; // Array<THREE.Scene>
    // gltf.cameras; // Array<THREE.Camera>
    // gltf.asset; // Object


    },
    function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
  // called when loading has errors
    function ( error ) {

      console.log( error );

    }
  );
  
  
  function render(time) {
    if (mixer) {
	mixer.update(clock.getDelta());    
    }
    time *= 0.001;

    //cube.rotation.x = time;
    cube.rotation.y = time;
    
    renderer.render(scene,camera);

    requestAnimationFrame(render);
  
  }
  requestAnimationFrame(render);
  
  
}



main();
