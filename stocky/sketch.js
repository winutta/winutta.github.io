let table;
let row;
let dur = 250;
let rows = [];
let dates = [];
let count = 0;
let maxIters;
let m0,m1;
let multi, midpoint;
let moving = true;
let ystep,xstep;
let ypos = 0;
let num_horiz = 60;
let num_vert;
let num_spaces = 12;
let xoff = 0;
let ypos2 = 0;

function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable('FB_2015_today.csv', 'csv', 'header');
  //the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
  //                  "csv", "header");
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  for (let i = 0; i < table.getRowCount(); i++) {
    rowVal = table.getRow(i).getNum(2);
    dateVal = table.getRow(i).get(1);
    rows[i] = rowVal;
    dates[i] = dateVal;
    //print(rowVal);
    //print(typeof row.getNum(2));
  }
  //print(dates);
  maxIters = table.getRowCount() - dur;
  //print(maxIters);
  m1 = max(rows);
  m0 = min(rows);
  
  scaler = height*1;
  
  midpoint = (m1 + m0)/2;
  multi = scaler/(m1-m0);
  print(midpoint);
  print(multi);
  ymult = (height/max(rows)*0.8);
  
  xstep = width/(num_vert-1);
  print(xstep*1.0/(width/(dur-1)));
  print(xstep,width/(dur-1));
  //xstep = ((width*width)/(dur-1))/num_verts;
  ystep = height/(num_horiz-1);
  //print(min(rows));
  num_vert = int(Math.floor(dur/num_spaces));
  print(num_vert);


}

function draw() {


  background(255);
  //square(width-10,height-100,10,10)
  
  if (count > maxIters) {
    xoff = 0;
    count = 0;
  } else if (count < 0 ){
    count = maxIters;
    xoff = 0;
  } else {
   //print(xoff,count); 
  }
  
  //rotateX(PI);
  translate(0,height);
  
  
  fill(0,0,255);
  textSize(32);
  text('word', 10, -30);
  strokeWeight(1);
  
  noFill();
  beginShape();
  //For Future Effort, Try to match the movement of this because it is what we are interested in!
  bin = 0;
  for (let j = count; j < count + dur; j++) {
    bin++;
    //rowVal = table.getRow(j).getNum(2);
    rowVal = rows[j];
    vertex((bin/(dur-1))*width, -((rowVal-midpoint)*multi+height/2));
  }
  endShape();
  
  
  
  strokeWeight(0.2);
  ypos = 0;
  for (let k = 0; k < num_horiz;k++){
    //Draw a horizontal line
    beginShape();
    for (let j = 0; j < 11; j++) {
      vertex((j/10)*width, ypos);
    }
    endShape();
    
    ypos -= ystep;
  }
  bin = 0;
  for (let k = 0; k < dur+1;k++){
    
    if (k%num_vert==0){
      let xcoffer = count%num_vert;
      //Draw a vertical line
      beginShape();
      for (let j = 0; j < 11; j++) {
        vertex(((bin-xcoffer)/dur)*width,-(j/10)*height);
      }
      endShape();
    }  
    bin++;
  }
  
  
  /*
  //ypos = 0;
  ypos2 = xoff;
  for (let k = 0; k < num_vert;k++){
    //Draw a vertical line
    beginShape();
    for (let j = 0; j < 11; j++) {
      vertex(ypos2,-(j/10)*height);
    }
    endShape();
    ypos2 += xstep;
    //ypos += xstep;
  }
  
  */
  //print("x step", xstep);
  //print("offset step",width/(dur));
  
  bin = 0;
  for (let j = count; j < count + dur+num_vert; j++) {
    
    //rowVal = table.getRow(j).getNum(2);
    if ((bin)%num_vert==0){
      let xoffer = count%num_vert;
      
      
      rowValer = dates[j-xoffer];

      fill(0,0,255);
      textSize(8);
      
      text(rowValer.slice(0,7),((bin-xoffer)/(dur))*width, -height/2-ystep/2);
      
    }
    bin++;
    
  }
  endShape();
  
  
  /*
  ypos2 = xoff;
  //print(xoff)
  //print(ypos2);
  //print(count);
  for (let k = 0; k < num_vert;k++){
    fill(0,0,255);
    textSize(8);
    //print();
    //print(ypos2,int(ypos2*(dur/width))+count);
    //print(xoff,count);
    text(dates[int(Math.ceil(ypos2*((dur)/width)))+count].slice(0,7), ypos2, -height/2-ystep/2);
      ypos2 += xstep;
    
  
  }
  */
  
  if (moving) {
    //translate(-width/2,0)
    //print(mouseX);
    let mag = 4
    moveX = int(map(mouseX,0,width,-mag,mag));
    //print(moveX);
    count += moveX;
    xoff -= (width/(dur-1))*moveX;
    //print(xoff);
    //print(xstep);
    if (xoff < -xstep){
     //xoff += (width/(dur-1))*moveX; 
      xoff = 0;
    } else if (xoff > 0){
     //xoff += (width/(dur-1))*moveX; 
      xoff = -xstep;
    }
    //print(xoff,count);
  }
  
}

function mouseClicked(){
 moving = !moving; 
}
