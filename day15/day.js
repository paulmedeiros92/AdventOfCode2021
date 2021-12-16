const { txtToLineArray } = require('../ingest/lineByLine');

class Node {
  constructor(weight, y, x) {
    this.weight = parseInt(weight, 10);
    this.y = y;
    this.x = x;
    this.visited = false;
    this.shortestPath = 0;
    this.parent = null;
    this.shortest = false;
    this.neighbors = [];
  }

  addNeighbors(matrix) {
    const top = this.y === 0;
    const right = this.x === matrix[0].length - 1;
    const bottom = this.y === matrix.length - 1;
    const left = this.x === 0;
    const ranges = [-1, 0, 1];
    let coordinates = ranges
      .flatMap(x => ranges.map(y => [ x, y ]))
      .filter(([x, y]) => Math.abs(x) !== Math.abs(y));
    if (top) {
      coordinates = coordinates.filter(([x, y]) => y !== -1);
    } if (right) {
      coordinates = coordinates.filter(([x, y]) => x !== 1);
    } if (bottom) {
      coordinates = coordinates.filter(([x, y]) => y !== 1);
    } if (left) {
      coordinates = coordinates.filter(([x, y]) => x !== -1);
    }
    coordinates.forEach(([x, y]) => this.neighbors.push(matrix[this.y + y][this.x + x]));
    this.neighbors.sort((a, b) => a.weight - b.weight);
  }
}

function findShortestPath(matrix, y, x) {
  const current = matrix[y][x];
  current.visited = true;
  current.neighbors.forEach((neighbor) => {
    if (!neighbor.visited) {
      const pathWeight = current.shortestPath + neighbor.weight;
      if (neighbor.shortestPath === 0 || pathWeight < neighbor.shortestPath) {
        neighbor.shortestPath = pathWeight;
        neighbor.parent = current;
      }
    }
  });
  // visit unvisited vertex with smallest known distance
  const closestNext = matrix.flat().filter((node) => !node.visited && node.shortestPath> 0).sort((a ,b) => a.shortestPath - b.shortestPath)[0];
  if (closestNext) {
    findShortestPath(matrix, closestNext.y, closestNext.x);
  }
}

function markShortestPath(node) {
  node.shortest = true;
  if (node.shortestPath !== 0) {
    markShortestPath(node.parent);
  }
}

const lines = txtToLineArray('./day15/input.txt');
const matrix = lines.map((line, y) => line.split('').map((point, x) => new Node(point, y, x)));
matrix.forEach((row) => row.forEach((node) => node.addNeighbors(matrix)));

findShortestPath(matrix, 0, 0);

markShortestPath(matrix[matrix.length-1][matrix[0].length-1]);

matrix.forEach((row) => console.log(row.reduce((prev, curr) => {
  if (curr.shortest) {
    return prev + 'X';
  }
  return prev + '.';
}, '')));

console.log(matrix[matrix.length-1][matrix[0].length-1].shortestPath);