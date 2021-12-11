const { txtToLineArray } = require('../ingest/lineByLine');

class Octopus {
  constructor(energy) {
    this.energy = parseInt(energy,10);
    this.neighbors = [];
    this.hasFlashed = false;
    this.flashes = 0;
  }

  // l, lt, t, rt, r, rb, b, lb
  addNeighbors(matrix, y, x) {
    const hasLeft = x > 0;
    const hasTop = y > 0;
    const hasRight = x < matrix[y].length - 1;
    const hasBottom = y < matrix.length - 1;
    if (hasLeft) {
      this.neighbors.push(matrix[y][x-1]);
    } if (hasLeft && hasTop) {
      this.neighbors.push(matrix[y-1][x-1]);
    } if (hasTop) {
      this.neighbors.push(matrix[y-1][x]);
    } if (hasTop && hasRight) {
      this.neighbors.push(matrix[y-1][x+1]);   
    } if (hasRight) {
      this.neighbors.push(matrix[y][x+1]);
    } if (hasBottom && hasRight) {
      this.neighbors.push(matrix[y+1][x+1]);
    } if (hasBottom) {
      this.neighbors.push(matrix[y+1][x]);
    } if (hasLeft && hasBottom) {
      this.neighbors.push(matrix[y+1][x-1])
    }
  }

  incrementEnergy() {
    if (!this.isFlashing) {
      this.energy++;
    }
  }

  flash() {
    if (this.energy > 9 && this.hasFlashed === false) {
      this.neighbors.forEach((neighbor) => neighbor.incrementEnergy())
      this.flashes++;
      this.hasFlashed = true;
      return true;
    }
    return false;
  }

  endStepCheck() {
    if (this.hasFlashed) {
      this.energy = 0;
      this.hasFlashed = false;
      return true;
    }
    return false;
  }
}

const lines = txtToLineArray('./day11/input.txt');
const matrix = lines.map((line) => line.split('').map((energy) => new Octopus(energy)));
matrix.forEach((row, y) => row.forEach((octopus, x) => octopus.addNeighbors(matrix, y, x)));

let allFlash = false;
let i = 0;
while(!allFlash) {
  matrix.forEach((row) => row.forEach((octupus) => octupus.incrementEnergy()));
  let active = true;
  while(active) {
    active = matrix.some((row) => row.some((octupus) => octupus.flash()));
  }
  allFlash = matrix.every((row) => row.every((octupus) => octupus.hasFlashed));
  matrix.forEach((row) => row.forEach((octupus) => octupus.endStepCheck()));
  matrix.forEach((row) => console.log(row.reduce((prev, octopus) => prev + octopus.energy, '')));
  i++;
  console.log(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~allFlash:${allFlash}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
}

console.log(i);
