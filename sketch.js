// Daniel Shiffman
// The Coding Train
// Traveling Salesperson with Genetic Algorithm

// https://thecodingtrain.com/CodingChallenges/035.4-tsp.html
// https://youtu.be/M3KTWnTrU_c
// https://thecodingtrain.com/CodingChallenges/035.5-tsp.html
// https://youtu.be/hnxn6DtLYcY

// https://editor.p5js.org/codingtrain/sketches/EGjTrkkf9

var cities = [];
var totalCities = 20;

var popSize = 300;
var population = [];
var fitness = [];

var recordScore = Infinity;
var bestEver;
var currentBest;

var scoreRange = 50;
var mutationRate = 0.1;

var statusP;

function generateIndivual() {
  var order = [];

  for (var i = 0; i < totalCities; i++) {
    // var s = floor(random(scoreRange));
    // city={
    //       coordinates:v,
    //       points:s
    //   };
    // cities.push(city);

    order[i] = i;
  }

  return shuffle(order);
}

function setup() {
  createCanvas(800, 800);

  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(width), random(height / 2));
    // var s = floor(random(scoreRange));
    // city={
    //       coordinates:v,
    //       points:s
    //   };
    // cities.push(city);
    cities[i] = v;
  }

  let order = generateIndivual();

  for (var i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
    var ran = floor(random(3, totalCities));
    console.log(ran);
    population[i] = population[i].slice(0, ran);
    // console.log(population);
  }
  statusP = createP("").style("font-size", "32pt");

  // console.log(population);
}

function draw() {
  background(0);
  frameRate(20);

  // GA
  calculateFitness();
  normalizeFitness();

  nextGeneration(generateIndivual());

  stroke(255);
  strokeWeight(4);
  noFill();
  beginShape();
  var startingPoint = bestEver[0];

  for (let i = 0; i < cities.length; i++) {
    ellipse(cities[i].x, cities[i].y, 16, 16);
    textStyle(ITALIC);
    strokeWeight(2);
    textSize(25);
    // text(cities[i].points,
    //     cities[i].coordinates.x,
    //     cities[i].coordinates.y + 30);
    text(i, cities[i].x, cities[i].y + 30);
  }
  for (var i = 0; i < bestEver.length; i++) {
    var n = bestEver[i];
    // vertex(cities[n].coordinates.x, cities[n].coordinates.y);
    // ellipse(cities[n].coordinates.x, cities[n].coordinates.y, 16, 16);
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);

    textStyle(ITALIC);
    strokeWeight(2);
    textSize(25);
    // text(cities[i].points,
    //     cities[i].coordinates.x,
    //     cities[i].coordinates.y + 30);
    text(i, cities[i].x, cities[i].y + 30);
    strokeWeight(4);
  }
  //close the cycle
  // vertex(cities[bestEver[0]].coordinates.x, cities[bestEver[0]].coordinates.y);
  vertex(cities[bestEver[0]].x, cities[bestEver[0]].y);
  fill(255, 0, 255);
  // ellipse(cities[startingPoint].coordinates.x, cities[startingPoint].coordinates.y, 26, 26);
  ellipse(cities[startingPoint].x, cities[startingPoint].y, 26, 26);
  noFill();
  endShape();

  translate(0, height / 2);
  stroke(255);
  strokeWeight(4);
  noFill();
  beginShape();
  var actualStartingPoint = currentBest[0];
  for (let i = 0; i < cities.length; i++) {
    ellipse(cities[i].x, cities[i].y, 16, 16);
    textStyle(ITALIC);
    strokeWeight(2);
    textSize(25);
    // text(cities[i].points,
    //     cities[i].coordinates.x,
    //     cities[i].coordinates.y + 30);
    text(i, cities[i].x, cities[i].y + 30);
  }
  for (var i = 0; i < currentBest.length; i++) {
    var n = currentBest[i];
    // vertex(cities[n].coordinates.x, cities[n].coordinates.y);
    // ellipse(cities[n].coordinates.x, cities[n].coordinates.y, 16, 16);
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  //close the cycle
  // vertex(cities[currentBest[0]].coordinates.x, cities[currentBest[0]].coordinates.y);
  vertex(cities[currentBest[0]].x, cities[currentBest[0]].y);
  fill(255, 0, 255);
  // ellipse(cities[actualStartingPoint].coordinates.x, cities[actualStartingPoint].coordinates.y, 26, 26);
  ellipse(cities[actualStartingPoint].x, cities[actualStartingPoint].y, 26, 26);
  noFill();
  endShape();

  // noLoop();
}

// function shuffle(a, num) {
//   for (var i = 0; i < num; i++) {
//     var indexA = floor(random(a.length));
//     var indexB = floor(random(a.length));
//     swap(a, indexA, indexB);
//   }
// }

function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function calcDistance(points, order) {
  var sum = 0;

  //make a copy of the order and close it as it is a circle

  var cycleOrder = order.slice();
  cycleOrder.push(cycleOrder[0]);
  // console.log('cycleOrder:',cycleOrder);
  // console.log('cities:', cities);
  for (var i = 0; i < cycleOrder.length - 1; i++) {
    var cityAIndex = cycleOrder[i];
    var cityA = points[cityAIndex];
    // console.log('cityA',cityA);
    var cityBIndex = cycleOrder[i + 1];
    var cityB = points[cityBIndex];
    // console.log('cityB',cityB);
    try {
      var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    } catch {}
    // var d = dist(cityA.coordinates.x, cityA.coordinates.y, cityB.coordinates.x, cityB.coordinates.y);
    sum += d;
  }
  return sum;
}

function calcScore(points, order) {
  var sum = 0;
  for (var i = 0; i < order.length - 1; i++) {
    var cityIndex = order[i];
    var city = points[cityIndex];
    var p = city.points;
    sum += p;
  }
  return sum;
}
