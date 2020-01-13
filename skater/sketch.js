var yoff = 0;
var xoff = 0;
var value = 0;
var upper = 0;
var yvel = 10;
var xvel = 0;
var paths = [];
var yacc = 0;
let px,py;
let x,y;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight,WEBGL);
  
}

function draw() {
  background(163,184,200);
  noStroke();
  fill(248,196,113);
  rect(-width/2,-height/2,width,100);
  
  if (keyIsDown(UP_ARROW)){
   yacc += 0.1; 
  } else if (keyIsDown(DOWN_ARROW)){
   yacc += -1; 
  } else {
   yacc = yacc*0.8; 
  }
  
  yvel += yacc;
  if (yvel > 100){
    yvel = 100;
  } else if (yvel <5){
   yvel = 5; 
  }
  //console.log(yvel);
  yoff += yvel;
  if (yoff >1200){
   yoff = 0 
  }
  rotateX(PI/3);
  translate(0,yoff,0);
  fill(255);
  rect(0,-600,10,100);
  fill(215,247,220);
  translate(0,0,1);
  if (keyIsDown(RIGHT_ARROW)){
   xvel += 2; 
  } else if (keyIsDown(LEFT_ARROW)){
   xvel += -2; 
  } else {
   xvel = xvel *0.8 
  }
  
  
  xoff += xvel;
  if (xoff >width/3){
    xoff = width/3;
    xvel = 0;
  } else if (xoff <-width/3) {
    xoff = -width/3;
    xvel = 0;
  }
  ellipse(5+xoff,-yoff,45,100);
  fill(0);
  translate(xoff,-yoff+45,-5);
  ellipsoid(3,5,5,10,10);
  translate(10,0,0);
  ellipsoid(3,5,5,10,10);
  translate(0,-90,-10);
  ellipsoid(3,5,5,10,10);
  translate(-10,0,0);
  ellipsoid(3,5,5,10,10);
  fill(255);
  translate(0,90,10);
  //console.log(yacc);
  if (paths.length < 200){
    paths[paths.length] = new Path(0,0);
    paths[paths.length] = new Path(10,0);
    //paths.splice(paths.length-1,1,new Path());
  } else {
    paths.splice(0,2);
    paths[paths.length] = new Path(0,0);
    paths[paths.length] = new Path(10,0);
  }
  
  //console.log(paths);
  for (var i = 0; i< paths.length;i++){
    px = paths[i].pos.x;
    py = paths[i].pos.y;
    paths[i].update(-xvel,yvel/10);
    x = paths[i].pos.x;
    y = paths[i].pos.y;
    strokeWeight(2);
    //print(px,py,0,x,y,0);
    stroke(0);
    line(px,py,0,x,y,0);
    //paths[i].show(); 
    //console.log(paths[i].pos.y);
  }
  
}


// function keyPressed() {
//   if (keyCode === LEFT_ARROW) {
//     value = -10;
//   } else if (keyCode === RIGHT_ARROW) {
//     value = 10;
//   }
// }


function Path(xcurr,ycurr){
  this.pos = createVector(xcurr,ycurr);
  this.r = 10;
  
  this.update = function(xoffset,yoffset) {
    this.pos.add(createVector(xoffset,yoffset));
  }
  this.show = function() {
    noStroke();
    fill(50);
    ellipse(this.pos.x,this.pos.y,this.r/2,this.r*2); 
  }
}
