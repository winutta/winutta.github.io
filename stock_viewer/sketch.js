let startingOffsetforBins;
let r = [];
let r2 = [];
let currR;
let period;
let hVal;
let colsAdded = 0;
let numcols = 10;
let og_val;
let factors;

let table;
let row;
let dur = 250;
let rows = [];
let dates = [];
let count = 0;
let maxIters;
let m0, m1;
let multi, midpoint;
let moving = false;
let ypos = 0;
let num_horiz = 20;
let num_spaces = 12;
let ypos2 = 0;
let ind, rowValor;
let xoffer;
let price = []
let mult = [];
let row_vals, pos_vals, neg_vals;
let Orange, Purple, Blue, Green, Pink, Yellow;
let w;
let yoffset;
let pnumcols = -1;
let period_pos_sums, period_neg_sums;
let period_pos_p, period_neg_p;
let pposs, pnegs, period_neg_ps, period_pos_ps;
let cans = [];
let bin_size, bin_vals;
//let x;
let por;
let bin_max_mag;
let bin_min_mag;
let diff_mags;
let maxV

let sli;
let sli_sum;

let maxP;

let slic;
let slic_sum;

let lic;
let lic_sum;
let numb;

let sub_row_vals1, pos_vals1, neg_vals1, total_pos1, total_neg1, total_mag1;
let sub_row_vals2, pos_vals2, neg_vals2, total_pos2, total_neg2, total_mag2;

let out = [];
let cum_asc_mags;

function preload() {
  table = loadTable('FB_mult_2015.csv', 'csv', 'header');

}

function setup() {

  setColors(); // Establish Color Options to Use

  createCanvas_Graphics(); //Create Canvas and graphics objects to plot to

  // Set possible and starting period,numcols combos by taking Factors

  factors = getFactors(dur);
  og_val = 3;
  por = 1;

  startingOffsetforBins = 0;

  createData(); //Create Data and Metrics
}


function draw() {

  resetLists();

  background(220);

  checkAndMove();
  checkResetCount();

  ncp = get_numcols_period();
  numcols = ncp[0];
  period = ncp[1];

  numb = 50;

  maxIters = table.getRowCount() - dur - period;

  getperiodData();
  //print(bin_min_mag,bin_max_mag);
  
  if (pnumcols != numcols) {
    let maxminV = getmaxV();
    maxV = maxminV[0];
    minV = maxminV[1];
    maxP = getmaxP();
  }
  //print(period_pos_sums.slice(),period_neg_sums.slice());
  pos_mags = getMags(period_pos_sums, numb).map(function(item, index) {
    return item / total_mag1;
  });
  neg_mags = getMags(period_neg_sums, numb).map(function(item, index) {
    return item / total_mag1;
  });
  //print(pos_mags.slice(),neg_mags.slice());
  
  cum_asc_mags = cumMags(true,[pos_mags,neg_mags]);
  let cum_desc_mags = cumMags(false,[pos_mags,neg_mags]);

  plotCumMags([cum_asc_mags,cum_desc_mags],cans[7]);
  
  let cum_pos = cummulativeSum(period_pos_sums);
  let cum_neg = cummulativeSum(period_neg_sums);
  
  
  //print(cum_asc_mags[cum_asc_mags.length-1],cum_desc_mags[cum_desc_mags.length-1]);
  diff_mags = pos_mags.map(function(item, index) {
    // In this case item correspond to currentValue of array a, 
    // using index to get value from array b
    return item - neg_mags[index];
  });
  //print(pos_mags,neg_mags,diff_mags);
  
  //print(maxP);
  pnumcols = numcols;
  w = width / 2;

  topStockGraph(cans[0]); //Working Nicely?

  //bottomBinGraph(cans[1], [pposs, pnegs], startingOffsetforBins, Blue, Orange,false);
  bottomBinGraph(cans[2], [period_pos_sums, period_neg_sums], startingOffsetforBins, Purple, Green,true);
  bottomBinGraph(cans[3], [0, period_diff_sums], startingOffsetforBins, Purple, Green,false, 1 / 2);
  //print(neg_mags,pos_mags);
  //print(pos_mags.slice(),neg_mags.slice());
  
  graphMags([neg_mags, pos_mags], cans[4], Blue, Orange,0,20);
  graphMags([diff_mags, [0, 0]], cans[5], Purple, Green,0,20, 1 / 2);
  //print(period_diff_sums);
  //cummulativeSum(cans[6],period_diff_sums); 
  cumGraphSums(cans[6], [cum_pos, cum_neg], startingOffsetforBins, Purple, Green,true);
  
  image(cans[0], 0, 0);// log return plot
  //image(cans[1],width/2,height/2);
  image(cans[2], 0, height / 4); //Log Return bars
  image(cans[3], 0, 2 * height / 4); //Log Return Diff bars
  image(cans[4], width/2, height/4); // mag bars
  image(cans[5], width/2, 2*height / 4);// mag diff bars
  image(cans[6],0,3*height/4); // lr cum sum lines
  image(cans[7],width/2,3*height/4);// mag cum sum lines



}

function plotCumMags(data,canvas){
  canvas.background(220);
  //let cm1 = max(data[0]);
  //let cm0 = min(data[1]);
  
  let cm1 = Math.log(2);
  let cm0 = Math.log(0.5);
  let cmulti = (canvas.height/(cm1-cm0));
  let cmid = (cm1+cm0)/2;
  canvas.noFill();
  canvas.beginShape();
  for (let i = 0;i<data[0].length; i++){
    canvas.ellipse(canvas.width*i/(data[0].length-1),canvas.height-cmulti*(data[0][i])+cm0*cmulti,2,2);
   canvas.vertex(canvas.width*i/(data[0].length-1),canvas.height-cmulti*(data[0][i])+cm0*cmulti); 
  }
  canvas.endShape();
  
  canvas.beginShape();
  for (let i = 0;i<data[1].length ; i++){
    canvas.ellipse(canvas.width*i/(data[1].length-1),canvas.height-cmulti*(data[1][i])+cm0*cmulti,2,2);
   canvas.vertex(canvas.width*i/(data[1].length-1),canvas.height-cmulti*(data[1][i])+cm0*cmulti); 
  }
  canvas.endShape();
  
  canvas.line(0,canvas.height+cm0*cmulti,canvas.width,canvas.height+cm0*cmulti)
  
}

function cumMags(ascending,data){
  let out = [];
  //print(out);
  if (ascending){
    let pos_temp = data[0].slice();
    //print(data[0].slice());
    pos_temp = pos_temp.sort(function(a,b){return b-a;}).filter(function (val) {return val !=0;});
    //print(data[0].slice());
    let neg_temp = data[1].slice();
    neg_temp = neg_temp.sort(function(a,b){return a-b;}).filter(function (val) {return val !=0;});
    
    out[0] = 0
    //print(out);
    for (let i = 0; i<pos_temp.length;i++){
      out[i+1] = out[i] + pos_temp[i]; 
    }
    for (let j = pos_temp.length; j<pos_temp.length + neg_temp.length;j++){
      out[j+1] = out[j] - neg_temp[j-pos_temp.length]; 
    }
    
    out = out.slice(1,out.length);
    return out;
  } else {
    //print(data[0].slice());
    let pos_temp = data[0].slice();
    pos_temp = pos_temp.sort(function(a,b){return a-b;}).filter(function (val) {return val !=0;});
    //print(data[0].slice());
    let neg_temp = data[1].slice();
    neg_temp = neg_temp.sort(function(a,b){return b-a;}).filter(function (val) {return val !=0;});
    
//     pos_temp = spliceZeros(pos_temp);
//     neg_temp = spliceZeros(neg_temp);
    out = [];
    out.length = 0;
    
    out[0] = 0
    for (let i = 0; i<neg_temp.length;i++){
      out[i+1] = out[i] - neg_temp[i]; 
    }
    //print(out);
    for (let i = neg_temp.length; i<pos_temp.length + neg_temp.length;i++){
      out[i+1] = out[i] + pos_temp[i-neg_temp.length]; 
    }
    //print(pos_temp,neg_temp,out)
    out = out.slice(1,out.length);
    return out;
  }
  
  
}


function cummulativeSum (data) {
  //canvas.background(220);
  let dataList = []
  dataList[0] = 0
  for (let i = 0; i<data.length;i++){
   dataList[i+1] = dataList[i] + data[i]; 
  }
  dataList = dataList.slice(1,dataList.length);
  
  return dataList;
//   canvas.noFill();
//   canvas.stroke(0);
//   canvas.beginShape();
//   let d1 = max(dataList);
//   let d0 = min(dataList);
//   let dmult = canvas.height/(d1-d0);
//   //print(dataList,data);
//   for (let j = 0;j<dataList.length;j++) {
//    canvas.vertex((j/(dataList.length-1))*canvas.width, canvas.height-dataList[j]*dmult+dataList[0]*dmult); 
//   }
//   canvas.endShape();
  
//   canvas.line(0,canvas.height+d0*dmult,canvas.width,canvas.height+d0*dmult);
  
}

function cumGraphSums(canvas, data, so, C1, C2, stacker,mov = 0) {
  canvas.background(220);
  canvas.stroke(0);
  canvas.noFill();
  let stackerV = 0;
  let rad = 15;
  let ym = 1;
  let scl = 4.5;
  //print(maxV);
  canvas.stroke(0,200,0);
  canvas.fill(0,200,0);
  canvas.beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < numcols; i++) {
    canvas.vertex(canvas.width*i/numcols,canvas.height - (data[0][i]+data[1][i])*(canvas.height/scl));
    canvas.vertex(canvas.width*i/numcols,canvas.height);
  }
  canvas.endShape();
  
  canvas.stroke(0,0,200);
  canvas.fill(0,0,200);
  canvas.beginShape(TRIANGLE_STRIP);
  for (let i = 0; i < numcols; i++) {
    canvas.vertex(canvas.width*i/numcols,canvas.height - data[1][i]*(canvas.height/scl));
    canvas.vertex(canvas.width*i/numcols,canvas.height);
  }
  canvas.endShape();
  
  /*
  for (let i = 0; i < numcols + 1; i++) {
    if (stacker){
    
    rad = 0;
      ym = 0.5;
      stackerV = -(data[1][i]) * (canvas.height / (maxV))*ym;
    } else {
     stackerV = 0;
      rad = 15;
      ym = 1;
    }
    xoffer = (count % period);

    canvas.fill(C1);

    canvas.rect((i * (period) - xoffer) / (numcols * period) * canvas.width + so, canvas.height * (1 - mov), (1 / (numcols)) * canvas.width, -(data[1][i]) * (canvas.height / (maxV))*ym , 0, 0, rad, rad); // Percent of period's mag
    
    
    squareColor = C2;
    squareColor.setAlpha(0.25 * (255));
    canvas.fill(squareColor);
    canvas.rect((i * (period) - xoffer) / (numcols * period) * canvas.width + so, canvas.height + stackerV, (1 / (numcols)) * canvas.width, -(data[0][i]) * (canvas.height / (maxV))*ym, 0, 0, 15, 15); // Percent of period's mag
  }
  */
}


function resetLists() {
  pposs = [];
  pnegs = [];
  period_neg_ps = [];
  period_pos_ps = [];
  period_pos_sums = [];
  period_neg_sums = [];
  period_diff_sums = [];
  bin_vals = [];
  //binned = [];
  //mags = [];
  out = [];
  //print(out);
}

function setColors() {
  Orange = color(255, 127, 14); // Orange
  Purple = color(148, 103, 189); // Purple
  Blue = color(31, 119, 180); // Blue
  Green = color(44, 160, 44); //Green
  Pink = color(227, 119, 194); //Pink
  Yellow = color(188, 189, 34); // Yellow
}

function createData() {
  for (let i = 0; i < table.getRowCount(); i++) {
    dates[i] = table.getRow(i).get(1);
    price[i] = table.getRow(i).getNum(2);
    mult[i] = table.getRow(i).getNum(3);
    rows[i] = table.getRow(i).getNum(4);
  }

  all_mag = rows.reduce(function(total, num) {
    return total + num;
  });

  m1 = max(rows);
  m0 = min(rows);
  midpoint = (m1 + m0) / 2;
}

function createCanvas_Graphics() {
  createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < 5; i++) {
    cans[i] = createGraphics(width/2, height / 4);
    cans[i].clear();
  }
  for (let i = 5; i < 5 + 3; i++) {
    cans[i] = createGraphics(width/2, height / 4);
    cans[i].clear();
  }
  for (let i = 8; i < 8 + 2; i++) {
    cans[i] = createGraphics(width * (1 / 9), height / 3);
    cans[i].clear();
  }
  for (let i = 10; i < 10 + 4; i++) {
    cans[i] = createGraphics(width * (1 / 6), height * (1 / 6));
    cans[i].clear();
  }
}

function graphMags(data, canvas, C1, C2,b,e, mov = 0) {
  canvas.background(220);
  //print(maxP,data[1].length);
  //print(data[0].slice(),data[1].slice());
  let starting_point = b;
  //let ending_point = data[0].length;
  let ending_point = e;
  let loop_dur = ending_point - starting_point-1;
  for (let i = starting_point; i < ending_point; i++) {
    canvas.fill(C1);
    canvas.rect(((i-starting_point) / (loop_dur)) * canvas.width, canvas.height * (1 - mov), (1 / (loop_dur)) * canvas.width, -(data[0][i]) * (canvas.height/maxP )*(1-mov), 0, 0, 15, 15); // Percent of period's mag
    squareColor = C2;
    squareColor.setAlpha(0.25 * (255));
    canvas.fill(squareColor);
    canvas.rect(((i-starting_point) / (loop_dur)) * canvas.width, canvas.height * (1 - mov), (1 / (loop_dur)) * canvas.width, -(data[1][i]) * (canvas.height/maxP )*(1-mov), 0, 0, 15, 15);
  }
}

function get_numcols_period() {
  numcols = factors[og_val + colsAdded];
  period = int(dur / numcols);
  return [numcols, period];
}

function checkResetCount() {
  if (count > maxIters) {
    count = 0;
  } else if (count < 0) {
    count = maxIters - 1;
  } else {
    //print(xoff,count); 
  }
}

function bottomBinGraph(canvas, data, so, C1, C2, stacker,mov = 0) {
  canvas.background(220);
  canvas.noStroke();
  let stackerV = 0;
  let rad = 15;
  let ym = 1;
  //print(maxV);
  
  for (let i = 0; i < numcols + 1; i++) {
    if (stacker){
    
    rad = 0;
      ym = 0.5;
      stackerV = -(data[1][i]) * (canvas.height / (maxV))*ym;
    } else {
     stackerV = 0;
      rad = 15;
      ym = 1;
    }
    xoffer = (count % period);

    canvas.fill(C1);

    canvas.rect((i * (period) - xoffer) / (numcols * period) * canvas.width + so, canvas.height * (1 - mov), (1 / (numcols)) * canvas.width, -(data[1][i]) * (canvas.height / (maxV))*ym , 0, 0, rad, rad); // Percent of period's mag
    
    
    squareColor = C2;
    squareColor.setAlpha(0.25 * (255));
    canvas.fill(squareColor);
    canvas.rect((i * (period) - xoffer) / (numcols * period) * canvas.width + so, canvas.height + stackerV, (1 / (numcols)) * canvas.width, -(data[0][i]) * (canvas.height / (maxV))*ym, 0, 0, 15, 15); // Percent of period's mag
  }
}

function getperiodData() {
  bin_min_mag = 10;
  bin_max_mag = 0;
  
  xoffer = count % period;
  row_vals = rows.slice(count - xoffer, count - xoffer + dur + period);
  sub_row_vals1 = row_vals.slice(0, dur);
  pos_vals1 = sub_row_vals1.filter(function(v) {return v > 0;});

  neg_vals1 = sub_row_vals1.filter(function(v) {return v < 0;}).map(function(v) {return -1 * v;});

  if (neg_vals1.length == 0) {
    neg_vals1[0] = 0;
  }
  if (pos_vals1.length == 0) {
    pos_vals1[0] = 0;
  }
  total_pos1 = pos_vals1.reduce(function(total, num) {return total + num;});
  total_neg1 = neg_vals1.reduce(function(total, num) {return total + num;});

  total_mag1 = total_pos1 + total_neg1;

  sub_row_vals2 = row_vals.slice(period, dur + period);
  pos_vals2 = sub_row_vals2.filter(function(v) {return v > 0;});

  neg_vals2 = sub_row_vals2.filter(function(v) {return v < 0;}).map(function(v) {return -1 * v;});

  if (neg_vals2.length == 0) {
    neg_vals2[0] = 0;
  }
  if (pos_vals2.length == 0) {
    pos_vals2[0] = 0;
  }

  total_pos2 = pos_vals2.reduce(function(total, num) {return total + num;});
  total_neg2 = neg_vals2.reduce(function(total, num) {return total + num;});

  total_mag2 = total_pos2 + total_neg2;

  for (let i = 0; i < numcols + 1; i++) {
    binned_vals = row_vals.slice(i * period, (i + 1) * period);
    pos_binned = binned_vals.filter(function(v) {return v > 0;});

    neg_binned = binned_vals.filter(function(v) {return v < 0;}).map(function(v) {return -1 * v;});

    if (pos_binned.length == 0) {
      pos_binned[0] = 0;
    }
    if (neg_binned.length == 0) {
      neg_binned[0] = 0;
    }

    pos_sum = pos_binned.reduce(function(total, num) {return total + num;});
    neg_sum = neg_binned.reduce(function(total, num) {return total + num;});

    diff_sum = pos_sum - neg_sum;
    period_diff_sums.push(diff_sum);
    period_pos_sums.push(pos_sum);
    period_neg_sums.push(neg_sum);
    if (i == numcols) {
      ppos = (pos_sum / total_mag2);
      pneg = (neg_sum / total_mag2);
    } else {
      ppos = (pos_sum / total_mag1);
      pneg = (neg_sum / total_mag1);
    }
    total_sum = pos_sum + neg_sum;
    period_pos_p = pos_sum / total_sum;
    period_neg_p = neg_sum / total_sum;

    pposs.push(ppos);
    pnegs.push(pneg);
    period_neg_ps.push(period_neg_p);
    period_pos_ps.push(period_pos_p);
    //These values are based ONLY on the current Dur, need to make sure this is coming from all data
    let max_per_sum = max([pos_sum,neg_sum]);
    let min_per_sum = min([pos_sum,neg_sum]);
    if (max_per_sum > bin_max_mag) {
      bin_max_mag = max_per_sum;
    }
    if (min_per_sum < bin_min_mag) {
     bin_min_mag = min_per_sum; 
    }
  }
  //bin_max_mag = max([total_pos1,total_neg1]);
  //print(bin_max_mag);
  //bin_max_mag = 0.1;
  //print(bin_max_mag);
}

function getMags(data, num_bins) {
  let mags = [];
  let binned = [];
  //binned.length = 0;
  //print(binned.length,binned.slice());
  //bin_size = ((bin_max_mag -bin_min_mag)/ num_bins);
  bin_size = ((maxV - minV)/ num_bins);
  //print(bin_size);
  for (let q = 0; q < num_bins + 1; q++) {
    bin_vals[q] = minV + q * bin_size;
  }
  //print(bin_vals);
  for (let u = 0; u < num_bins; u++) {
    binned[u] = [];
    binned[u].length = 0;
    //print(binned[u].slice());
  }
  //print(binned[0].length);
  for (let i = 0; i < data.length; i++) {
    let x = data[i];
    for (let j = 0; j < (bin_vals.length-1); j++) {
      if ((x > bin_vals[j]) && (x <= bin_vals[j + 1])) {
        //binned[j].push(x);
        binned[j][binned[j].length] = x;
        //print(j,x,binned[j].slice(),binned[j].length);
      }
    }
  }
  
  //print(binned.slice());

  for (let k = 0; k < binned.length; k++) {
    if (binned[k].length == 0) {
      binned[k] = [0];
    }
    //print(k,binned[k].slice());
    mags[k] = (binned[k].reduce(function(total, num) {
      return total + num;
    }));

  }

  return mags;

}

//Working!
function getmaxV() {
  let maxV = 0;
  let minV = 10;
  for (i = 0; i < rows.length - period; i++) {
    let sli = rows.slice(i, i + period);
    let sli_pos = sli.filter(function(v) {
      return v > 0;
    });
    let sli_neg = sli.filter(function(v) {return v < 0;}).map(function(v) {return -1 * v;});
    if (sli_pos.length == 0) {
      sli_pos[0] = 0;
    }
    if (sli_neg.length == 0) {
      sli_neg[0] = 0;
    }
    let sli_pos_sum = sli_pos.reduce(function(total, num) {return total + num;});
    let sli_neg_sum = sli_neg.reduce(function(total, num) {return total + num;});
    let sli_sum = max([sli_pos_sum, sli_neg_sum]);
    let sli_min = min([sli_pos_sum, sli_neg_sum]);
    if (sli_sum > maxV) {
      maxV = sli_sum;
    }
    if (sli_min < minV) {
      minV = sli_min;
    }
  }
  return [maxV,minV];
}


//Not quite working yet
function getmaxP() {
  let maxP = 0;
  for (i = 0; i < rows.length - dur; i++) {
    let slic = rows.slice(i, i + dur);
    let slic_pos = slic.filter(function(v) {return v > 0;});
    let slic_neg = slic.filter(function(v) {return v < 0;}).map(function(v) {return -1 * v;});
    if (slic_pos.length == 0) {
      slic_pos[0] = 0;
    }
    if (slic_neg.length == 0) {
      slic_neg[0] = 0;
    }
    let slic_pos_sum = slic_pos.reduce(function(total, num) {return total + num;});
    let slic_neg_sum = slic_neg.reduce(function(total, num) {return total + num;});
    
    slic_sum = slic_pos_sum + slic_neg_sum;
    //print(slic_pos_sum,slic_neg_sum,slic_sum);
    lic_pos_sums = [];
    lic_neg_sums = [];
    for (j = 0; j < numcols; j++) {
      let lic = slic.slice(j * period, (j + 1) * period);
      let lic_pos = lic.filter(function(v) {return v > 0;});
      let lic_neg = lic.filter(function(v) {return v < 0;}).map(function(v) {return -1 * v;});
      //print(lic_pos.length,lic_neg.length);
      if (lic_pos.length == 0) {
        lic_pos[0] = 0;
      }
      if (lic_neg.length == 0) {
        lic_neg[0] = 0;
      }
      let lic_pos_sum = lic_pos.reduce(function(total, num) {return total + num;});
      let lic_neg_sum = lic_neg.reduce(function(total, num) {return total + num;});
      //print(lic_pos_sum);
      lic_pos_sums[j] = lic_pos_sum;
      lic_neg_sums[j] = lic_neg_sum;
    }
    //print(lic_pos_sums,lic_neg_sums);
    
    //////
    //These two lines are where the error in scaling is coming from i think
    //////
    
    let lic_pos_mags = getMags(lic_pos_sums, numb).map(function (item,index) {return item/slic_sum;});
    let lic_neg_mags = getMags(lic_neg_sums, numb).map(function (item,index) {return item/slic_sum;});
    //////
    //////
   
    let lic_sum = max([max(lic_pos_mags), max(lic_neg_mags)]);
    //print(lic_pos_sums,lic_neg_sums);
     //print(lic_pos_mags.slice(),lic_neg_mags.slice());
    //print([max(lic_pos_mags), max(lic_neg_mags)],lic_sum);
    //print(lic_sum);
      //print(maxP,lic_sum,max(lic_pos_mags),max(lic_neg_mags),slic_neg_sum,slic_pos_sum,slic_sum);
    //print(lic.length);
    //let lic_sum = lic.reduce(function (total,num) {return total+num;})/slic_sum;
    if (lic_sum > maxP) {
      //print(maxP);
      maxP = lic_sum;
      //print(maxP);
    }
  }
  //print("final maxP",maxP);
  return maxP;
}

function topStockGraph(canvas) {

  canvas.background(220);
  if (mouseIsPressed) {
    canvas.fill(255);
    canvas.ellipse(mouseX, mouseY, 60, 60);
  }

  canvas.textSize(13);
  squareColor = canvas.color(148, 103, 189); // Blue
  canvas.stroke(squareColor);
  canvas.strokeWeight(0.2);

  scaler = canvas.height * por;
  multi = scaler / (m1 - m0);

  bin = 0;
  for (let k = 0; k < num_horiz + 1; k++) {
    

    canvas.push();
    canvas.fill(0);
    //////
    // Plotting Y ticks
    //////
    ind = ((m1 - m0) * (1 / por) * (bin) / (num_horiz) - (canvas.height / 2) / multi);
    //ind = ind.toFixed(2);
    ind = Math.exp(ind).toFixed(2);
    canvas.text(ind, 0, canvas.height - (bin / (num_horiz)) * canvas.height)
    canvas.pop();
    //////
    //Horizontal Lines
    //////
    canvas.beginShape();
    for (let j = 0; j < 11; j++) {
      canvas.vertex((j / 10) * canvas.width, canvas.height - (bin / (num_horiz)) * canvas.height);
    }
    canvas.endShape();
    bin++;

  }
  canvas.push();
  canvas.strokeWeight(1.5);
  canvas.fill(255, 0, 0);
  canvas.line(canvas.width, 0, canvas.width, -canvas.height);
  canvas.pop();
  bin = 0;

  for (let i = count; i < count + dur + period; i++) {

    if ((bin) % period == 0) {
      xoffer = count % period;
      //////
      // Plotting Vertical Line
      //////
      canvas.beginShape();
      for (let j = 0; j < 11; j++) {

        canvas.vertex(((bin - xoffer) / dur) * canvas.width, canvas.height - (j / 10) * canvas.height);

      }
      canvas.endShape();
      //////
      //Plotting Date
      //////
      plotDate(canvas, i);
    }
    bin++;
  }
  //////
  //Plot Y Values  (and midline 0,1)
  //////
  plotYaxis(canvas);
}

function checkAndMove() {
  if (moving) {
    let mag = 4;
    moveX = int(map(mouseX, 0, width, -mag, mag));
    count += moveX;
  }
  checkResetCount();
}


function plotDate(canvas, j) {
  rowValer = dates[j - xoffer];
  //print(rowValer);
  canvas.fill(148, 103, 189);
  //strokeWeight(1.2);
  canvas.textSize(13);
  canvas.rect(((bin - xoffer) / (dur)) * canvas.width - 1, canvas.height, 2, -15)
  canvas.push();
  canvas.fill(31, 119, 180);
  //strokeWeight(0.2);
  canvas.textStyle(BOLD);
  canvas.noStroke();
  canvas.text(rowValer.slice(0, 7), ((bin - xoffer) / (dur)) * canvas.width - 21.5, canvas.height);

  canvas.pop();
}

function plotYaxis(canvas) {
  
  canvas.strokeWeight(1.2);
  //squareColor = color(148,103,189); // Purple
  squareColor = canvas.color(44, 160, 44); //Green
  canvas.stroke(squareColor);
  canvas.noFill();
  canvas.beginShape();
  //For Future Effort, Try to match the movement of this because it is what we are interested in!
  bin = 0;


  canvas.push();
  canvas.strokeWeight(3);
  canvas.stroke(148, 103, 189);
  //Plot  "no change" line (0 or 1 usually)

  //yoffset = midpoint;
  yoffset = 0;
  hv = canvas.height / 2 - (0 - yoffset) * multi;
  //hv = canvas.height/2 - (0)*multi;
  canvas.line(0, hv, canvas.width, hv);
  canvas.pop();

  for (let j = count; j < count + dur; j++) {
    bin++;
    rowVal = rows[j];
    canvas.vertex((bin / (dur - 1)) * canvas.width, canvas.height / 2 - (rowVal - yoffset) * multi);
  }
  canvas.endShape();
}

function mouseWheel(event) {
  //move the square according to the vertical scroll amount
  colsAdded += int(event.delta / 130);
  
  upperLim = 3;
  //print(-og_val,colsAdded,upperLim);
  if (colsAdded < -og_val) {
    colsAdded = -og_val;
  } else if (colsAdded > upperLim) {
    colsAdded = upperLim;
  }
}

function getFactors(num) {
  const isEven = num % 2 === 0;
  let inc = isEven ? 1 : 2;
  let factors = [1, num];
  for (let curFactor = isEven ? 2 : 3; Math.pow(curFactor, 2) <= num; curFactor += inc) {
    if (num % curFactor !== 0) continue;
    factors.push(curFactor);
    let compliment = num / curFactor;
    if (compliment !== curFactor) factors.push(compliment);
  }
  factors = factors.sort(function(a, b) {return a - b});
  return factors;
}

function mouseClicked() {
  moving = !moving;
}
