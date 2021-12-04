const { txtToLineArray } = require('../ingest/lineByLine');

const lines = txtToLineArray('./day1/input.txt').map((line) => parseInt(line, 10));
let increases = 0;
for (let i = 0; i < lines.length - 3; i++) {
  const sumA = lines[i] + lines [i+1] + lines[i+2];
  const sumB = lines[i+1] + lines[i+2] + lines[i+3];
  if (sumA < sumB) {
    increases++;
  }
}

console.log(increases);
