let ppmouseX = 0;
let ppmouseY = 0;
let pppmouseX = 0;
let pppmouseY = 0;
let button;
let drawings = [];
let playingAnim = false;
let itera = 0;
let drawing = false;
let swirly = false;
let colorButtons = [];
let colors = [];
let colorFunctions;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight-100);
  background(255);
  noFill();
  stroke(0, 0, 108);
  
  saveButton = createButton("Save");
  playButton = createButton("Play");
  resetButton = createButton("Reset Saved Drawings");
  resetButton.position(window.innerWidth-resetButton.width-100,window.innerHeight-100,'sticky');
  swirlyButton = createButton("Toggle Swirly");
  clearButton = createButton("Clear Screen");
  // cyan = createButton("");
  // cyan.size(20,20);
  // cyan.position(200,200);
  colors = [color(148,0,211,255),
            color(75,0,130,255),
           color(0,0,255,255),
           color(0,0,108,255),
           color(0,255,0,255),
           color(255,255,0,255),
           color(255,127,0,255),
           color(255,0,0,255),
           color(255,255,255,255)];
  
  for(let i = 0;i<colors.length;i++){
    colorButtons.push(createCButton(colors[i],280+i*20,15)); 
  }
  
  rSlider = createSlider(2, 50, 10);
  rSlider.position(20, 20);
}

function setColor(ind){
  stroke(colors[ind]);
}


  

function createCButton(rgb,x,y){
  let b = createButton("");
  b.size(20,20);
  b.position(x,y);
  b.style('background-color', rgb);
  return b;
}

function saveDrawing() {
  //save("sketchy.png"); 
  drawings.push(get());
}

function clearDrawings(){
 drawings.length = 0; 
}

function playAnim() {
  clear();
  image(drawings[itera], 0, 0);
  itera++;
  if (itera >= drawings.length) {
    playingAnim = false;
    itera = 0;
  } else{
   setTimeout(playAnim,200);
  }
  }

function startAnim(){
  if (drawings.length>0){
    itera = 0;
    playingAnim = true;
    playAnim();
  } else {
    clear();
  }
}

function setSwirly(){
 swirly = !swirly; 
}

  function draw() {
    //console.log(drawings.length);
    //console.log(frameRate());
    push()
    strokeWeight(1.0);
    textSize(20.0);
    noStroke();
    //stroke(0.0);
    fill(0,206,209);
    //noFill();
    text('Line Width', rSlider.x * 2 + rSlider.width, 35);
    pop();
    if (!playingAnim) {
      //strokeWeight(10);
      strokeWeight(rSlider.value());
      
      beginShape();

      //if (mouseIsPressed) {
      if(keyIsDown(32)){
        vertex(ppmouseX, ppmouseY); // first point
        if(swirly){
          d0 = pow(pow(pmouseX - ppmouseX, 2) + pow(pmouseY - ppmouseY, 2), 0.5) / 100;
          d1 = pow(pow(pmouseX - mouseX, 2) + pow(pmouseY - mouseY, 2), 0.5) / 100;
        } else {
          d0 = 100;
          d1 = 100;
        }
        //bezierVertex((2*ppmouseX-pppmouseX),(2*ppmouseY-pppmouseY), (2*pmouseX - mouseX), (2*pmouseY - mouseY),pmouseX, pmouseY);
        bezierVertex((pmouseX + (pmouseX - ppmouseX) * 1 / d0), (pmouseY + (pmouseY - ppmouseY) * 1 / d0), (pmouseX + (pmouseX - mouseX) * 1 / d1), (pmouseY + (pmouseY - mouseY) * 1 / d1), pmouseX, pmouseY);
        //bezierVertex((ppmouseX+(ppmouseX-pppmouseX)*1/d0),(ppmouseY+(ppmouseY-pppmouseY)*1/d0), (ppmouseX + (ppmouseX-pppmouseX)*1/d1), (ppmouseY + (ppmouseY-pppmouseY)*1/d1),pmouseX, pmouseY);
        //bezierVertex(25, 125, 75, 140, 120, 120);
        endShape();

      }
      
      
      saveButton.mousePressed(saveDrawing);
      playButton.mousePressed(startAnim);
      resetButton.mousePressed(clearDrawings);
      swirlyButton.mousePressed(setSwirly);
      clearButton.mousePressed(function() {clear();});
      for(let i = 0;i<colorButtons.length;i++){
         colorButtons[i].mousePressed(function() {setColor(i);});
      }
    }
    pppmouseX = ppmouseX;
    pppmouseY = ppmouseY;
    ppmouseX = pmouseX;
    ppmouseY = pmouseY;
  }

function keyPressed() {
  if (keyCode === 86) {
    saveDrawing();
  }
}
