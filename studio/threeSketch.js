//Takes care of necessities: Canvas, Renderer, Scene, Camera
//Establishes the simplest renderering loop
//Copy and add to this file

//import { RectAreaLightUniformsLib } from './RectAreaLightUniformsLib.js';
import {GUI} from 'https://threejs.org/examples/jsm/libs/dat.gui.module.js';
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js'

function loadTexture(url){
	var texture = new THREE.TextureLoader().load( url ,function(){});
	return texture;
}

var getColor = function(r,g,b){
	return new THREE.Color("rgb(" + r.toString() + ", "+ g.toString() + ", " + b.toString() + ")");
}

var slideObjs = [];
class Partition {
	parentMesh
	rootW;
	rootH;
	scene;
	w;
	h;
	textMaterial;
	childrenParts;
	childrenMeshes;
	constructor(w,h,scene, parentMesh){
		this.parentMesh = parentMesh;
		this.rootW = w;
		this.rootH = h;
		this.childrenParts = [];
		this.childrenMeshes = [];
		

		this.textMaterial = new THREE.MeshBasicMaterial({
				color:new THREE.Color("rgb(220,220,220)")
			});
		
		if(parentMesh){
			parentMesh.part.childrenParts.push(this);
			this.w = parentMesh.scale.x;
			this.h = parentMesh.scale.y;
			this.xPos = -parentMesh.position.x+parentMesh.scale.x/2;
			this.yPos = -parentMesh.position.y+parentMesh.scale.y/2;
		} else{
			this.w = w;
			this.h = h;
			this.xPos = w/2;
			this.yPos = h/2;
		}
		this.scene = scene;
	}

	drawRect(pW,pH,pL,pT,color,transparent,opacity,tex,material){
		var wSize = pW*this.w;
		var hSize = pH*this.h;

		var lMov = wSize/2 + pL*this.w - this.xPos;
		var tMov = - hSize/2 - pT*this.h + this.yPos;
		var geom = new THREE.PlaneBufferGeometry(1,1,10);
		var transparent = transparent;
		var opacity = opacity;
		var mat;
		if(material){
			mat = material;
		} else {
		if(tex){mat = new THREE.MeshBasicMaterial({map:tex,opacity:opacity,transparent:transparent});}
		else{mat = new THREE.MeshBasicMaterial({color:color,opacity:opacity,transparent:transparent});}
		}
		var mesh = new THREE.Mesh(geom,mat);
		mesh.scale.set(wSize,hSize,1);
		mesh.position.set(lMov,tMov,0);
		mesh.renderOrder = 1;
		mesh.part = this;
		mesh.wPerc = wSize/this.rootW;
		mesh.pL = pL;
		this.childrenMeshes.push(mesh);
		this.scene.add(mesh);
		return mesh;

	}



	reframeChildrenMeshes(w){
		this.rootW = w;
		if(this.parentMesh){
			this.w = this.parentMesh.wPerc*w;
			this.xPos = -this.parentMesh.position.x+this.parentMesh.scale.x/2;
		}
		else{
			this.w = w;
			this.xPos = w/2;
		}	


		var partW = this.w;
		var partxPos = this.xPos;


		this.childrenMeshes.forEach(function(item,index){
			var nWid = w*item.wPerc;
			

			if(item.typeOfMesh == "text"){
				item.position.x = item.pL*partW - partxPos;
				//item.scale.set(,,1);
			}else if(item.typeOfMesh == "number")
				item.position.x = item.pL*partW - partxPos - item.wid;
				//item.position.x = item.position.x;
			else{
				var lMov = nWid/2 + item.pL*partW - partxPos;
				item.scale.x = nWid;
				item.position.x = lMov;
			}
			

			if(item.contained){
				item.contained.scale.set(item.scale.y/item.contained.scaler,item.scale.y/item.contained.scaler,1);
				item.contained.position.set(item.position.x,item.position.y,0);

				if(item.contained.border){
					var boost = 0.01
					item.contained.border.scale.set(item.contained.scale.x + boost,item.contained.scale.y+ boost,1);
					item.contained.border.position.set(item.contained.position.x,item.contained.position.y,0);
				}
			}

			if(item.bevelBar){
				// item.bevelBar.position.set(-item.bevelBar.startPoints.x+(item.position.x-item.scale.x/2),0,0);//for some reason no need to reset position of bevelBar
				item.bevelBar.scale.set(item.scale.x/item.bevelBar.widthV,1,1);
				// item.bevelBar.widthV = item.scale.x;
			}

			if(item.border){
				var boost = 0.01;
				item.border.scale.set(item.scale.x + boost,item.scale.y+ boost,1);
				item.border.position.set(item.position.x,item.position.y,0);
			}

			if(item.textWithin){

				item.textWithin.position.set(item.position.x-item.textWithin.center.x,item.position.y-item.textWithin.center.y,0);
			}
		});

		this.childrenParts.forEach(function(item,index){
			item.reframeChildrenMeshes(w);
		});
	}

	// resizeRect(rectObj,w){
	// 	var nWid = w*rectObj.wPerc;

	// 	// var wPerc = this.w/this.rootW;
	// 	// var wSize;
	// 	// if(this.rootW!=w){wSize = rectObj.scale.x/this.w;}
		
	// 	// var nWid = wPerc*w*wSize;
	// 	rectObj.part
	// 	-parentMesh.position.x+parentMesh.scale.x/2

	// 	rectObj.scale.x = nWid;
	// 	rectObj.position.x = ;
	// }

	addBorder(obj){
		var geom = obj.geometry;
		var mat = new THREE.MeshBasicMaterial({color:"white"});
		var mesh =  new THREE.Mesh(geom,mat);
		var boost = 0.01;
		mesh.scale.set(obj.scale.x +boost,obj.scale.y + boost,1);
		mesh.position.set(obj.position.x,obj.position.y,0);
		mesh.renderOrder = obj.renderOrder - 0.1;
		obj.border = mesh;
		this.scene.add(mesh);
		return mesh;
	}

	addSlider(obj,name){
		var geom = new THREE.CircleBufferGeometry(1,64);
		var mat = new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(110,110,200)")});
		var mesh = new THREE.Mesh(geom,mat);
		var scale = 4
		mesh.scale.set(obj.scale.y/scale,obj.scale.y/scale,1);
		mesh.position.set(obj.position.x,obj.position.y,0);
		obj.contained = mesh;
		obj.selection = name;
		mesh.scaler = scale;
		this.scene.add(mesh);
		mesh.renderOrder = 3;
		slideObjs.push(obj);
		this.addBevelBar(obj,scale*2);

		return mesh;
	}

	addBevelBar(obj,scale){
		var shape = new THREE.Shape();

		var radius = obj.scale.y/scale;

		obj.radius = radius;

		var height = 2*radius;
		var width = obj.scale.x;
		var startPointX = obj.position.x-width/2;
		var startPointY = obj.position.y;
		shape.moveTo(startPointX,startPointY);
		shape.quadraticCurveTo(startPointX,startPointY +radius, startPointX + radius, startPointY + radius);
		shape.lineTo(startPointX + width - radius, startPointY + radius);
		shape.quadraticCurveTo(startPointX + width, startPointY + radius, startPointX + width, startPointY);
		shape.quadraticCurveTo(startPointX + width, startPointY - radius, startPointX + width - radius, startPointY - radius);
		shape.lineTo(startPointX + radius, startPointY - radius);
		shape.quadraticCurveTo(startPointX, startPointY - radius, startPointX,startPointY);

		var extrudeSettings = { amount: 0, bevelEnabled: false};

		var geom = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
		var mat = new THREE.MeshBasicMaterial({color:new THREE.Color("rgb(220,220,255)")});
		var mesh = new THREE.Mesh(geom,mat);
		//mesh.position.set(0,0,0);
		mesh.renderOrder = 2;
		mesh.startPoints = {x: startPointX,y: startPointY}
		obj.bevelBar = mesh;
		mesh.widthV = width;
		console.log(mesh.position);//position is (0,0,0) so is relative -> use difference between startPoints and desired Point new (obj.position.x-obj.scale.x/2,obj.position.y);
		this.scene.add(mesh);
		return mesh;


	}

	addText(pH,pL,pT,text,name,visible){ //neeed reworking to return mesh

		 // var wSize = pW*(this.w/this.rootW);
		//var hSize = pH*10/this.rootH;
		var hSize = (pH*this.w)/7.2;

		var lMov = pL*this.w - this.xPos;
		var tMov = - pT*this.h + this.yPos;

		var loader = new THREE.FontLoader();
		var center;
		var scene = this.scene;
		var mat = this.textMaterial;
		var mesh;
		var childrenMeshes = this.childrenMeshes;



		loader.load( 'Averia_Sans_Libre_Light_Italic.json', function ( font ) {
			var scale = hSize;
			var geometry = new THREE.TextGeometry( text, {
				font: font,
				size: scale,
				height: 0,
				curveSegments: 12,
				bevelEnabled: false,
			} );
			
			mesh = new THREE.Mesh(geometry,mat);
			// mesh.geometry.computeBoundingSphere();
			// center = mesh.geometry.boundingSphere.center;
			//mesh.position.set(-center.x,-center.y,-center.z);
			mesh.position.set(lMov,tMov,0);
			mesh.name = name;
			mesh.fontScale = scale;
			mesh.renderOrder = 4
			mesh.pL = pL;
			mesh.typeOfMesh = "text";
			childrenMeshes.push(mesh);
			scene.add(mesh);

		} );


	}

	addTextinBox(pH,text,name,obj){

		var hSize = (pH*this.w)/7.2;

		var loader = new THREE.FontLoader();
		var center;
		var scene = this.scene;
		var mat = this.textMaterial;
		var mesh;



		loader.load( 'Averia_Sans_Libre_Light_Italic.json', function ( font ) {
			var scale = hSize;
			var geometry = new THREE.TextGeometry( text, {
				font: font,
				size: scale,
				height: 0.0001,
				curveSegments: 1,
				bevelEnabled: false,
			} );
			
			mesh = new THREE.Mesh(geometry,mat);
			mesh.geometry.computeBoundingSphere();
			center = mesh.geometry.boundingSphere.center;
			mesh.position.set(obj.position.x-center.x,obj.position.y-center.y,0);
			mesh.name = name;
			mesh.center = center;
			mesh.fontScale = scale;
			mesh.renderOrder = 4
			scene.add(mesh);
			obj.textWithin = mesh;

		} );
	}

}

let selObjs = [],colObjs = [],saveObjs = [],clickableObjs = [],toggleFilterObjs = [],toggleColorObjs = [];
let freePosition = true;
let imgLoaded = false;

function main(){


	const canvas = document.getElementById("c");
	const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
	renderer.autoClear = false;
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(0xE88D27,1);// a nice burnt orange color

	document.addEventListener("mousemove",updatePosition,false);
	 if(document.pointerLockElement === canvas || !freePosition){
	} else{
		canvas.requestPointerLock();
	}
	//console.log("test",document.pointerLockElement);

	document.addEventListener("click",pointerL,false);

	function pointerL(){
		if(document.pointerLockElement === canvas || !freePosition){
		} else{
			canvas.requestPointerLock();
		}
	}
	
	var para = document.createElement("span");
	//document.body.appendChild(para);
	var xmov = 0,ymov =0;
	function updatePosition(e){
		xmov+= e.movementX;
		ymov+= e.movementY;
		ymov = Math.max(Math.min(ymov,2000*Math.PI/2),2000*-Math.PI/2);
		para.innerHTML = xmov.toString() + ", " + ymov.toString();
	}


	
	const scene = new THREE.Scene();

	const fov = 58;
	const aspect = window.innerWidth/window.innerHeight;
	const near = 0.1;
	const far = 2000;
	const camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera.position.z = 0;

	const camera2 = new THREE.PerspectiveCamera(fov,aspect,near,far);
	camera2.position.z = 2;

	const scene2 = new THREE.Scene();

	var vFOV = camera2.fov * Math.PI / 180;
	var h = 2 * Math.tan( vFOV / 2 ) * camera2.position.z;
	var w = h * aspect;

	////////////////////////


	const transparentScene = new THREE.Scene();
	const opaqueScene = new THREE.Scene();

	var fullPart = new Partition(w,h,transparentScene);

	var midSize = 0.55;

	var rect1 = fullPart.drawRect((1-midSize)/2,1,0,0,"black",true,0.8);
	// rect1.part.resizeRect(rect1,w/2);

	var rect2 = fullPart.drawRect((1-midSize)/2,1,(1-midSize)/2+midSize,0,"black",true,0.8);

	var hS = 0.1/aspect;

	var minN = 0, maxN = 12;
	var numbers = [];
	
	var lTwidth;
	createNumbers(minN,maxN);

	var Part1 = new Partition(w,h,opaqueScene,rect1);

	var sliderW = 0.55;


	var h11 = hS;

	var rect11 = Part1.drawRect(sliderW,0.075,1-sliderW-0.05,h11,"green",true,0);
	var circ11 = Part1.addSlider(rect11,"layers");
	Part1.addBorder(circ11);

	var t11 = 1*hS+ 0.075*0.5+ rect11.radius/Part1.h;

	Part1.addText(0.4,0.03,t11,"Layers","layers");

	var layerNumbs =[];
	addNumbers(2,12,1-sliderW- 0.05 - 0.05,t11,Part1,7,layerNumbs,rect11);

	var h12 = 2*hS+ 0.075;
	
	var rect12 = Part1.drawRect(sliderW,0.075,1-sliderW-0.05,h12,"green",true,0);
	var circ12 = Part1.addSlider(rect12,"blur");
	Part1.addBorder(circ12);

	var t12 = 2*hS+ 0.075*1.5+ rect12.radius/Part1.h;

	var blurNumbs = [];
	addNumbers(0,8,1-sliderW- 0.05 - 0.05,t12,Part1,4,blurNumbs,rect12);

	
	Part1.addText(0.4,0.03,t12,"Blur","blur");

	var h1S = 3*hS+ 0.075*2;

	var rect1S = Part1.drawRect(sliderW,0.075,1-sliderW-0.05,h1S,"green",true,0);
	var circ1S = Part1.addSlider(rect1S,"smooth");
	Part1.addBorder(circ1S);

	var t1S = 3*hS+ 0.075*2.5+ rect1S.radius/Part1.h;

	var smoothNumbs = [];
	addNumbers(0,8,1-sliderW- 0.05 - 0.05,t1S,Part1,4,smoothNumbs,rect1S);

	
	Part1.addText(0.4,0.03,t1S,"Smooth","smooth");


	


	

	var h13 = 5*hS+ 3*0.075;


	var rect13 = Part1.drawRect(0.8,0.075,0.1,h13,new THREE.Color("rgb(100,100,200)"),false,1);
	Part1.addBorder(rect13);
	saveObjs.push(rect13);
	// Part1.addBevelBar(rect13);

	Part1.addTextinBox(0.35,"Save Canvas to JPG","save", rect13);

	var h14 = 6*hS+ 4*0.075;

	var rect14 = Part1.drawRect(0.8,0.075,0.1,h14,new THREE.Color("rgb(20,100,200)"),false,1);
	toggleFilterObjs.push(rect14);
	Part1.addBorder(rect14);
	// Part1.addBevelBar(rect13);

	Part1.addTextinBox(0.35,"Toggle Filter","toggle", rect14);

	var h15 = 7*hS+ 5*0.075;

	var rect15 = Part1.drawRect(0.8,0.075,0.1,h15,new THREE.Color("rgb(100,50,100)"),false,1);
	toggleColorObjs.push(rect15);
	Part1.addBorder(rect15);
	// Part1.addBevelBar(rect13);

	Part1.addTextinBox(0.35,"Toggle Color","colored", rect15);


	
	
	
	var Part2 = new Partition(w,h,opaqueScene,rect2);

	var colTex = loadTexture("colors.jpeg");
	colTex.center = new THREE.Vector2(0.5,0.5);
	colTex.rotation = -Math.PI/2;
	var rect21 = Part2.drawRect(0.8,0.65,0.1,hS,"blue",false,1,colTex);
	Part2.addBorder(rect21);
	colObjs.push(rect21);

	const Mat1 = new THREE.MeshPhongMaterial({color: new THREE.Color("rgb(72, 111, 184)"),emissiveIntensity:0.2, transparent:false,opacity:0});
	const Mat2 = new THREE.MeshPhongMaterial({color: new THREE.Color("rgb(235, 229, 218)"),emissiveIntensity:0.2, transparent:false,opacity:0});

	var sel1 = Part2.drawRect(0.35,1-(hS*3 + 0.65),0.1,hS*2 + 0.65,"red",false,1,null,Mat1);
	Part2.addBorder(sel1);
	selObjs.push(sel1);

	Part2.addTextinBox(0.35,"Color 1","col1", sel1);

	var sel2 = Part2.drawRect(0.35,1-(hS*3 + 0.65),0.55,hS*2 + 0.65,"red",false,1,null,Mat2);
	Part2.addBorder(sel2);
	selObjs.push(sel2);
	Part2.addTextinBox(0.35,"Color 2","col2", sel2);

	

	function createNumbers(minN,maxN){
			var loader = new THREE.FontLoader();
			loader.load( 'Averia_Sans_Libre_Light_Italic.json', function ( font ) {
				for(let i = minN; i<=maxN;i++){
					var scale = 0.35*Part1.w/7.2;
					var geometry = new THREE.TextGeometry( i.toString(), {
						font: font,
						size: scale,
						height: 0,
						curveSegments: 12,
						bevelEnabled: false,
					} );
					
					var mesh = new THREE.Mesh(geometry,Part1.textMaterial);
					mesh.position.set(0,-Part1.h/2,0);
					mesh.name = i.toString();
					mesh.visible = true;
					mesh.renderOrder = 4
					numbers.push(mesh);
				}
			} );
	}

		


		function addNumbers(miN,maN,pL,pT,part,start,numbs,parentObj){

			// var numbs;
			var lMov = pL*part.w - part.xPos;
			var tMov = - pT*part.h + part.yPos;


			var inter = setInterval(function(){

				if(numbers.length == maxN-minN+1){

					for(let i = miN; i<=maN;i++){
						
						var mesh = numbers[i].clone();
						mesh.geometry.computeBoundingBox();
						var wid = mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x;
						
						 mesh.position.x = lMov-wid;
						 if(i == start){
						 	mesh.visible = true;
						 } else {
						 	mesh.visible = false;
						 }
						 mesh.position.y = parseFloat(tMov.toFixed(15));
						 mesh.pL = pL;
						 mesh.wid = wid;
						 mesh.typeOfMesh = "number";
						 part.childrenMeshes.push(mesh);
						 numbs.push(mesh);
						 opaqueScene.add(mesh);
					}
					parentObj.numbs = numbs;
					parentObj.currN = start- miN;
					parentObj.minN = miN;
					parentObj.maxN = maN;
					clearInterval(inter);	
				}	
			},1000/10);
		}

	///////////////////////////////////////


	var buttonTex = loadTexture("button2.png");

	const xSigG = new THREE.PlaneBufferGeometry(w*0.2,w*0.2*(1/3),10);
	const xSigM = new THREE.MeshBasicMaterial({map: buttonTex,transparent:true,opacity:0});
	const xSig = new THREE.Mesh(xSigG,xSigM);
	xSig.position.set(0,-h/2 + h*0.2,0);
	scene2.add(xSig);

	var colCanvas = document.createElement("CANVAS");
	var colCtx = colCanvas.getContext("2d");

	const colImg = new Image();
	colImg.src = "colors.jpeg";

	var colData;
	var colorTexture = new THREE.TextureLoader().load("colors.jpeg", function(){
		colCtx.canvas.width = colImg.width || colImg.naturalWidth;
		colCtx.canvas.height = colImg.height || colImg.naturalHeight;
		colCtx.drawImage(colImg,0,0);
		colData = colCtx.getImageData(0,0,colImg.naturalWidth,colImg.naturalHeight);
	});

	// var colPw = w*0.15, colPh = w*0.15;
	// var selW = colPw/2, selH = h*0.2;
	// var saveW = w*0.15,saveH = w*0.15;

	// const colG = new THREE.PlaneBufferGeometry(1,1,10);
	// const colM = new THREE.MeshBasicMaterial({map:colorTexture,transparent:true,opacity:0});
	// const colPlane = new THREE.Mesh(colG,colM);
	// colPlane.scale.set(colPw,colPh,1);
	// colPlane.position.set(w/2-colPw/2,-h/2+ selH + colPh/2,0);
	// scene2.add(colPlane);
	// colObjs.push(colPlane);

	

	// const Geom = new THREE.PlaneGeometry(1,1,10);
	// const Mat1 = new THREE.MeshPhongMaterial({color: new THREE.Color("rgb(72, 111, 184)"),emissiveIntensity:0.2, transparent:true,opacity:0});
	// const Mat2 = new THREE.MeshPhongMaterial({color: new THREE.Color("rgb(235, 229, 218)"),emissiveIntensity:0.2, transparent:true,opacity:0});
	// const sel1 = new THREE.Mesh(Geom,Mat1);
	// const sel2 = new THREE.Mesh(Geom,Mat2);
	// sel1.scale.set(selW,selH,1);
	// sel2.scale.set(selW,selH,1);
	// sel1.position.set(w/2-selW*(3/2),-h/2+selH/2,0);
	// sel2.position.set(w/2-selW/2,-h/2+selH/2,0);
	// scene2.add(sel1);
	// scene2.add(sel2);
	// selObjs.push(sel1);
	// selObjs.push(sel2);

	// const saveG = new THREE.PlaneBufferGeometry(1,1,10);
	// const saveM = new THREE.MeshBasicMaterial({color:"green", transparent: true, opacity: 0});
	// const save = new THREE.Mesh(saveG,saveM);
	// save.scale.set(saveW,saveH,1);
	// save.position.set(-w/2 + w*0.15/2,-h/2 + w*0.15,0);
	// scene2.add(save);
	// saveObjs.push(save);


	

	const ambLight = new THREE.AmbientLight(0xFFFFFF,1);
	scene2.add(ambLight);

	opaqueScene.add(ambLight);

	function getCols(u,v){
		var tx = Math.min(u*colData.width | 0, colData.width - 1);
		var ty = Math.min(v*colData.height | 0, colData.height - 1);
		ty = colData.height - ty;

		var offset = (ty * colData.width + tx) *4;
		var r = colData.data[offset + 0];
		var g = colData.data[offset + 1];
		var b = colData.data[offset + 2];
		var a = colData.data[offset + 3];

		return new THREE.Vector4(r,g,b,a);
	}

	// var controls = new THREE.OrbitControls( camera, renderer.domElement );
	// //camera.position.set( 0, 20, 100 );
	// controls.target = new THREE.Vector3(0,0,8);
	// controls.update();

	const ya = new THREE.Vector3(0,1,0);
	const xa = new THREE.Vector3(1,0,0);
	const za = new THREE.Vector3(0,0,1);

	var wcTex = loadTexture("wallTextures/wallTex.jpeg");
	var whTex = loadTexture("wallTextures/White_stucco_wall_01_1K_Height.png");
	var wnTex = loadTexture("wallTextures/White_stucco_wall_01_1K_Normal.png");
	var wrTex = loadTexture("wallTextures/White_stucco_wall_01_1K_Roughness.png");
	var waTex = loadTexture("wallTextures/White_stucco_wall_01_1K_AO.png");

	var wcTex2 = loadTexture("wallTextures/Marble_09_1K_Base_Color.png");

	var fcTex = loadTexture("floorTextures/Marble_08_1K_Base_Color.png");
	var fhTex = loadTexture("floorTextures/Marble_08_1K_Height.png");
	var frTex = loadTexture("floorTextures/Marble_08_1K_Roughness.png");

	var fcTex2 = loadTexture("floorTextures/Light_wooden_parquet_flooring_01_1K_Base_Color.png");
	var fhTex2 = loadTexture("floorTextures/Light_wooden_parquet_flooring_01_1K_Height.png");

	const wallG1 = new THREE.PlaneGeometry(14,10,10);
	const wallG2 = new THREE.PlaneGeometry(16,10,10);
	const wallG3 = new THREE.PlaneGeometry(14,16,10);
	const wallM = new THREE.MeshStandardMaterial({
		map: fcTex,
		//color:new THREE.Color("rgb(100, 100, 100)"),
		color:new THREE.Color("rgb(220, 196, 255)"),
		//normalMap:nTex,
		//normalScale: new THREE.Vector2( 0.15, 0.15 ),
		// aoMap: aTex,
		roughnessMap:wrTex,
		bumpMap: whTex,
		bumpScale: 0.01,
		roughness:0.5,
		metalness:0,
		side:THREE.DoubleSide});//side: THREE.DoubleSide

	const floorM = new THREE.MeshStandardMaterial({
		map: fcTex2,

		color:new THREE.Color("rgb(74, 70, 65)"),
		//color:new THREE.Color("rgb(220,220,220)"),
		roughnessMap: fhTex2,
		roughness:0.5,
		bumpMap: fhTex2,
		bumpScale: 0.05,

	})
	const wall1 = new THREE.Mesh(wallG1,wallM);
	const wall2 = new THREE.Mesh(wallG1,wallM);
	const wall3 = new THREE.Mesh(wallG2,wallM);
	const wall4 = new THREE.Mesh(wallG2,wallM);
	const wall5 = new THREE.Mesh(wallG3,floorM);
	const wall6 = new THREE.Mesh(wallG3,wallM);
	wall2.position.set(0,0,16);
	wall2.rotation.y = Math.PI;
	wall3.position.set(-7,0,8);
	wall3.rotation.y = Math.PI/2;
	wall4.position.set(7,0,8);
	wall4.rotation.y = -Math.PI/2;
	wall5.position.set(0,-5,8);
	wall5.rotation.x = -Math.PI/2;
	wall6.position.set(0,5,8);
	wall6.rotation.x = Math.PI/2;

	scene.add(wall1);
	scene.add(wall2);
	scene.add(wall3);
	scene.add(wall4);
	scene.add(wall5);
	scene.add(wall6);

	var fontLoader = new THREE.FontLoader();
	var center;

	fontLoader.load( 'Averia_Sans_Libre_Light_Italic.json', function ( font ) {
		var scale = 1.5;
		var geometry = new THREE.TextGeometry( 'Art Lab', {
			font: font,
			size: scale,
			height: scale/50,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: scale/20,
			bevelSize: scale/20,
			bevelOffset: -0.0,
			bevelSegments: 12
		} );
		var mat = new THREE.MeshPhysicalMaterial({
			color:new THREE.Color("rgb(200,200,200)"),
			clearcoat:1.0,
			clearcoatRoughness:0.4,
		});
		var mesh = new THREE.Mesh(geometry,mat);
		mesh.geometry.computeBoundingSphere();
		center = mesh.geometry.boundingSphere.center;
		mesh.position.set(-center.x,-center.y+2.5,-center.z);
		scene.add(mesh);
	} );

	const playerG = new THREE.SphereBufferGeometry(1,10,10);
	const playerM = new THREE.MeshBasicMaterial({transparent:true,opacity:0});
	const player = new THREE.Mesh(playerG,playerM);
	const playerRot = new THREE.Mesh(playerG,playerM);
	player.position.set(0,-1.2,14);
	player.add(playerRot);
	playerRot.add(camera);
	scene.add(player);

	

	//Add Easel

	var gltfLoader = new GLTFLoader();
	var easel; 

	gltfLoader.load("easel_together.glb",
	function ( gltf ) {
		easel = gltf.scene.children[0];
		var easelM = new THREE.MeshStandardMaterial({
			map: fcTex2,
			color:new THREE.Color("rgb(125, 112, 101)"),
			//roughnessMap: frTex2,
			roughness:0.5,
			bumpMap: fhTex2,
			bumpScale: 0.05,
		});
		easel.material = easelM;
		easel.position.set(0,-5.2,4);
		scene.add(easel);
		console.log(gltf.scene);
	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened' );
	});

	var imgTex;

	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  	document.addEventListener(eventName, preventDefaults, false)
	});

	function preventDefaults (e) {
	  e.preventDefault();
	  e.stopPropagation();
	}

	document.addEventListener('drop',function(e){
		// console.log(e);
		var dt = e.dataTransfer;
		console.log(dt.getData('url'));
		loadAndSaveFiles(dt);
		
		//console.log(dt.files);
	},false);


	function loadAndSaveFiles(dt){
		imgLoaded = false;
		if (dt.files && dt.files[0]) {
            var reader = new FileReader();



            reader.onload = function (e) {
            	console.log(e);
            	var mediaType = e.target.result.split(";")[0].split(":")[1].split("/")[0];
            	//console.log(mediaType);
            	if(mediaType == "image"){
            		var textureL = new THREE.TextureLoader();
            		textureL.crossOrigin = "Anonymous";
	            	imgTex = textureL.load( e.target.result ,function(){
	            		//console.log(canM2);
	            		canM2.uniforms.tex.value = imgTex;
						canM.map = imgTex;
						can.material.needsUpdate = true;
						//fPlane.material = can.material;
						imgLoaded = true;
						texDim = new THREE.Vector2(imgTex.image.width,imgTex.image.height);
						var cS = canv.scale;
						canv.scale.set(cS.y*(texDim.x/texDim.y),cS.y*1,cS.z*1);
					});
        		}
        		 else if (mediaType == "video"){
        			var video = document.getElementById("video");
        			video.src = e.target.result;
        			video.pause();
					video.currentTime = 0;
					video.play();
        			imgTex = new THREE.VideoTexture( video );
					video.addEventListener("loadedmetadata",function(e){
						texDim = new THREE.Vector2(this.videoWidth,this.videoHeight);
						canM.map = imgTex;
						canM2.uniforms.tex.value = imgTex;
						can.material.needsUpdate = true;
						//fPlane.material = can.material;
						imgLoaded = true;
						var cS = canv.scale;
						canv.scale.set(cS.y*(texDim.x/texDim.y),cS.y*1,cS.z*1);	
					})
        		}
            }
            reader.readAsDataURL(dt.files[0]);
        } else {
        	var textureL = new THREE.TextureLoader();
    		textureL.crossOrigin = "Anonymous";
    		// var newImg = new Image;
    		// newImg.crossOrigin = "Anonymous";
    		// newImg.src = dt;
    		try{
    		imgTex = textureL.load( dt.getData('url'),function(){
        		//console.log(canM2);
        		canM2.uniforms.tex.value = imgTex;
				canM.map = imgTex;
				can.material.needsUpdate = true;
				//fPlane.material = can.material;
				imgLoaded = true;
				texDim = new THREE.Vector2(imgTex.image.width,imgTex.image.height);
				var cS = canv.scale;
				canv.scale.set(cS.y*(texDim.x/texDim.y),cS.y*1,cS.z*1);
			});
    		}
    		catch {}
        }
	}

	const renderTarget = new THREE.WebGLRenderTarget(w,h); // this is for a gradient between the two colors
	const rtFov = 58;
	const rtAspect = w/h;
	const rtNear = 0.1;
	const rtFar = 5;
	const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
	rtCamera.position.z = 2;

	const rtScene = new THREE.Scene();

	const rtG = new THREE.PlaneGeometry(w,h,10);
	const rtM = new THREE.ShaderMaterial({
		uniforms: {
			col1: {value: new THREE.Vector3(0.,0.,0.)},
			col2: {value: new THREE.Vector3(1.,1.,1.)},
			res: {value: new THREE.Vector2(w,h)},
		},
		vertexShader: document.getElementById("vertShader").textContent,
		fragmentShader: document.getElementById("rt_fragShader").textContent,
	});
	const rtPlane = new THREE.Mesh(rtG,rtM);

	rtScene.add(rtPlane);

	const canvG = new THREE.BoxBufferGeometry(1,1,1);
	const canvM = new THREE.MeshBasicMaterial({color: "white"});
	const canv = new THREE.Mesh(canvG,canvM);


	const canG = new THREE.PlaneBufferGeometry(1,1,1);
	const canM = new THREE.MeshBasicMaterial({map:imgTex,transparent:true});
	const canM2 = new THREE.ShaderMaterial({
		uniforms: {
			tex: { type: "t", value: imgTex },
			iTime: {type: 'f', value: 0.0},
			res: {value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
			cBuffer: {type: "t", value: renderTarget.texture},
			nL: {type: 'f', value: 7.},
			sR: {type: 'f', value: 4.},
			smoothV: {type: 'i', value: 1},
			colored: {type: 'f', value: 1},
		},
		transparent:true,
		side: THREE.DoubleSide,
		vertexShader: document.getElementById("vertShader").textContent,
		fragmentShader: document.getElementById("fragShader").textContent,
	});
	console.log(typeof(3),"hi");
	const can = new THREE.Mesh(canG,canM2);
	can.position.set(0,0,0.505);
	canv.add(can);
	canv.position.set(0,-1.92,3.16);
	canv.scale.set(1,2.64,0.05);
	canv.rotateOnWorldAxis(xa,-Math.PI/12);
	
	scene.add(canv);

	var texDim;

	// imgTex = loadTexture("DragPhotoTex.png");
	imgTex  = new THREE.TextureLoader().load( "DragPhotoTex.png" ,function(){
		texDim = new THREE.Vector2(imgTex.image.width,imgTex.image.height);
		var canvSc = canv.scale;
		canv.scale.set(canvSc.y*(texDim.x/texDim.y),canvSc.y,canvSc.z);
		imgLoaded = true;

	});
	canM.map = imgTex;
	canM2.uniforms.tex.value = imgTex;

	var scene3 = new THREE.Scene();

	const fPlaneG = new THREE.PlaneBufferGeometry(1,1,32);
	const fPlane = new THREE.Mesh(fPlaneG,can.material);
	//fPlane.scale.set(texDim.x,texDim.y);
	fPlane.scale.set(w,h,1);
	scene3.add(fPlane);
	
	



	var mouldC;
	var mouldE;

	gltfLoader.load("corner_moulding.glb",
	function ( gltf ) {
		mouldC = gltf.scene.children[0];
		mouldE = gltf.scene.children[1];
		var mouldM = new THREE.MeshStandardMaterial({
			color:new THREE.Color("rgb(200,200,255)"),
			roughness:0.5,
			side:THREE.DoubleSide,
		});
		var eG = mouldE.geometry;
		var cG = mouldC.geometry;

		var edge1 = new THREE.Mesh(eG,mouldM);
		var edge2 = new THREE.Mesh(eG,mouldM);
		var edge3 = new THREE.Mesh(eG,mouldM);
		var edge4 = new THREE.Mesh(eG,mouldM);

		var corner1 = new THREE.Mesh(cG,mouldM);
		var corner2 = new THREE.Mesh(cG,mouldM);
		var corner3 = new THREE.Mesh(cG,mouldM);
		var corner4 = new THREE.Mesh(cG,mouldM);

		
		var xS = 1/12;
		var zS = xS*1.2;

		var curSc = {...edge1.scale};
		
		edge1.scale.set(curSc.x*xS,curSc.y*16-xS*4,curSc.z*zS);
		edge2.scale.set(curSc.x*xS,curSc.y*16-xS*4,curSc.z*zS);
		edge3.scale.set(curSc.x*xS,curSc.y*14-xS*4,curSc.z*zS);
		edge4.scale.set(curSc.x*xS,curSc.y*14-xS*4,curSc.z*zS);

		var curCSc = {...corner1.scale};

		corner1.scale.set(curCSc.x*xS,curCSc.y*xS,curCSc.z*zS);
		corner2.scale.set(curCSc.x*xS,curCSc.y*xS,curCSc.z*zS);
		corner3.scale.set(curCSc.x*xS,curCSc.y*xS,curCSc.z*zS);
		corner4.scale.set(curCSc.x*xS,curCSc.y*xS,curCSc.z*zS);

		edge1.position.set(7,-5,8);
		edge1.rotateOnWorldAxis(xa,Math.PI/2);
		edge2.position.set(-7,-5,8);
		edge2.rotateOnWorldAxis(xa,Math.PI/2);
		edge2.rotateOnWorldAxis(ya,Math.PI);
		edge3.position.set(0,-5,0);
		edge3.rotateOnWorldAxis(xa,Math.PI/2);
		edge3.rotateOnWorldAxis(ya,Math.PI/2);
		edge4.position.set(0,-5,16);
		edge4.rotateOnWorldAxis(xa,Math.PI/2);
		edge4.rotateOnWorldAxis(ya,-Math.PI/2);

		corner1.position.set(7,-5,0);
		corner1.rotateOnWorldAxis(xa,Math.PI/2);
		corner1.rotateOnWorldAxis(ya,Math.PI/2);
		corner2.position.set(-7,-5,0);
		corner2.rotateOnWorldAxis(xa,Math.PI/2);
		corner2.rotateOnWorldAxis(ya,Math.PI);
		corner3.position.set(7,-5,16);
		corner3.rotateOnWorldAxis(xa,Math.PI/2);
		corner4.position.set(-7,-5,16);
		corner4.rotateOnWorldAxis(xa,Math.PI/2);
		corner4.rotateOnWorldAxis(ya,-Math.PI/2);

		scene.add(edge1);
		scene.add(edge2);
		scene.add(edge3);
		scene.add(edge4);

		scene.add(corner1);
		scene.add(corner2);
		scene.add(corner3);
		scene.add(corner4);
	},
	function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {
		console.log( 'An error happened' );
	});

	const light = new THREE.AmbientLight(0xFFFFFF,0.2);
	scene.add(light);

	const ballLight = new THREE.PointLight(0xFFFFFF,1);
	ballLight.position.set(0,0,8);
	scene.add(ballLight);

	var lights = [];

	for(let i = 0; i<10;i++){
		var cLight = new THREE.SpotLight(0xFFFFFF,3);
		cLight.position.set(-6.5,-4.5,15 + (i/9)*-14);
		cLight.target.position.set(-6.5 -0.5,-4.5+0.5,15 + (i/9)*-14);
		cLight.angle = Math.PI/4;
		cLight.penumbra = 1;
		cLight.decay = 0.1;
		scene.add(cLight);
		scene.add(cLight.target);
		lights.push(cLight);
	}

	for(let i = 0; i<10;i++){
		var cLight = new THREE.SpotLight(0xFFFFFF,3);
		cLight.position.set(6.5,-4.5,15 + (i/9)*-14);
		cLight.target.position.set(6.5 +0.5,-4.5+0.5,15 + (i/9)*-14);
		cLight.angle = Math.PI/4;
		cLight.penumbra = 1;
		scene.add(cLight);
		scene.add(cLight.target);
		lights.push(cLight);
	}

	// var params = {
	// 	intensity:1,
	// 	decay:1,
	// 	tall:2.6,
	// 	depth:0.11,
	// 	y:-1.9,
	// 	z:3.2,
	// }

	// var params = {
	// 	numLayers:4,
	// 	blurRadius:4,
	// 	toggleColor:changeOpacity,
	// 	toggleFilter: toggleFilter,
	// 	widthColor:0.3,
	// }

	// function changeOpacity(){
	// 	//console.log(params["toggleColor"]);
	// 	colPlane.material.opacity = 1.- colPlane.material.opacity;
	// 	sel1.material.opacity = 1. - sel1.material.opacity;
	// 	sel2.material.opacity = 1. - sel2.material.opacity;
	// }

	function toggleFilter(){
		if(can.material == canM){
			can.material = canM2;
		}else if (can.material == canM2){
			can.material = canM;
		}

		fPlane.material = can.material;
	}

	// var gui = new GUI();
	// GUI.toggleHide();
	// gui.add(params,"numLayers").min(2).max(10).step(1).onChange(function(){
	// 	canM2.uniforms.nL.value = params["numLayers"];
	// });
	// gui.add(params,"blurRadius").min(0).max(8).step(1).onChange(function(){
	// 	canM2.uniforms.sR.value = params["blurRadius"];
	// });
	// gui.add(params,"toggleColor");
	// gui.add(params,"widthColor").min(0.1).max(1).step(0.01).onChange(function(){
	// 	var cpScale = colPlane.scale;
	// 	colPlane.scale.set(colPw*params["widthColor"],cpScale.y,1);
	// 	colPlane.position.set(w/2-colPw*params["widthColor"]/2,-h/2+selH + colPh/2,0);
	// 	var selScale = sel1.scale;
	// 	sel1.scale.set(selW*params["widthColor"],selScale.y,1);
	// 	sel2.scale.set(selW*params["widthColor"],selScale.y,1);
	// 	sel1.position.set(w/2-selW*params["widthColor"]*(3/2),-h/2+selH/2,0);
	// 	sel2.position.set(w/2-selW*params["widthColor"]/2,-h/2+selH/2,0);
	// });
	// gui.add(params,"toggleFilter");

	var movL = 0,movR = 0,movF = 0,movB = 0;
	//var freePosition = true;
	var xFired = false;
	var jumpFired = false;
	var jumpAcc = 0;
	var jumping = false;
	document.addEventListener("keydown",function(e){
		if(e.keyCode == 65 || e.keyCode == 37){//A
			movL = 1;
		} else if (e.keyCode == 87 || e.keyCode == 38){//W
			movF = 1;
		}else if (e.keyCode == 68 || e.keyCode == 39){//D
			movR = 1;
		}else if (e.keyCode == 83 || e.keyCode == 40){//S
			movB = 1;
		} else if (e.keyCode == 88){
			var dist = Math.pow(Math.pow(player.position.x,2)+Math.pow(player.position.z-easel.position.z,2),0.5);
			if(dist<4){
			freePosition = !freePosition;
			if(!xFired){
				xFired = true;
				GUI.toggleHide();
				if(!freePosition){
					// colM.opacity = 1;
				 //    Mat1.opacity = 1;
				 //    Mat2.opacity = 1;
				 //    saveM.opacity = 1;
					document.exitPointerLock();
					xFired = !xFired;
					player.position.set(0,-1.2,6.2);
					player.rotation.set(0,0,0);
					playerRot.rotation.set(-0.21,0,0);
				} else {
					canvas.requestPointerLock();
					// colM.opacity = 0;
				 //    Mat1.opacity = 0;
				 //    Mat2.opacity = 0;
				 //    saveM.opacity = 0;
				}
			}
			
			}
		}
		 else if (e.keyCode == 32){
		 	// console.log(jumpFired,)
		 	
			if(player.position.y == -1.2 && freePosition){
				jumpAcc = 1;
				jumping = true;
				//setTimeout(function(){jumpAcc = 0},1000);
			}
			//console.log(jumpAcc,player.position.y,freePosition);
		}
	});

	document.addEventListener("keyup",function(e){
		if(e.keyCode == 65 || e.keyCode == 37){//A 
			movL = 0;
		} else if (e.keyCode == 87 || e.keyCode == 38){//W
			movF = 0;
		}else if (e.keyCode == 68 || e.keyCode == 39){//D
			movR = 0;
		}else if (e.keyCode == 83 || e.keyCode == 40){//S
			movB = 0;
		} else if (e.keyCode == 88){
			xFired = false;
		}
		//  else if (e.keyCode == 32){
		// 	jumpFired = false;
		// 	jumpAcc = 0;
		// }
	});

	// var gui = new GUI();
	// gui.add(params,"intensity").min(0).max(10).step(0.01).onChange(function(){
	// lights.forEach(function(item, index){item.intensity = params["intensity"];})
	// });
	// gui.add(params,"decay").min(0).max(10).step(0.01).onChange(function(){
	// lights.forEach(function(item, index){item.decay = params["decay"];})
	// });
	// gui.add(params,"tall").min(0).max(3).step(0.01).onChange(function(){
	// 	var cS = canv.scale;
	// 	canv.scale.set(cS.x,params["tall"],cS.z);
	// });
	// gui.add(params,"depth").min(0).max(3).step(0.01).onChange(function(){
	// 	var cS = canv.scale;
	// 	canv.scale.set(cS.x,cS.y,params["depth"]);
	// });
	// gui.add(params,"z").min(0).max(5).step(0.01).onChange(function(){
	// 	canv.position.z = params["z"];
	// });
	// gui.add(params,"y").min(-3).max(3).step(0.01).onChange(function(){
	// 	canv.position.y = params["y"];
	// });

	class PickHelper {
		constructor() {
		    this.raycaster = new THREE.Raycaster();
		    this.pickedObject = null;
		    this.selectedObject = null;
		    this.pickedObjectSavedColor = 0;
		    this.uvs = new THREE.Vector2(0.,0.);
		    this.blinkColor = 0;
		    this.savedColor = 0;
		    this.useUVs = new THREE.Vector2(0.,0.);
	  }

	   pick(normalizedPosition, scene, camera, time,selObjs,clickableObjs) {
	   		
	   		if(selObjs.includes(this.selectedObject)){
	   		//this.blinkColor = (time * 8) % 2 > 1 ? 0xFFFF00 : this.savedColor;
	   		this.blinkColor = Math.sin(time*8) > 0.5 ? 0xFFFF00 : 0x000000;
	   		this.selectedObject.material.color.setHex(this.savedColor);
	   		this.selectedObject.material.emissive.setHex(this.blinkColor);
	   		}
	   		this.raycaster.setFromCamera(normalizedPosition, camera);
	   		// console.log("pick");

	   		const intersectedObjects = this.raycaster.intersectObjects(clickableObjs);

	   		if (intersectedObjects.length) {
		      // pick the first object. It's the closest one
		    this.pickedObject = intersectedObjects[0].object;
		    this.uvs = intersectedObjects[0].uv;
	    	} else{

	    		this.pickedObject = null;
	    	}
		}
	}

	const pickPosition = {x: 0, y: 0};
	clearPickPosition();
	 
	function getCanvasRelativePosition(event) {
	  const rect = canvas.getBoundingClientRect();
	  return {
	    x: (event.clientX - rect.left) * canvas.width  / rect.width,
	    y: (event.clientY - rect.top ) * canvas.height / rect.height,
	  };
	}
	 
	function setPickPosition(event) {
	  const pos = getCanvasRelativePosition(event);
	  pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
	  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
	}
	 
	function clearPickPosition() {
	  // unlike the mouse which always has a position
	  // if the user stops touching the screen we want
	  // to stop picking. For now we just pick a value
	  // unlikely to pick something
	  pickPosition.x = -100000;
	  pickPosition.y = -100000;
	}

	const pickHelper = new PickHelper();

	var ind;

	function selectionHandler(){
		//console.log(colObjs,pickHelper.pickedObject);

		clearInterval(ind);
		ind = setInterval(function(){
		if(colObjs.includes(pickHelper.pickedObject)){
			//console.log("pick col");
			pickHelper.useUVs = pickHelper.uvs;
			var uvs = {x: pickHelper.useUVs.x, y: pickHelper.useUVs.y};
			if(colData){
			var rgb = getCols(1.-uvs.y,uvs.x);
			pickHelper.savedColor = getColor(rgb.x,rgb.y,rgb.z).getHex();
			}
		}
		//console.log(!pickHelper.pickedObject);

		//could also write : else if(pickHelper.selectedObject)
		if(pickHelper.selectedObject && !colObjs.includes(pickHelper.pickedObject)){
				pickHelper.selectedObject.material.color.setHex(pickHelper.savedColor);
				pickHelper.selectedObject.material.emissive.setHex(0x000000);
				//Set selected shader color uniform to savedColor
				pickHelper.selectedObject = null;
				//Set selected shader uniform variable to null
			}
		if(selObjs.includes(pickHelper.pickedObject)){
			//set selected shader uniform variable to uniform variable placeholder based on selObjs index 
			pickHelper.selectedObject = pickHelper.pickedObject;
			pickHelper.savedColor = pickHelper.selectedObject.material.color.getHex();
		
		}


		if(slideObjs.includes(pickHelper.pickedObject)){

			var startPos =  pickHelper.pickedObject.position.x - pickHelper.pickedObject.scale.x/2 + pickHelper.pickedObject.contained.scale.x/2, endPos = pickHelper.pickedObject.position.x + pickHelper.pickedObject.scale.x/2 - pickHelper.pickedObject.contained.scale.x/2;

			if(pickHelper.pickedObject.radius){
				startPos += pickHelper.pickedObject.radius - pickHelper.pickedObject.contained.scale.x/2;
				endPos -=   pickHelper.pickedObject.radius - pickHelper.pickedObject.contained.scale.x/2;
			}

			if(pickHelper.pickedObject.numbs){
			var numSelections = pickHelper.pickedObject.numbs.length;
			var slide = (pickPosition.x*w/2-startPos)*(numSelections-1)/((endPos-startPos));
			var slide1 = Math.round(slide);

			var slide2 = (slide1*((endPos-startPos))/(numSelections-1)) + startPos;
			


			pickHelper.pickedObject.contained.position.x = slide2;
			if(pickHelper.pickedObject.contained.position.x < startPos){pickHelper.pickedObject.contained.position.x = startPos;}
			if(pickHelper.pickedObject.contained.position.x > endPos){pickHelper.pickedObject.contained.position.x = endPos;}


			if(Math.abs(slide1) != pickHelper.pickedObject.currN){
				// console.log(pickHelper.pickedObject.currN,slide1);
				pickHelper.pickedObject.numbs[pickHelper.pickedObject.currN].visible = false;
				pickHelper.pickedObject.numbs[Math.abs(slide1)].visible = true;
				pickHelper.pickedObject.currN = Math.abs(slide1);
	

			}
			}
			if(pickHelper.pickedObject.contained.border){
				pickHelper.pickedObject.contained.border.position.x = pickHelper.pickedObject.contained.position.x;
			}

			var selection = pickHelper.pickedObject.selection;
			// console.log(selection);
			if(selection == "layers"){
			canM2.uniforms.nL.value = slide1 + pickHelper.pickedObject.minN;
			} else if (selection == "blur"){
			canM2.uniforms.sR.value = slide1 + pickHelper.pickedObject.minN;
			} else if(selection == "smooth"){
				canM2.uniforms.smoothV.value = slide1 + pickHelper.pickedObject.minN;
			}
			

		 }

		 

		},1000/30);

		
	}

	var imgData;

	//need to make dl a element, imgData, fPlane on scene3 with imgLoaded
	var dl = document.getElementById("dl");
	dl.addEventListener("click",function(){
		this.href = imgData;
  		this.download = "toutput.jpeg";
	})

	function clickHandler(){
		//console.log("saver clicked", saveObjs.includes(pickHelper.pickedObject), imgLoaded);
		if(saveObjs.includes(pickHelper.pickedObject) && imgLoaded){
			console.log(w,h);
			console.log(texDim.x,texDim.y);
			fPlane.material = can.material;
			fPlane.scale.set(w,h,1);
			renderer.setSize(texDim.x,texDim.y);
			renderer.render(scene3,camera2);
			imgData = renderer.domElement.toDataURL('image/jpeg',1.0);
			dl.click();
			renderer.setSize( window.innerWidth, window.innerHeight );
		}

		if(toggleFilterObjs.includes(pickHelper.pickedObject)){
		 	toggleFilter();
		 }

		if(toggleColorObjs.includes(pickHelper.pickedObject)){
			canM2.uniforms.colored.value = 1-canM2.uniforms.colored.value;
		}

	}

	canvas.addEventListener("click",clickHandler);

	canvas.addEventListener("mousedown", selectionHandler);
	canvas.addEventListener("mouseup", function(){clearInterval(ind)})

	 
	window.addEventListener('mousemove', setPickPosition);
	window.addEventListener('mouseout', clearPickPosition);
	window.addEventListener('mouseleave', clearPickPosition);

	document.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    camera2.aspect = window.innerWidth / window.innerHeight;
	camera2.updateProjectionMatrix();
    w = h * camera.aspect;

    renderer.setSize( window.innerWidth, window.innerHeight );

    fullPart.reframeChildrenMeshes(w);


	}

	var viewer = document.createElement("div");
	//document.body.appendChild(viewer);
	
	var distInt;
	var notInDist = true;
	var jumpVel = 0;
	var first = true;
	var nu = 0;
	var n2 = 0;
	var fInt1,fInt2;

	function fadeFov(){
		var sFov = 160;
		camera.fov = sFov;
		var numSecs = 5;
		var numFrames = numSecs*60;
		fInt1 = setInterval(function(){
			if(nu<numFrames){
			camera.fov -= (sFov-58)/numFrames;
			camera.updateProjectionMatrix();
			nu++;}
			else{ nu = 0; clearInterval(fInt1);}

		},1000/60);
	}

	function fadeLights(){
		ballLight.intensity = 0;
		light.intensity = 0;
		lights.forEach(function(item, index){item.intensity = 0;});
		fInt2 = setInterval(function(){
			if(n2<10){
				lights[n2].intensity = 3;
				lights[n2+10].intensity = 3;
			} else {
				ballLight.intensity = 1;
				light.intensity = 0.2;
				n2 = 0; 
				clearInterval(fInt2);
			}
			n2++;
		},1000/5);
	}

	// let selObjs = [],colObjs = [],saveObjs = [],clickableObjs = [];
	clickableObjs.push(...selObjs);
	clickableObjs.push(...colObjs);
	clickableObjs.push(...saveObjs);
	clickableObjs.push(...slideObjs);
	clickableObjs.push(...toggleFilterObjs);
	clickableObjs.push(...toggleColorObjs);

	function render(time){

		if(first){
			fadeLights();
			//fadeFov();
			
			if(sel1){
				rtM.uniforms.col1.value = new THREE.Vector3(sel1.material.color.r,sel1.material.color.g,sel1.material.color.b);
			}
			if(sel2){
				rtM.uniforms.col2.value = new THREE.Vector3(sel2.material.color.r,sel2.material.color.g,sel2.material.color.b);
			}
			renderer.setRenderTarget(renderTarget);
			renderer.render(rtScene, rtCamera);
			renderer.setRenderTarget(null);
			// if(nu>1){
			// 	first = false;
			// }
			// nu++;
			first = false;
		}


		time *= 0.001;

		if(freePosition){
		if(player){

			if(jumping){
				console.log(jumpVel,jumpAcc);
				jumpVel += jumpAcc*1;
				jumpAcc -= 0.2;
				if(jumpAcc <-0.2){jumpAcc = -0.2;}
				player.translateY(jumpVel/10);
			}
				
			if(player.position.y < -1.2){
				jumping = false;
				jumpAcc = 0;
				jumpVel = 0;
				player.position.y = -1.2;
			}

			
			

			var movFB = movF-movB;
			var movLR = movR-movL;
			playerRot.rotation.set(0,0,0);
			player.rotation.set(0,0,0);
			player.rotateOnWorldAxis(ya,-xmov/2000);
			playerRot.rotateOnAxis(xa,-ymov/2000);
			 player.translateZ(-movFB/10);
			 player.translateX(movLR/10);
			 if(Math.abs(player.position.x)>6.7){player.position.x -= Math.sign(player.position.x)*0.1;}
			 if(Math.abs(player.position.z-8)>7.7){player.position.z -= Math.sign(player.position.z-8)*0.1;}
			 if(easel){
			 var dist = Math.pow(Math.pow(player.position.x,2)+Math.pow(player.position.z-easel.position.z,2),0.5);
			 if(dist<4){
			 	if(notInDist){
			 		notInDist = false;
			 		xSigM.opacity = 1;
			 		distInt = setInterval(function(){
			 			xSigM.opacity -= 1/60;
			 			if(xSigM.opacity<=0){
			 				clearInterval(distInt);
			 			}
			 		},2000/60);

			 	}
			 } else {
			 	notInDist = true;
			 	//xSigM.opacity = 0;
			 }
			  
			 }
		}
		} else {
			

			if(sel1){
				rtM.uniforms.col1.value = new THREE.Vector3(sel1.material.color.r,sel1.material.color.g,sel1.material.color.b);
			}
			if(sel2){
				rtM.uniforms.col2.value = new THREE.Vector3(sel2.material.color.r,sel2.material.color.g,sel2.material.color.b);
			}

			renderer.setRenderTarget(renderTarget);
			renderer.render(rtScene, rtCamera);
			renderer.setRenderTarget(null);



			pickHelper.pick(pickPosition, scene2, camera2, time,selObjs,clickableObjs);
			notInDist = true;
			xSigM.opacity = 0;
			// colM.opacity = 1;
			// Mat1.opacity = 1;
			// Mat2.opacity = 1;
		}
		if(player){
			viewer.innerText = player.position.x.toFixed(4) + ", " + player.position.y.toFixed(4) + ", " +player.position.z.toFixed(4)
			 + ";   "+ playerRot.rotation.x.toFixed(4) + ", " +player.rotation.y.toFixed(4) + ", " +playerRot.rotation.z.toFixed(4)+ ";; xFired " + xFired;
		}

		renderer.clear();
	 	renderer.render(scene,camera);
	 	renderer.clearDepth();
	 	renderer.render(scene2,camera2);
	 	if(!freePosition){
	 	renderer.clearDepth();
	 	renderer.render(transparentScene,camera2);
	 	renderer.clearDepth();
	 	renderer.render(opaqueScene,camera2);
	 	}

		requestAnimationFrame(render);
	}
	var startInt = setInterval(function(){
		if(imgLoaded){
			clearInterval(startInt);
			requestAnimationFrame(render);
		}
	},1000/30);
	//requestAnimationFrame(render);


}

main();
