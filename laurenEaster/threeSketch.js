//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file

let dur;
let tRes;
let texture;
let hVal;
let rVal;

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

	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	//renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setSize( window.innerHeight*0.75, window.innerHeight );
	renderer.setClearColor(0xE88D27,1);// a nice burnt orange color
	const width = window.innerHeight*0.75;
	//const width = window.innerWidth;
	const scene = new THREE.Scene();

	const fov = 75;
	// const aspect =  window.innerWidth/window.innerHeight;
	const aspect =  (window.innerHeight*0.75)/window.innerHeight;

	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 2;

	var vFOV = camera.fov * Math.PI / 180;
	var h = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
	var w = h * aspect;


	var textures = [];
	let numPhotos = 24;

	let photoTypes = {
		0:"JPG",
		1:"JPG",
		2:"JPG",
		3:"JPG",
		4:"JPG",
		5:"JPG",
		6:"JPG",
		7:"JPG",
		8:"JPG",
		9:"JPG",
		10:"JPG",
		11:"JPG",
		12:"jpeg",
		13:"JPG",
		14:"JPG",
		15:"JPG",
		16:"JPG",
		17:"PNG",
		18:"JPG",
		19:"JPG",
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



	for(let i = 0; i<numPhotos;i){
	
		//var t0 = new THREE.TextureLoader().load( 'Lauren/'+i.toString()+'.' + photoTypes[i] ,function(){});
		var t0 = new THREE.TextureLoader().load( 'fullPhotos/'+i.toString()+'.jpg' ,function(){});

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
// 	const planeM = new THREE.ShaderMaterial({
// 		uniforms: {
// 			tD : {value: new THREE.Vector2(0.,1.)},
// 			dT : {type : 'f', value: dur},
// 			tex: { type: "t", value: texture },
// 			iTime: {type: 'f', value: 0.0},
// 			hue: {type: 'f', value: 0.0},
// 			rot: {type: 'f', value: 0.0},
// 			res: {value: new THREE.Vector2(window.innerWidth,window.innerHeight)}	
// 		},
// 		vertexShader: document.getElementById("vertShader").textContent,
// 		fragmentShader: document.getElementById("fragShader").textContent,
// 	});

	const plane = new THREE.Mesh(planeG,planeM);
	scene.add(plane);

	var text_body =  document.getElementById("bod");
	var text_head = document.getElementById("hed");
	var text_count = document.getElementById("count");
	var listMess = {0:"I want to tell you why I feel so lucky you are my Sister!",
					1: "You have come running in when I needed you ",
					2: "You embrace me whether I am happy or sad",
					3: "You celebrate with me when I succeed     ",
					4: "We make the most beautiful food and explore culinary deliciousness",
					5: "We are silly and explore amazing things in the world",
					6: "You express your care and energy to those you love",
					7: "You enjoy and promote fun, games, and good mindsets",
					8: "You Pursue Growth"};

	var listCounts = {0:1,
					1:2,
					2:2,
					3:2,
					4:3,
					5:7,
					6:3,
					7:2,
					8:2};
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
	var numOffset = 0;
	var currP = 0;
	var inter;

// 	var slider = document.getElementById("myRange");

// 	slider.oninput = function(){
// 		hVals[number] = slider.value/360;
// 		hVal = slider.value/360;
// 		console.log(hVals);
// 		text_head.innerHTML = (slider.value/360).toFixed(3);
// 	}
	texture = textures[currP+numOffset];
	text_body.innerText = listMess[number];
	text_count.innerText = (numOffset + 1).toString() + "/" + listCounts[number].toString();
	hVal = hVals[number];
	// text_head.innerHTML = (hVal).toFixed(3);
// 	slider.value = Number(hVal)*360;

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
		text_count.innerText = (numOffset + 1).toString() + "/" + listCounts[number].toString();

		inter = setInterval(function(){
			numOffset++;
			if(numOffset>=listCounts[number]) numOffset = 0;
// 			console.log(numOffset,currP);
			texture = textures[currP+numOffset];
			rVal = photoRot[currP + numOffset];
			text_count.innerText = (numOffset + 1).toString() + "/" + listCounts[number].toString();
		},1500);
		text_body.innerText = listMess[number];
		
		hVal = hVals[number];
		// text_head.innerHTML = (hVal).toFixed(3);
// 		slider.value = Number(hVal)*360;
		
		
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
	text_count.innerText = (numOffset + 1).toString() + "/" + listCounts[number].toString();

	inter = setInterval(function(){
			numOffset++;
			if(numOffset>=listCounts[number]) numOffset = 0;
// 			console.log(numOffset,currP);
			texture = textures[currP+numOffset];
			rVal = photoRot[currP + numOffset];
			text_count.innerText = (numOffset + 1).toString() + "/" + listCounts[number].toString();
	},1500);

	text_body.innerText = listMess[number];

	hVal = hVals[number];
	// text_head.innerHTML = (hVal).toFixed(3);
// 	slider.value = Number(hVal)*360;


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
 //    camera.aspect = window.innerWidth / window.innerHeight;
 	planeM.uniforms.res.value = new THREE.Vector2(window.innerHeight*0.75,window.innerHeight);
    camera.aspect = (window.innerHeight*0.75) / window.innerHeight;
    camera.updateProjectionMatrix();

     renderer.setSize( window.innerHeight*0.75, window.innerHeight );

    // renderer.setSize( window.innerWidth, window.innerHeight );

	}





	//Create objects/lights and add them to the scene here!

	function render(time){
		time *= 0.001;
// 		planeM.uniforms.iTime.value = time;
// 		planeM.uniforms.dT.value = dur;
// 		//console.log(texture);
// 		planeM.uniforms.tex.value = texture;
// 		planeM.uniforms.hue.value = hVal;
// 		planeM.uniforms.rot.value = rVal;
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
