const { txtToLineArray } = require('../ingest/lineByLine');

function divideAndMatch(input, rules) {
  if (input.length > 1) {
    const foundKey = Array.from(rules.keys()).sort((a, b) => b.length - a.length).find((key) => input.includes(key));
    const pivotStart = input.indexOf(foundKey);
    const pivotEnd = input.indexOf(foundKey) + foundKey.length - 1;
    const leftInput = input.slice(0, pivotStart + 1);
    const rightInput = input.slice(pivotEnd); 
    // can filter rules out if need be
    const left = divideAndMatch(leftInput, rules);
    const right = divideAndMatch(rightInput, rules);
    if (foundKey.length > 2 ) {
      console.log(`${foundKey} was used`);
    }
    return left + rules.get(foundKey) + right;
  }
  return input;
}

const lines = txtToLineArray('./day14/input.txt');
let input = lines[0];
lines.shift();
lines.shift();
const rules = new Map();
lines.forEach((line) => {
  const rule = line.split(' -> ');
  rules.set(rule[0], rule[1]);
});

const steps = 20;
const t0 = performance.now();
// for (let j = 0; j < steps; j++) {
//   const oldInput = input.join('');
//   for (let i = 0; i < input.length - 1; i += 2) {
//     const validRule = rules.get(input.slice(i, i+2).join(''));
//     input.splice(i+1, 0, validRule);
//   }
//   rules.set(oldInput, input.join(''))
// }
for (let j = 0; j < steps; j++) {
  const oldInput = input;
  input = divideAndMatch(input, rules);
  rules.set(oldInput, input)
}
const t1 = performance.now();
console.log(`Took ${t1 - t0} milliseconds`);

const counts = new Map();
input.split('').forEach((char) => {
  if (counts.get(char)) {
    counts.set(char, counts.get(char) + 1);
  } else {
    counts.set(char, 1);
  }
});

const sorted = Array.from(counts.values()).sort((a,b) => b -a);
console.log(sorted);
console.log(sorted[0] - sorted[sorted.length -1]);