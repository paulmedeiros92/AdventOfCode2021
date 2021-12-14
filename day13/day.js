const { txtToLineArray } = require('../ingest/lineByLine');

class Point { 
  constructor(xy) {
    this.x = parseInt(xy.split(',')[0], 10);
    this.y = parseInt(xy.split(',')[1], 10);
  }

  fold(delta, isX) {
    if (isX) {
      this.x = delta - (this.x - delta);
    } else {
      this.y = delta - (this.y - delta);
    }
  }
}

const lines = txtToLineArray('./day13/input.txt');
const map = new Map();
const points = [];
let isFolds = false;
const folds = [];
lines.forEach((line) => {
  if (!isFolds && line !== '') {
    map.set(line, true)
    points.push(new Point(line));
  } else if (line === '') {
    isFolds = true;
  } else {
    const directionNDelta = line.split(' ')[2].split('=');
    folds.push({ isX: directionNDelta[0] === 'x', delta: parseInt(directionNDelta[1], 10) });
  }
});


folds.forEach((fold) => {
  const pointsToFold = points.filter((point) => {
    if (fold.isX) {
      return point.x > fold.delta
    }
    return point.y > fold.delta
  });
  
  pointsToFold.forEach((point) => {
    map.delete(`${point.x},${point.y}`);
    point.fold(fold.delta, fold.isX);
    map.set(`${point.x},${point.y}`, true);
  });
});
const matrix = new Array(50).fill(0).map(() => new Array(50).fill(0));
Array.from(map.keys()).forEach((point) => {
  const foldedPoint = new Point(point);
  matrix[foldedPoint.y][foldedPoint.x] = 'X';
});
matrix.forEach((row) => console.log(row.reduce((prev, curr) => {
  if (curr === 0) {
    return prev + ' ';
  }
  return prev + curr;
}, '')));

console.log(map.size);
