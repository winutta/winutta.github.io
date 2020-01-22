

 
function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
  renderer.setClearColor("#e5e5e5");
  renderer.setSize( window.innerWidth, window.innerHeight );
  const fov = 75;
  const aspect = window.innerWidth/window.innerHeight;  // the canvas default
  const near = 0.1;
  const far = 20000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 3;
  
  const scene = new THREE.Scene();
  
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  
  const material = new THREE.MeshBasicMaterial({color: 0x44aa88});
  
  
  const cube = new THREE.Mesh(geometry, material);
  
  //scene.add(cube);

  
  var loader = new THREE.GLTFLoader();

  loader.load("bounceBox.gltf",function(gltf){
	  
	gltf.scene.traverse(function (child) {console.log(child)});
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

      console.log( 'An error happened' );

    }
  );
  
  
  function render(time) {
    time *= 0.001;

    //cube.rotation.x = time;
    cube.rotation.y = time;
    
    renderer.render(scene,camera);

    requestAnimationFrame(render);
  
  }
  requestAnimationFrame(render);
  
  
}



main();
