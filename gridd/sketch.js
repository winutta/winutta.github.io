var cols, rows;
var scl = 20;
var w = 1200;
var h = 1000;
var heights = [];
var flyingX = 0;
var flyingY = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight,WEBGL);
  
  cols = w/scl;
  rows = h/scl;
  //console.log("Starting");
  for (let i = 0; i< rows;i++){
    heights.push([]);
    for (let j = 0; j < cols; j++) {
     heights[i].push(0); 
    }
    
  }
  
  
}

function draw() {
  background(0);
  stroke(255);
  //noStroke();
  noFill();
  rotateX(PI/3);
  translate(-h/2, -w/2)
  orbitControl();
  let horiz = norms(map(mouseX, 0, width,0.1,-0.1),1);
  let up = norms(map(mouseY, 0, height,0.1,-0.1),0.5);
  flyingX -= horiz;
  flyingY -= up;
  //console.log(mouseX,mouseY);
  //console.log(horiz,up);

  var yoff = flyingY;
  for (let y = 0;y<cols; y++) {
    var xoff = flyingX;
   for (let x = 0; x<rows; x++) {
    //console.log(x,y);
     
    heights[x][y] = (map(noise(xoff,yoff),0,1,-150,150));
    //console.log(heights[x])
    //ightsx.push(random(-10,10))
    //console.log(heights[x][y]);
    xoff += 0.1;
   }
    yoff += 0.1;  
  }
  for (var y = 0; y< cols-1; y++) {
    //let col = map(y/(cols-1),0,1,0,255);
    
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x<rows-1; x++){
      fill(0,map(heights[x][y],-150,150,0,255),map(heights[x][y],-150,150,0,255));
      //console.log(heights[x][y+1]);
      //console.log(x,y)
      vertex(x*scl,y*scl-300,heights[x][y]);
      vertex(x*scl,(y+1)*scl-300,heights[x][y+1]);
   }
    endShape();
  }
}

function norms(x,s) {
  //out = 1-(1.0/(s*Math.sqrt(2*PI)))*pow(Math.E,(-pow(x,2))/(2*pow(s,2)));
  x *= 8/0.3;
  out = Math.sign(x)*pow(x,2);
  out *= 0.3/8
  //console.log(x,out);
  return out;
}
