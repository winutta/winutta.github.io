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
  
  noFill();
  strokeWeight(2);
  beginShape();
  
  if (mouseIsPressed) {
    vertex(ppmouseX, ppmouseY); // first point
    d0 = pow(pow(ppmouseX-pppmouseX,2)+pow(ppmouseY-pppmouseY,2),0.5)/100;
    d1 =  pow(pow(pmouseX-mouseX,2)+pow(pmouseY-mouseY,2),0.5)/100;
    //bezierVertex((2*ppmouseX-pppmouseX),(2*ppmouseY-pppmouseY), (2*pmouseX - mouseX), (2*pmouseY - mouseY),pmouseX, pmouseY);
    bezierVertex((ppmouseX+(ppmouseX-pppmouseX)*1/d0),(ppmouseY+(ppmouseY-pppmouseY)*1/d0), (pmouseX + (pmouseX-mouseX)*1/d1), (pmouseY + (pmouseY-mouseY)*1/d1),pmouseX, pmouseY);
  //bezierVertex(25, 125, 75, 140, 120, 120);
    endShape();
    
  }
  pppmouseX = ppmouseX;
  pppmouseY = ppmouseY;
  ppmouseX = pmouseX;
  ppmouseY = pmouseY;
  
}
