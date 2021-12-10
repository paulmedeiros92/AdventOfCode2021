const { txtToLineArray } = require('../ingest/lineByLine');

const lines = txtToLineArray('./day10/input.txt');
const chunks = lines.map((line) => line.split(''));

const opposites = { ')':'(', ']':'[', '}':'{', '>':'<'};
const scores = { ')':1, ']':2, '}':3, '>':4 };
const errors = [];
const incompletes = [];

for (let i = 0; i < chunks.length; i++) {
  let lineTracking = [];
  for (let j = 0; j < chunks[i].length; j++) {
    const char = chunks[i][j];
    if (')]}>'.includes(char)) {
      if (lineTracking[lineTracking.length-1] !== opposites[char]) {
        errors.push(char);
        lineTracking = [];
        break;
      }
      lineTracking.pop();
    } else {
      lineTracking.push(char);
    }
  }
  if (lineTracking.length > 0) {
    incompletes.push(lineTracking.reverse());
  }
}

xOpposites = { '(':')', '[':']', '{':'}', '<':'>'};
const sums = incompletes
  .map((line) => line.reduce((prev, char) => {
    const last = prev * 5;
    return last + scores[xOpposites[char]] 
  }, 0));

sums.sort((a,b) => b-a);
console.log(sums[Math.floor(sums.length / 2)]);
