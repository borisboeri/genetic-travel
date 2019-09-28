// Daniel Shiffman
// The Coding Train
// Traveling Salesperson with Genetic Algorithm

// https://thecodingtrain.com/CodingChallenges/035.4-tsp.html
// https://youtu.be/M3KTWnTrU_c
// https://thecodingtrain.com/CodingChallenges/035.5-tsp.html
// https://youtu.be/hnxn6DtLYcY

// https://editor.p5js.org/codingtrain/sketches/EGjTrkkf9

function calculateFitness() {
  var currentRecord = Infinity;
  for (var i = 0; i < popSize; i++) {
    var d = calcDistance(cities, population[i]);
    var s = d;

    // saving the global lowest distance
    if (s < recordScore) {
      recordScore = s;
      bestEver = population[i];
    }
    // saving the actual lowest distance
    if (s < currentRecord) {
      currentRecord = s;
      currentBest = population[i];
    }

    // This fitness function has been edited from the original video
    // to improve performance, as discussed in The Nature of Code 9.6 video,
    // available here: https://www.youtube.com/watch?v=HzaLIO9dLbA
    // fitness[i] = 1 / (pow(s, 8) + 1);
    fitness[i] = 1 / s;
  }
}

function normalizeFitness() {
  var sum = 0;
  for (var i = 0; i < popSize; i++) {
    sum += fitness[i];
  }
  for (var i = 0; i < popSize; i++) {
    fitness[i] = fitness[i] / sum;
  }
}

function nextGeneration(individual) {
  var newPopulation = [];
  for (var i = 0; i < popSize; i++) {
    var orderA = pickOne(population, fitness);
    var orderB = pickOne(population, fitness);
    var order = crossOver(orderA, orderB);

    mutate(order, mutationRate);
    let randomNb = random(1);
    newPopulation[i] = order;

    if (randomNb > 0.6) {
      var ran = floor(random(3, totalCities));
      population[i] = individual.slice(0, ran);
    }
  }
  population = newPopulation;
}

function pickOne(list, prob) {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function crossOver(orderA, orderB) {
  var start = floor(random(orderA.length));
  var end = floor(random(start + 1, orderA.length));

  var newOrder = orderA.slice(start, end);

  for (var i = 0; i < orderB.length; i++) {
    var city = orderB[i];
    if (!newOrder.includes(city)) {
      newOrder.push(city);
    }
  }
  return newOrder;
}

function mutate(order, mutationRate) {
  for (var i = 0; i < totalCities; i++) {
    if (random(1) < mutationRate) {
      var permutation = floor(random(1, totalCities));
      for (var j = 0; j < permutation; j++)
        var indexA = floor(random(order.length));
        var indexB = (indexA + 1) % order.length;
        swap(order, indexA, indexB);
    }
  }
}

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

  for (var i = 0; i < cycleOrder.length - 1; i++) {
    var cityAIndex = cycleOrder[i];
    var cityA = points[cityAIndex];
    var cityBIndex = cycleOrder[i + 1];
    var cityB = points[cityBIndex];

    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);

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
