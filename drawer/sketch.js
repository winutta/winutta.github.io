let ppmouseX = 0;
let ppmouseY = 0;
let pppmouseX = 0;
let pppmouseY = 0;

var firstMove;

window.addEventListener('touchstart', function (e) {
    firstMove = true;
});

window.addEventListener('touchmove', function (e) {
    if (firstMove) {
        e.preventDefault();

        firstMove = false;
    }
},{passive: false});

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(255);
  noFill();
  stroke(0,0,108);
}

function draw() {
  
  strokeWeight(2);
  
  beginShape();
  
  if (mouseIsPressed) {
    vertex(ppmouseX, ppmouseY); // first point
    d0 = pow(pow(pmouseX-ppmouseX,2)+pow(pmouseY-ppmouseY,2),0.5)/100;
    //d0 = 1.5;
    d1 =  pow(pow(pmouseX-mouseX,2)+pow(pmouseY-mouseY,2),0.5)/100;
    //d1 = 1.5;
    //bezierVertex((2*ppmouseX-pppmouseX),(2*ppmouseY-pppmouseY), (2*pmouseX - mouseX), (2*pmouseY - mouseY),pmouseX, pmouseY);
    bezierVertex((pmouseX+(pmouseX-ppmouseX)*1/d0),(pmouseY+(pmouseY-ppmouseY)*1/d0), (pmouseX + (pmouseX-mouseX)*1/d1), (pmouseY + (pmouseY-mouseY)*1/d1),pmouseX, pmouseY);
    //bezierVertex((ppmouseX+(ppmouseX-pppmouseX)*1/d0),(ppmouseY+(ppmouseY-pppmouseY)*1/d0), (ppmouseX + (ppmouseX-pppmouseX)*1/d1), (ppmouseY + (ppmouseY-pppmouseY)*1/d1),pmouseX, pmouseY);
  //bezierVertex(25, 125, 75, 140, 120, 120);
    endShape();
    
  }
  pppmouseX = ppmouseX;
  pppmouseY = ppmouseY;
  ppmouseX = pmouseX;
  ppmouseY = pmouseY;
}
