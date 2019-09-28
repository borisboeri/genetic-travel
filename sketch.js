// Daniel Shiffman
// The Coding Train
// Traveling Salesperson with Genetic Algorithm

// https://thecodingtrain.com/CodingChallenges/035.4-tsp.html
// https://youtu.be/M3KTWnTrU_c
// https://thecodingtrain.com/CodingChallenges/035.5-tsp.html
// https://youtu.be/hnxn6DtLYcY

// https://editor.p5js.org/codingtrain/sketches/EGjTrkkf9

var cities = [];
var totalCities = 10;

var popSize = 300;
var population = [];
var fitness = [];

var recordScore = Infinity;
var bestEver;
var currentBest;

var scoreRange = 50;
var mutationRate = 0.1;

function randomOrder() {
  var order = [];
  for (var i = 0; i < totalCities; i++) {
    order[i] = i;
  }
  return shuffle(order);
}

function setup() {
  createCanvas(1000, 1000);

  // generate city positions
  for (var i = 0; i < totalCities; i++) {
    var v = createVector(random(width), random(height / 2));
    cities[i] = v;
  }

  // affect a random order of variable size to each individual of the population
  for (var i = 0; i < popSize; i++) {
    population[i] = randomOrder();
    var ran = floor(random(3, totalCities));
    population[i] = population[i].slice(0, ran);
  }
}

function draw() {
  background(0);
  frameRate(20);

  // GA
  calculateFitness();
  normalizeFitness();

  nextGeneration(randomOrder());

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
    text(i, cities[i].x, cities[i].y + 30);
  }
  for (var i = 0; i < bestEver.length; i++) {
    var n = bestEver[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);

    textStyle(ITALIC);
    strokeWeight(2);
    textSize(25);
    text(i, cities[i].x, cities[i].y + 30);
    strokeWeight(4);
  }
  //close the cycle
  vertex(cities[bestEver[0]].x, cities[bestEver[0]].y);
  fill(255, 0, 255);
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
    text(i, cities[i].x, cities[i].y + 30);
  }
  for (var i = 0; i < currentBest.length; i++) {
    var n = currentBest[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  //close the cycle
  vertex(cities[currentBest[0]].x, cities[currentBest[0]].y);
  fill(255, 0, 255);
  ellipse(cities[actualStartingPoint].x, cities[actualStartingPoint].y, 26, 26);
  noFill();
  endShape();

  // noLoop();
}
