const { txtToLineArray } = require('../ingest/lineByLine');

class Generation {
  constructor(fish, cycle) {
    this.fish = fish,
    this.cycle = cycle
  }

  add(num = 1) {
    this.fish += num;
  }

  processLife() {
    if (this.cycle === 0) {
      this.cycle = 6;
      return this.fish;
    }
    this.cycle--;
    return 0;
  }
}

const line = txtToLineArray('./day6/input.txt');
const fish = line[0].split(',').map((str) => parseInt(str, 10));
const generations = [];

fish.forEach((cycle) => {
  generations.push(new Generation(1, cycle));
});

for (let i = 0; i < 256; i++) {
  let newFish = 0;
  generations.forEach((generation) => newFish += generation.processLife());
  if (newFish > 0) {
    generations.push(new Generation(newFish, 8));
  }
}

console.log(generations.reduce((prev,curr) => prev + curr.fish, 0));
