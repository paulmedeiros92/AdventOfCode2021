const { txtToLineArray } = require('../ingest/lineByLine');

function range([start, end]) {
  const length = end - start;
  const ranges = [];
  for (let i = 0; i < length; i++) {
    ranges.push(start+i);
  }
  ranges.push(end);
  return ranges;
}

function summation(num) {
  let sum = num;
  const sums = [sum];
  for (let i = num - 1; i > 0; i--) {
    sums.push(sum += i);
  }
  return sums;
}

function sink(limit, start = 0) {
  let sum = 0;
  let i = start;
  while (sum < limit) {
    sum += i;
    i++;
  }
  return sum;
}

function possibleTrajectoriesX(range) {
  const possibilities = [];
  let guess = 1;
  while(guess <= range[range.length-1]) {
    let sums = summation(guess);
    if (sums.filter((sum) => sum >= range[0] && sum <= range[range.length-1]).length > 0) {
      possibilities.push(guess);
    }
    guess++;
  }
  return possibilities;
}

function possibleTrajectoriesY(range) {
  let guess = 0;
  let runSum = summation(guess)
  let upSum = runSum[runSum.length-1];
  let top = upSum - range[0];
  let bottom = upSum - range[range.length-1];
  let sunk = sink(top);
  let negSunk = sink(Math.abs(range[0]), guess);
  let validGuesses = [];
  while(guess <= Math.abs(range[range.length-1])) {
    if (sunk <= bottom) {
      validGuesses.push(guess);
    }
    if (guess !== 0 && negSunk <= Math.abs(range[range.length-1])) {
      validGuesses.push(guess * -1);
    }
    guess++;
    
    runSum = summation(guess)
    upSum = runSum[runSum.length-1];    top = upSum - range[0];
    bottom = upSum - range[range.length-1];
    sunk = sink(top);
    negSunk = sink(Math.abs(range[0]), guess);
  }
  return validGuesses;
}

const lines = txtToLineArray('./day17/input.txt');
const raw = lines[0].split(' ').filter((part) => part.includes('x=') || part.includes('y='));
const xRange = range(raw[0].substring(2, raw[0].length-1).split('..').map((str) => parseInt(str, 10)));
const yRange = range(raw[1].substring(2).split('..').map((str) => parseInt(str, 10)));

const possibleY = possibleTrajectoriesY(yRange.sort((a, b) => b - a));
const possibleX = possibleTrajectoriesX(xRange);
console.log(possibleY);
console.log(possibleX);
// cross product of all these
const cross = possibleY.map((y) => possibleX.map((x) => [x, y])).flat();
// then filter the ones that dont have a point in the area
const filter = cross.filter(([incX, incY]) => {
  let x = 0, y = 0;
  while (x < xRange[0] || y > yRange[0]) {
    x += incX;
    y += incY;
    if (incX > 0) {
      incX--;
    }
    incY--;
  }
  return x >= xRange[0] && x <= xRange[xRange.length-1]
    && y <= yRange[0] && y >= yRange[yRange.length-1]
});

console.log(filter);
