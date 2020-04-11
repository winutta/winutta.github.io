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
		    //camera.aspect = wid/hig;
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

	//camera.aspect = (hig)/(wid) ;
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
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xE88D27,1);// a nice burnt orange color

	windowAspect = window.innerWidth/window.innerHeight;

	const scene = new THREE.Scene();

	const fov = 75;
	// const aspect =  window.innerWidth/window.innerHeight;
	const aspect =  (window.innerHeight)/window.innerHeight;

	const near = 0.1;
	const far = 2000;
	camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 2;

	var vFOV = camera.fov * Math.PI / 180;
	var h = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
	var w = h * aspect;




	var textures = [];
	let numPhotos = 22;

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

	const planeG = new THREE.PlaneGeometry(w,h,32);
	const planeM = new THREE.MeshBasicMaterial({map:texture});

	const plane = new THREE.Mesh(planeG,planeM);
	scene.add(plane);

	var text_body =  document.getElementById("bod");
	var text_head = document.getElementById("hed");
	var text_count = document.getElementById("count");
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

	makeRightSize();

	// var slider = document.getElementById("myRange");

	// slider.oninput = function(){
	// 	hVals[number] = slider.value/360;
	// 	hVal = slider.value/360;
	// 	console.log(hVals);
	// 	text_head.innerHTML = (slider.value/360).toFixed(3);
	// }
	texture = textures[currP+numOffset];
	text_body.innerText = listMess[number];
	text_count.innerText = (numOffset + 1).toString() + "/" + listCounts[number].toString();
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
		text_count.innerText = (numOffset + 1).toString() + "/" + listCounts[number].toString();

		makeRightSize();

		inter = setInterval(function(){
			numOffset++;
			if(numOffset>=listCounts[number]) numOffset = 0;
			//console.log(numOffset,currP);
			texture = textures[currP+numOffset];
			rVal = photoRot[currP + numOffset];
			text_count.innerText = (numOffset + 1).toString() + "/" + listCounts[number].toString();

			makeRightSize();
		},1500);
		text_body.innerText = listMess[number];
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

	makeRightSize();

	inter = setInterval(function(){
			numOffset++;
			if(numOffset>=listCounts[number]) numOffset = 0;
			console.log(numOffset,currP);
			texture = textures[currP+numOffset];
			rVal = photoRot[currP + numOffset];
			text_count.innerText = (numOffset + 1).toString() + "/" + listCounts[number].toString();
			makeRightSize();
	},1500);

	text_body.innerText = listMess[number];
	hVal = hVals[number];
    return false;
	}, false);

	window.addEventListener( 'resize', makeRightSize, false );

	function render(time){
		time *= 0.001;
		planeM.map = texture;

		renderer.render(scene,camera);

		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);


}

main();
