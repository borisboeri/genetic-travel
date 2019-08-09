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
  for (var i = 0; i < population.length; i++) {
    var d = calcDistance(cities, population[i]);
    // console.log('distance',d);
    // var p = calcScore(cities, population[i]);
    // console.log('point',p);
    // var s = pow(p,5) / d;
    var s = d;
    // console.log('score',s);
    if (s < recordScore) {
      recordScore = s;
      bestEver = population[i];
    }
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
  for (var i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (var i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  }
}

function nextGeneration() {
  var newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    var orderA = pickOne(population, fitness);
    // console.log('orderA -next gen',orderA);
    var orderB = pickOne(population, fitness);
    // console.log('orderB -next gen', orderB);
    var order = crossOver(orderA, orderB);
    // console.log('order',order);
    mutate(order, mutationRate);
    newPopulation[i] = order;
  }
  population = newPopulation;
  // console.log('population',population);

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
  // console.log('start', start);
  var end = floor(random(start + 1, orderA.length));
  // console.log('end',end);
  // console.log('slicing',orderA.slice(start, end));
  var neworder;
  neworder = orderA.slice(start, end);
  // console.log('neworder',neworder);
  // var left = totalCities - neworder.length;
  for (var i = 0; i < orderB.length; i++) {
    var city = orderB[i];
    // console.log('city',city);
    if (!neworder.includes(city)) {
      neworder.push(city);
    }
  }
  return neworder;
}


function mutate(order, mutationRate) {
  for (var i = 0; i < totalCities; i++) {
    if (random(1) < mutationRate) {
      var permutation = floor(random(5)) + 1
      // console.log(permutation);
      for (var j = 0; j < permutation; j++)
        var indexA = floor(random(order.length));
        var indexB = (indexA + 1) % totalCities;
        swap(order, indexA, indexB);
    }
  }
}
