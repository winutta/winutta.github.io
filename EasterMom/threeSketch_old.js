//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file

let dur;
let tRes;
let texture;
let hVal;
let rVal;
let windowAspect;
let camera;
let renderer;
let tall;
let currP, numOffset;

function makeRightSize(){
	if(tall[currP + numOffset] >0.5){
		if(windowAspect<1.){
		console.log("tall");
		wid = window.innerWidth;
		hig = wid/0.75;
		} else {
			console.log("wide");
			hig = window.innerHeight;
			wid = hig*0.75;
		}

			//planeM.uniforms.res.value = new THREE.Vector2(window.innerHeight*0.75,window.innerHeight);
		    camera.aspect = wid/hig;
		    camera.updateProjectionMatrix();
     		renderer.setSize( wid, hig);
	} else {

	var wid,hig;
	if(windowAspect<1.){
		console.log("tall");
		wid = window.innerWidth;
		hig = wid*0.75;
	} else {
		console.log("wide");
		hig = window.innerHeight;
		wid = hig/0.75;
	}

	camera.aspect = (hig)/(wid) ;
	camera.updateProjectionMatrix();
	renderer.setSize( wid, hig);
	// var scale = 1;
	console.log("made wide in func");
	}
    // camera.aspect = (window.innerWidth*0.75*scale)/(window.innerWidth*scale ) ;
    // camera.updateProjectionMatrix();
	// 	renderer.setSize( window.innerWidth*scale , window.innerWidth*0.75*scale );
}

function main(){
	const canvas = document.getElementById("c");

	// document.addEventListener('click', function (event) {
	// 	console.log("hi");
	//   if (canvas.requestFullscreen) {
	// 	    canvas.requestFullscreen();
	// 	  } else if (canvas.mozRequestFullScreen) { /* Firefox */
	// 	    canvas.mozRequestFullScreen();
	// 	  } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	// 	    canvas.webkitRequestFullscreen();
	// 	  } else if (canvas.msRequestFullscreen) { /* IE/Edge */
	// 	    canvas.msRequestFullscreen();
	// 	  }
	// });

	renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	//renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setSize( window.innerHeight*0.75, window.innerHeight );
	renderer.setClearColor(0xE88D27,1);// a nice burnt orange color

	windowAspect = window.innerWidth/window.innerHeight;
	// const width = window.innerWidth;
	const width = window.innerHeight*0.75;
	const scene = new THREE.Scene();

	const fov = 75;
	// const aspect =  window.innerWidth/window.innerHeight;
	const aspect =  (window.innerHeight*0.75)/window.innerHeight;

	const near = 0.1;
	const far = 2000;
	camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 2;

	var vFOV = camera.fov * Math.PI / 180;
	var h = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
	var w = h * aspect;


	var textures = [];
	let numPhotos = 22;

	let photoTypes = {
		0:"jpg",
		1:"jpg",
		2:"jpg",
		3:"jpg",
		4:"jpg",
		5:"jpg",
		6:"jpg",
		7:"jpg",
		8:"jpg",
		9:"jpg",
		10:"jpg",
		11:"jpg",
		12:"jpeg",
		13:"jpg",
		14:"jpg",
		15:"jpg",
		16:"jpg",
		17:"png",
		18:"jpg",
		19:"jpg",
		20:"jpeg",
		21:"jpg",
		22:"jpeg",
		23:"jpeg",
	}

	let photoRot = {
		0:0.0,
		1:0.0,
		2:0.0,
		3:0.0,
		4:0.0,
		5:0.0,
		6:1.0,
		7:1.0,
		8:1.0,
		9:0.0,
		10:0.0,
		11:0.0,
		12:0.0,
		13:0.0,
		14:0.0,
		15:0.0,
		16:0.0,
		17:1.0,
		18:1.0,
		19:0.0,
		20:1.0,
		21:1.0,
		22:0.0,
		23:1.0,
	}

	tall = {
		0:1.0,
		1:1.0,
		2:1.0,
		3:1.0,
		4:1.0,
		5:1.0,
		6:1.0,
		7:1.0,
		8:1.0,
		9:1.0,
		10:1.0,
		11:1.0,
		12:1.0,
		13:1.0,
		14:1.0,
		15:1.0,
		16:1.0,
		17:1.0,
		18:1.0,
		19:1.0,
		20:0.0,
		21:1.0,
	}



	for(let i = 0; i<numPhotos;i){
	
		//var t0 = new THREE.TextureLoader().load( 'Lauren/'+i.toString()+'.' + photoTypes[i] ,function(){});
		var t0 = new THREE.TextureLoader().load( 'momFull/'+i.toString()+'.jpg' ,function(){});

		t0.minFilter = THREE.LinearFilter;
		t0.magFilter = THREE.LinearFilter;
		t0.format = THREE.RGBFormat;
		//t0.rotation = 0.3;
		textures.push(t0);
		i++
	}
	console.log(textures);
	

	// texture = new THREE.TextureLoader().load( 'tank.jpg' ,function(){
	// 	texture.minFilter = THREE.LinearFilter;
	// 	texture.magFilter = THREE.LinearFilter;
	// 	texture.format = THREE.RGBFormat;
	// // // 	console.log(texture.image.width,texture.image.height);
	// // // 	tRes = new THREE.Vector2(texture.image.width,texture.image.height);
	// });

	


	

	// var video = document.getElementById( 'video' );
	// video.play();
	// setTimeout(function(){
	// 	video.pause();
	// },5000);
	//video.pause();
	// video.addEventListener('durationchange', function() {
	// dur = video.duration;
 //    console.log('Duration change', video.duration);
	// });

	// video.addEventListener('ended', function () {
 //  	console.count('loop restart');
 //  	//video.play();
 //  	dur = 1.0 - dur;
	// })
	// //console.log(video.duration);

	// var texture = new THREE.VideoTexture( video );
	// texture.minFilter = THREE.LinearFilter;
	// texture.magFilter = THREE.LinearFilter;
	// texture.format = THREE.RGBFormat;

	const planeG = new THREE.PlaneGeometry(w,h,32);
	const planeM = new THREE.MeshBasicMaterial({map:texture});
	// const planeM = new THREE.ShaderMaterial({
	// 	uniforms: {
	// 		tD : {value: new THREE.Vector2(0.,1.)},
	// 		dT : {type : 'f', value: dur},
	// 		tex: { type: "t", value: texture },
	// 		iTime: {type: 'f', value: 0.0},
	// 		hue: {type: 'f', value: 0.0},
	// 		rot: {type: 'f', value: 0.0},
	// 		res: {value: new THREE.Vector2(window.innerWidth,window.innerHeight)}	
	// 	},
	// 	vertexShader: document.getElementById("vertShader").textContent,
	// 	fragmentShader: document.getElementById("fragShader").textContent,
	// });

	const plane = new THREE.Mesh(planeG,planeM);
	scene.add(plane);

	var text_body =  document.getElementById("bod");
	var text_head = document.getElementById("hed");
	var listMess = {0:"I want to tell you why we are both so lucky",
					1: "You and I have known each other quite a while  ",
					2: "You have been with me on the path of life enjoying the scenery",
					3: "Helping me through school, life,  adventures, and more",
					4: "We have eaten cookies, muffins, and feasts Gallore",
					5: "We find ourselves by cherishing nature and the elements along the path",
					6: "And don’t forget the stories told over coffee and breakfast",
					7: "Even through we may face difficulty, and fear and just want to curl up on the couch",
					8: "We can always come together to bring good cheer and deliciousness too!"};

	var listCounts = {0:1,
					1:1,
					2:1,
					3:2,
					4:3,
					5:4,
					6:2,
					7:2,
					8:6};
	//var listMess = ["one","two","three","four","five","six","seven","eight","one","two","three","four","five","six","seven","eight","one","two","three","four","five","six","seven","eight","twentyfive"];
	//var hVals = [0.33,0.06,0.06,0.33,0.06,0.06,0.06,0.06,0.33,0.06,0.06,0.33,0.06,0.06,0.06,0.06,0.33,0.06,0.06,0.33,0.06,0.06,0.06,0.06,0.06];
	var hVals = {0:0.33,
				1:0.761,
				2:0.536,
				3:0.397,
				4:0.075,
				5:0.031,
				6:0.483,
				7:0.675,
				8:0.0};

	var number = 0;
	var numSections = 9;
	numOffset = 0;
	currP = 0;
	var inter;

	// var slider = document.getElementById("myRange");

	// slider.oninput = function(){
	// 	hVals[number] = slider.value/360;
	// 	hVal = slider.value/360;
	// 	console.log(hVals);
	// 	text_head.innerHTML = (slider.value/360).toFixed(3);
	// }
	texture = textures[currP+numOffset];
	text_body.innerHTML = listMess[number];
	hVal = hVals[number];
	// text_head.innerHTML = (hVal).toFixed(3);
	// slider.value = Number(hVal)*360;

	var cont = document.getElementById("container");


	cont.addEventListener('click', function (event) {
		if(inter) clearInterval(inter);
		numOffset = 0;
		currP += listCounts[number];
		if(currP >= numPhotos) currP = 0;
		number++;
		if(number>= numSections) number = 0;
		texture = textures[currP+numOffset];
		rVal = photoRot[currP + numOffset];

		makeRightSize();
		// if(tall[currP + numOffset] >0.5){
		// 	//planeM.uniforms.res.value = new THREE.Vector2(window.innerHeight*0.75,window.innerHeight);
		//     camera.aspect = (window.innerHeight*0.75) / window.innerHeight;
		//     camera.updateProjectionMatrix();
  //    		renderer.setSize( window.innerHeight*0.75, window.innerHeight );
		// } else {
		// 		//planeM.uniforms.res.value = new THREE.Vector2(window.innerWidth,window.innerWidth*0.75);
		// 		makeWide();
		// }

		inter = setInterval(function(){
			numOffset++;
			if(numOffset>=listCounts[number]) numOffset = 0;
			//console.log(numOffset,currP);
			texture = textures[currP+numOffset];
			rVal = photoRot[currP + numOffset];

			makeRightSize();
			// if(tall[currP + numOffset] >0.5){
			// //planeM.uniforms.res.value = new THREE.Vector2(window.innerHeight*0.75,window.innerHeight);
			// console.log("made tall");
		 //    camera.aspect = (window.innerHeight*0.75) / window.innerHeight;
		 //    camera.updateProjectionMatrix();
   //   		renderer.setSize( window.innerHeight*0.75, window.innerHeight );
			// } else {
			// 	//planeM.uniforms.res.value = new THREE.Vector2(window.innerWidth,window.innerWidth*0.75);
			// 	// console.log("about to make wide");
			// 	makeWide();
			// 	// var wid,hig;
				// if(windowAspect<1.){
				// 	console.log("tall");
				// 	wid = window.innerWidth;
				// 	hig = wid*0.75;
				// } else {
				// 	console.log("wide");
				// 	hig = window.innerHeight;
				// 	wid = hig/0.75;
				// }

				// camera.aspect = (hig)/(wid) ;
				// camera.updateProjectionMatrix();
	   //   		renderer.setSize( wid, hig);
				// // var scale = 1;
				// console.log("made wide");
			 //    // camera.aspect = (window.innerWidth*0.75*scale)/(window.innerWidth*scale ) ;
			 //    // camera.updateProjectionMatrix();
	   //   	// 	renderer.setSize( window.innerWidth*scale , window.innerWidth*0.75*scale );
			// }
		},1500);

		
		
		text_body.innerHTML = listMess[number];
		
		// hVal = hVals[number];
		// text_head.innerHTML = (hVal).toFixed(3);
		// slider.value = Number(hVal)*360;
		
		
	});

	cont.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    if(inter) clearInterval(inter);
	numOffset = 0;
	
    number--;
	if(number<= -1) number = numSections-1;
	currP -= listCounts[number];
	if(currP <= -1) currP = numPhotos-listCounts[number];
	

	texture = textures[currP + numOffset];
	rVal = photoRot[currP + numOffset];

	inter = setInterval(function(){
			numOffset++;
			if(numOffset>=listCounts[number]) numOffset = 0;
			console.log(numOffset,currP);
			texture = textures[currP+numOffset];
			rVal = photoRot[currP + numOffset];
	},1500);

	text_body.innerHTML = listMess[number];

	hVal = hVals[number];
	// text_head.innerHTML = (hVal).toFixed(3);
	// slider.value = Number(hVal)*360;


    return false;
	}, false);

	


	// setInterval(function() {
	//  text_body.innerHTML = listMess[number];
	//  texture = textures[number];
	//  number++;
	//  if(number>= 3) number = 0;

	// },2000);

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){

	// planeM.uniforms.res.value = new THREE.Vector2(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
 	// planeM.uniforms.res.value = new THREE.Vector2(window.innerHeight*0.75,window.innerHeight);
    // camera.aspect = (window.innerHeight*0.75) / window.innerHeight;
    camera.updateProjectionMatrix();

    //  renderer.setSize( window.innerHeight*0.75, window.innerHeight );

    renderer.setSize( window.innerWidth, window.innerHeight );

	}





	//Create objects/lights and add them to the scene here!

	function render(time){
		time *= 0.001;
		// planeM.uniforms.iTime.value = time;
		// planeM.uniforms.dT.value = dur;
		// //console.log(texture);
		// planeM.uniforms.tex.value = texture;
		// planeM.uniforms.hue.value = hVal;
		// planeM.uniforms.rot.value = rVal;

		planeM.map = texture;
		// if(tRes){
		// 	planeM.uniforms.tD.value = new THREE.Vector2(tRes.x,tRes.y);
		// }
		renderer.render(scene,camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

main();