const { lchownSync } = require('fs');
const { txtToLineArray } = require('../ingest/lineByLine');

function canContinue(matrix, y, x) {
  const maxY = matrix.length;
  const maxX = matrix[0].length;
  const inRangeY = y >= 0 && y < maxY;
  const inRangeX = x >= 0 && x < maxX;
  if (inRangeX && inRangeY) {
    const notNine = matrix[y][x] !== 9;
    return inRangeY && inRangeX && notNine; 
  }
  return false;
}

function exploreBasin(matrix, y, x, count) {
  if (matrix[y][x] === 9) {
    return count;
  }
  matrix[y][x] = 9;
  if (canContinue(matrix, y-1, x)) {
    count = exploreBasin(matrix, y-1, x, count)
  }
  if (canContinue(matrix, y+1, x)) {
    count = exploreBasin(matrix, y+1, x, count)
  }
  if (canContinue(matrix, y, x-1)) {
    count = exploreBasin(matrix, y, x-1, count)
  }
  if (canContinue(matrix, y, x+1)) {
    count = exploreBasin(matrix, y, x+1, count)
  }
  return count + 1;
}

const lines = txtToLineArray('./day9/input.txt');
const matrix = lines.map((line) => line.split('').map((str) => parseInt(str, 10)));

let basins = [];
for (let y = 0; y < matrix.length; y++) {
  for (let x = 0; x < matrix[0].length; x++) {
    const basin = exploreBasin(matrix, y, x, 0)
    if (basin > 0) {
      basins.push(basin);
    }
  }
}

basins.sort((a, b) => b-a);
console.log(basins[0] * basins[1] * basins[2]);
