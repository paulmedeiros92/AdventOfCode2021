const { start } = require('repl');
const { txtToLineArray } = require('../ingest/lineByLine');

class Point {
  constructor(xy) {
    this.x = xy[0];
    this.y = xy[1];
  }
}

class Line {
  constructor(start, end) {
    this.start = start;
    this.end = end;
    this.slopeX = this.findSlope(start, end, 'x');
    this.slopeY = this.findSlope(start, end, 'y');
    this.createPath(start, end);
  }

  createPath = (start, end) => {
    this.points = new Array(start);
    let index = new Point([start.x, start.y]);
    while(!(index.x === end.x && index.y === end.y)) {
      index.x = index.x + this.slopeX;
      index.y = index.y + this.slopeY;
      this.points.push(new Point([index.x, index.y]));
    }
  }

  findSlope = (start, end, xy) => {
    const raw = end[xy] - start[xy];
    if (raw !== 0) {
      return raw >= 0 ? 1 : -1;
    }
    return 0;
  }
}

const strLines = txtToLineArray('./day5/input.txt');
const segmentInfo = strLines.map((line) => {
  const xy = line.split(' -> ');
  const start = new Point(xy[0].split(',').map((num) => parseInt(num, 10)));
  const end = new Point(xy[1].split(',').map((num) => parseInt(num, 10)));
  return {start, end};
});

const lines = segmentInfo.map(({start, end}) => new Line(start, end));

const board = new Array(999).fill().map(() => Array(999).fill(0));
let count = 0;
lines.forEach(({points}) => {
  points.forEach((point) => {
    board[point.y][point.x] = board[point.y][point.x] + 1;
    if (board[point.y][point.x] === 2) {
      count++;
    }
  });
});

console.log(count);
