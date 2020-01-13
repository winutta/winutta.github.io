let canvas;

function setup() {
  //print(window.innerWidth,window.innerHeight);
  canvas = createCanvas(window.innerWidth, window.innerHeight-120);
  canvas.position(0,120);
  canvas.style("z-index","-1");
  
  background(255,255,255);
  strokeWeight(4);
}

function draw() {
  
  if (mouseIsPressed) {
   line(pmouseX,pmouseY,mouseX,mouseY); 
  }
  
}
