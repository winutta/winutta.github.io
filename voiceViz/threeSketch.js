function main(){

	//set up renderer and scene
	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(0x000000,1);// a nice burnt orange color
	
	const scene = new THREE.Scene();

	//create camera
	const fov = 75;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 40;

	//Stream Audio to speakers
	navigator.getUserMedia = navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	var aCtx;
	var analyser;
	var microphone;
	var data;
	if (navigator.getUserMedia) {
	    navigator.getUserMedia(
	        {audio: true}, 
	        function(stream) {
	            aCtx = new AudioContext();
	            analyser = aCtx.createAnalyser();
	            // console.log(analyser.fftSize);
	            analyser.fftSize = 2048;
	            data = new Uint8Array(analyser.fftSize/2);
	            microphone = aCtx.createMediaStreamSource(stream);
	            microphone.connect(analyser);
	            var destination=aCtx.destination;
	            analyser.connect(destination);
	            analyser.getByteFrequencyData(data);
	        },
	        function(){ console.log("Error 003.")}
	     );
	} 

	function getAverageDecibel(){
		// console.log(data);
		var value = 0;
		analyser.getByteFrequencyData(data);



		for(var i = 0; i<data.length;i++){
			value += data[i];
		}

		return value/data.length;
	}

	function getAverageFrequency(){
		var value = 0;
		var total = 0;
		analyser.getByteFrequencyData(data);

		for(var i = 0; i<data.length;i++){
			value += data[i]*i;
			total += data[i];
		}

		return (value/total);
	}

	function getMaxFrequency(){
		var value = 0;
		var total = 0;
		var ind = 0;
		analyser.getByteFrequencyData(data);

		for(var i = 0; i<data.length;i++){
			if(data[i]>value){
				value = data[i];
				ind = i;
			}
			// value += data[i]*i;
			// total += data[i];
		}

		return ind;
	}



	// //Make Audio
	// const listener = new THREE.AudioListener();
	// camera.add(listener);

	// const sound = new THREE.Audio(listener);

	// const audioLoader = new THREE.AudioLoader();
	// audioLoader.load("song.mp3", function(buffer){
	// 	sound.setBuffer(buffer);
	// 	sound.setLoop(true);
	// 	sound.setVolume(0.5);
	// 	// sound.autoplay = true;
	// 	// sound.play();
	// });

	// var fftSize = 256;

	// var analyser = new THREE.AudioAnalyser(sound,fftSize);

	// const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

	//make cube
	const w = 20;
 	const h = 20;
    const geometry = new THREE.BoxGeometry( w,h,h, 200,200,200);

    const material = new THREE.ShaderMaterial( {
                uniforms: {
                aveFreq: {value: 1.},
                iTime: { type: 'f', value: 0.0 },
           		res: {value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
                },
                vertexShader: document.getElementById("vertexShader").textContent,
                fragmentShader: document.getElementById("fragmentShader").textContent,
                transparent:true,
                side: THREE.DoubleSide,
            });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0,0,0);
    scene.add(cube);

 //    window.addEventListener("keydown",playAudio,false);
 //    window.addEventListener("keyup",resetKey,false);

 //    var fired = false;
 //    function playAudio(){
 //    	if(!fired){
 //    		fired = true;
 //    		if(sound.isPlaying){
 //    			sound.pause();
 //    		}else{
 //    			sound.play();
 //    		}
 //    	}
 //    }

 //    function resetKey(){
 //    	fired = false;
 //    }
    
    //add mouse movement controls
	const controls = new THREE.OrbitControls(camera, canvas);
	controls.target.set(0, 0, 0);
	controls.update();

	window.addEventListener( 'resize', onWindowResize, false );

	

	function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
	}


	//render
	function render(time){
		// analyser.getFrequencyData();
		// material.uniforms.tAudioData.value.needsUpdate = true;
		// material.uniforms.aveFreq.value = analyser.getAverageFrequency();
		// console.log(analyser.getAverageFrequency());
		// material.uniforms.maxDec.value = analyser.analyser.maxDecibels;
		// console.log(analyser.analyser.maxDecibels);
		
		// material.uniforms.iTime.value = time;
		if(data){
			material.uniforms.aveFreq.value = getAverageDecibel();
			// material.uniforms.aveFreq.value = getAverageFrequency();
			// material.uniforms.aveFreq.value = getMaxFrequency();
			// console.log(getAverageFrequency());
			// console.log(getMaxFrequency());
		// 	// console.log(getAverageDecibel(data));
		}
		renderer.render(scene,camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);

}

main();