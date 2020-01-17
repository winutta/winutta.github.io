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
let num_vert;
let num_spaces = 12;
let ypos2 = 0;
let ind, rowValor;
let xoffer;
let price = []
let mult = [];
let row_vals, pos_vals, neg_vals;
let Orange, Purple, Blue, Green, Pink, Yellow;
let w;

let period_pos_sums, period_neg_sums;
let period_pos_p, period_neg_p;
let pposs, pnegs, period_neg_ps, period_pos_ps;
let cans = [];
let bin_size, bin_vals, binned, mags;
let x;

let sub_row_vals1, pos_vals1, neg_vals1, total_pos1, total_neg1, total_mag1;
let sub_row_vals2, pos_vals2, neg_vals2, total_pos2, total_neg2, total_mag2;

function preload() {
  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  table = loadTable('FB_mult_2015.csv', 'csv', 'header');
  //the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
  //                  "csv", "header");
}

function setup() {
  // Next need to experiment with createGraphic!
  // Establish Color Options to Use

  Orange = color(255, 127, 14); // Orange
  Purple = color(148, 103, 189); // Purple
  Blue = color(31, 119, 180); // Blue
  Green = color(44, 160, 44); //Green
  Pink = color(227, 119, 194); //Pink
  Yellow = color(188, 189, 34); // Yellow


  let cnv = createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < 5; i++) {
    cans[i] = createGraphics(width, height / 3);
    cans[i].clear();
  }
  for (let i = 5; i < 3; i++) {
    cans[i] = createGraphics(width * (2 / 9), height / 3);
    cans[i].clear();
  }
  for (let i = 8; i < 2; i++) {
    cans[i] = createGraphics(width * (1 / 9), height / 3);
    cans[i].clear();
  }
  for (let i = 10; i < 4; i++) {
    cans[i] = createGraphics(width * (1 / 6), height * (1 / 6));
    cans[i].clear();
  }

  // Set possible and starting period,numcols combos by taking Factors

  factors = getFactors(dur).sort(function(a, b) {
    return a - b
  });
  og_val = 3;
  startingOffsetforBins = 0;

  //Create Data and Metrics

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
  scaler = height / 2;
  midpoint = (m1 + m0) / 2;
  multi = scaler / (m1 - m0);
  ymult = (height / max(rows) * 0.8);
  num_vert = int(Math.floor(dur / num_spaces));



}


function draw() {

  pposs = [];
  pnegs = [];
  period_neg_ps = [];
  period_pos_ps = [];
  period_pos_sums = [];
  period_neg_sums = [];
  period_diff_sums = [];
  bin_vals = [];
  binned = [];
  mags = [];

  background(220);

  checkAndMove();
  //print(count,maxIters);
  checkResetCount();

  ncp = get_numcols_period();

  numcols = ncp[0];
  period = ncp[1];



  maxIters = table.getRowCount() - dur - period;
  //print(numcols,period,num_vert);
  //Staring Bin Graph
  getperiodData();

  pos_mags = getMags(period_pos_sums, 4);
  neg_mags = getMags(period_neg_sums, 4);

  w = width / 2;
  //print(w);
  topStockGraph(cans[0]);
  //fixStockGraph(can1);

  bottomBinGraph(cans[1], [pposs, pnegs], startingOffsetforBins, w, Blue, Orange, false);

  //line();
  bottomBinGraph(cans[2], [period_pos_sums, period_neg_sums], startingOffsetforBins, w, Purple, Green, false);
  bottomBinGraph(cans[3], [0, period_diff_sums], startingOffsetforBins, w, Purple, Green, true, 1 / 2);
  print(mags);
  //Need a new graphic function for magnitude graph 
  //OR could generalize the other function.. (probably preferable and will be needed eventually)


  //bottomBinGraph(cans[4],[neg_mags,pos_mags],startingOffsetforBins,w,Purple,Green,false,1,true);
  //Starting the stock graph
  image(cans[0], 0, 0);
  //image(cans[1],0,height/2);
  image(cans[2], 0, height / 3); //Log Return 
  image(cans[3], 0, 2 * height / 3); //Log Return DiffDiff
  //image(cans[4],width/2,0);



}

function graphMags(data, canvas) {
  canvas.background(220);
  canvas.noStroke();

  for (let i = 0; i < data.length; i++) {

    canvas.fill(C1);

    canvas.rect(((i)/(data.length-1))*canvas.width + so, canvas.height, (1 / (data.length-1)) * canvas.width, -(data[1][i]) * canvas.height, 0, 0, 15, 15); // Percent of period's mag

    squareColor = C2;
    squareColor.setAlpha(0.25 * (255));
    canvas.fill(squareColor);
    canvas.rect(((i)/(data.length-1))*canvas.width + so, canvas.height, (1 / (data.length-1)) * canvas.width, -(data[0][i]) * canvas.height, 0, 0, 15, 15);

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

function bottomBinGraph(canvas, data, so, w, C1, C2, one = false, mov = 1,no_off = false) {
  canvas.background(220);
  canvas.noStroke();
  //canvas.translate(0,(mov)*canvas.height);
  //Good combo's for (back,front): 
  //(Blue,Orange)  //Use for Magnitude//
  //(Purple,Green) //Use for Period//

  for (let i = 0; i < numcols + 1; i++) {

    //Here we can introduce log return values to create bar graphs
    //getperiodData(i);
    xoffer = (count % period);
    iteroff = 0;
    //print(xoffer);

    if (no_off){
      xoffer = 0;
    }
    canvas.fill(C1);
    //print(i,xoffer);
    //print(count-xoffer,count - xoffer + dur+period,numcols*(period)-xoffer-1,xoffer,period,data[1][0]);
    //print((-xoffer)/(numcols*period)*canvas.width+so);
    canvas.rect((i * (period) - xoffer) / (numcols * period) * canvas.width + so, canvas.height * mov, (1 / (numcols)) * canvas.width, -(data[1][i]) * canvas.height, 0, 0, 15, 15); // Percent of period's mag

    //canvas.rect((i*(period)-xoffer)/(numcols*period)*canvas.width+so,canvas.height,(1/(numcols))*canvas.width,-canvas.height/2,0,0,15,15); // Percent of period's mag

    //rect((i*(period)-xoffer)/(numcols*period)*w+so,height,(1/(numcols))*w,-height/4,0,0,15,15); // Percent of period's mag

    //rect((startingOffsetforBins + i * (period)) / (numcols * period) * w, height, (1 / (numcols)) * w, -(pneg) * height / 2 * (numcols), 0, 0, 15, 15); // Percent of dur's mag

    if (!one) {
      //print("hi");
      squareColor = C2;
      squareColor.setAlpha(0.25 * (255));
      canvas.fill(squareColor);
      canvas.rect((i * (period) - xoffer) / (numcols * period) * canvas.width + so, canvas.height, (1 / (numcols)) * canvas.width, -(data[0][i]) * canvas.height, 0, 0, 15, 15); // Percent of period's mag
    }

    //rect((startingOffsetforBins + i * (period)) / (numcols * period) * w, height, (1 / (numcols)) * w, -(ppos) * height / 2 * (numcols), 0, 0, 15, 15); // Percent of dur's mag

  }

  //print(xoffer,data[0]);
}

function getperiodData() {

  xoffer = count % period;

  //print(count-xoffer);
  row_vals = rows.slice(count - xoffer, count - xoffer + dur + period);
  sub_row_vals1 = row_vals.slice(0, dur);
  pos_vals1 = sub_row_vals1.filter(function(v) {
    return v > 0;
  });

  neg_vals1 = sub_row_vals1.filter(function(v) {
    return v < 0;
  }).map(function(v) {
    return -1 * v;
  });

  if (neg_vals1.length == 0) {
    neg_vals1[0] = 0;
  }
  if (pos_vals1.length == 0) {
    pos_vals1[0] = 0;
  }
  total_pos1 = pos_vals1.reduce(function(total, num) {
    return total + num;
  });
  total_neg1 = neg_vals1.reduce(function(total, num) {
    return total + num;
  });

  total_mag1 = total_pos1 + total_neg1;

  sub_row_vals2 = row_vals.slice(period, dur + period);
  pos_vals2 = sub_row_vals2.filter(function(v) {
    return v > 0;
  });

  neg_vals2 = sub_row_vals2.filter(function(v) {
    return v < 0;
  }).map(function(v) {
    return -1 * v;
  });

  if (neg_vals2.length == 0) {
    neg_vals2[0] = 0;
  }
  if (pos_vals2.length == 0) {
    pos_vals2[0] = 0;
  }

  total_pos2 = pos_vals2.reduce(function(total, num) {
    return total + num;
  });
  total_neg2 = neg_vals2.reduce(function(total, num) {
    return total + num;
  });

  total_mag2 = total_pos2 + total_neg2;

  //print(total_mag);
  for (let i = 0; i < numcols + 1; i++) {
    binned_vals = row_vals.slice(i * period, (i + 1) * period);
    pos_binned = binned_vals.filter(function(v) {
      return v > 0;
    });

    neg_binned = binned_vals.filter(function(v) {
      return v < 0;
    }).map(function(v) {
      return -1 * v;
    });

    if (pos_binned.length == 0) {
      pos_binned[0] = 0;
    }
    if (neg_binned.length == 0) {
      neg_binned[0] = 0;
    }

    pos_sum = pos_binned.reduce(function(total, num) {
      return total + num;
    });
    neg_sum = neg_binned.reduce(function(total, num) {
      return total + num;
    });

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
  }

  //print(pos_sum,neg_sum,total_sum,total_pos,total_neg,total_mag);
}

function getMags(data, num_bins) {
  //Introduces bin_vals, binned, and mags, num_bins, bin_size


  bin_size = (max(data) / num_bins);
  for (let q = 0; q < num_bins + 1; q++) {
    bin_vals[q] = q * bin_size;
  }

  for (let u = 0; u < num_bins; u++) {
    binned[u] = [];
  }

  for (let i = 0; i < data.length; i++) {
    x = data[i];
    for (let j = 0; j < (bin_vals.length - 1); j++) {
      if (x >= bin_vals[j] && x < bin_vals[j + 1]) {
        binned[j].push(x);
      }
    }
  }

  for (let k = 0; k < binned.length; k++) {
    if (binned[k].length == 0) {
      binned[k] = [0];
    }
    mags[k] = binned[k].reduce(function(total, num) {
      return total + num;
    })
  }

  return mags;

}

function fixStockGraph(canvas) {
  canvas.background((count / maxIters) * 255);
  //canvas.translate(0, canvas.height);
  if (mouseIsPressed) {
    canvas.ellipse(100, 20, 60, 60);
  }
}


function topStockGraph(canvas) {
  //canvas.background((count/maxIters)*255);
  canvas.background(220);
  //canvas.translate(0, canvas.height/2);
  if (mouseIsPressed) {
    canvas.fill(255);
    canvas.ellipse(mouseX, mouseY, 60, 60);
  }


  canvas.textSize(13);
  squareColor = canvas.color(148, 103, 189); // Blue
  canvas.stroke(squareColor);
  canvas.strokeWeight(0.2);

  canvas.push();
  canvas.strokeWeight(3);
  //hv = -215.94736842105263;
  hv = canvas.height - ((0 - m0) / (m1 - m0)) * canvas.height;
  //print(hv,mouseX,mouseY);
  //line(0, hv, width, hv);
  canvas.line(0, hv, canvas.width, hv);
  canvas.pop();


  bin = 0;
  for (let k = 0; k < num_horiz; k++) {
    //Draw a horizontal line
    canvas.push();
    //canvas.noStroke();
    canvas.fill(0);

    // Need to reconcile scale of this graph (scaler variable)
    ind = ((m1 - m0) * bin / (num_horiz - 1) + m0).toFixed(2);
    canvas.text(ind, 0, canvas.height - (bin / (num_horiz - 1)) * canvas.height)
    canvas.pop();
    canvas.beginShape();
    for (let j = 0; j < 11; j++) {
      canvas.vertex((j / 10) * canvas.width, canvas.height - (bin / (num_horiz - 1)) * canvas.height);
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
  //print(count);
  //print((count/maxIters)*canvas.width,canvas.width/2);
  for (let i = count; i < count + dur + period; i++) {
    //print(j);
    //rowVal = table.getRow(j).getNum(2);
    if ((bin) % period == 0) {
      xoffer = count % period;
      canvas.beginShape();
      for (let j = 0; j < 11; j++) {
        //print(((bin - xoffer) / dur));
        //print(((bin - xoffer) / dur) * canvas.width,-(j / 10) * canvas.height);
        canvas.vertex(((bin - xoffer) / dur) * canvas.width, canvas.height - (j / 10) * canvas.height);

        //canvas.vertex((count/maxIters)*canvas.width,canvas.height-(j / 10) * canvas.height);
      }
      canvas.endShape();

      plotDates(canvas, i);

    }
    bin++;

  }

  plotYaxis(canvas);



}

function checkAndMove() {
  if (moving) {
    let mag = 2;
    moveX = int(map(mouseX, 0, width, -mag, mag));
    count += moveX;
  }
  checkResetCount();
}


function plotDates(canvas, j) {
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
  //print(count);
  for (let j = count; j < count + dur; j++) {
    bin++;
    //rowVal = table.getRow(j).getNum(2);
    rowVal = rows[j];
    //print(rowVal);
    //print(rowVal,midpoint,height,-((rowVal-midpoint)*multi+height/4));

    scaler = canvas.height / 2;
    midpoint = (m1 + m0) / 2;
    multi = scaler / (m1 - m0);

    canvas.vertex((bin / (dur - 1)) * canvas.width, canvas.height - ((rowVal - midpoint) * multi + canvas.height / 2));
  }
  canvas.endShape();
}

function mouseWheel(event) {
  //move the square according to the vertical scroll amount
  colsAdded += int(event.delta / 130);
  //print(int(event.delta/130),colsAdded);
  //upperLim = factors.length - og_val;
  upperLim = 2;
  if (colsAdded < -og_val) {
    //print("resetcols");
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

  return factors;
}

function mouseClicked() {
  moving = !moving;
}