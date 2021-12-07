const { txtToLineArray } = require('../ingest/lineByLine');

const line = txtToLineArray('./day7/input.txt');
const crabPositions = line[0].split(',').map((str) => parseInt(str, 10)).sort((a,b) => b - a);

let minFuel;
for (let i = 0; i <= crabPositions[0]; i++) {
  const fuel = crabPositions.reduce((previous, current) => {
    const range = [...Array(Math.abs(i - current)).keys()].map((index) => index + 1);
    const runSum = range.reduce((previous, current) => previous + current, 0);
    return previous + runSum;
  }, 0);
  if (minFuel === undefined || fuel < minFuel) {
    minFuel = fuel;
  }
}

console.log(minFuel);
