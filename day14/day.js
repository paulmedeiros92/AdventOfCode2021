const { txtToLineArray } = require('../ingest/lineByLine');

const lines = txtToLineArray('./day14/input.txt');
let input = lines[0].split('');
lines.shift();
lines.shift();
const rules = new Map();
let pairs = new Map();
lines.forEach((line) => {
  const rule = line.split(' -> ');
  rules.set(rule[0], rule[1]);
  pairs.set(rule[0], 0);
});

for (let i = 0; i < input.length - 1; i++) {
  pairs.set(input.slice(i, i+2).join(''), pairs.get(input.slice(i, i+2).join('')) + 1);
}

const steps = 40;
const t0 = performance.now();
for (let j = 0; j < steps; j++) {
  const newPairs = new Map(pairs);
  pairs.forEach((value, key) => {
    if (value > 0) {
      newPairs.set(key, newPairs.get(key) - value);
      const insert = rules.get(key);
      const left = key[0] + insert;
      const right = insert + key[1];
      newPairs.set(left, newPairs.get(left) + value);
      newPairs.set(right, newPairs.get(right) + value);
    }
  });
  pairs = new Map(newPairs);
}
const t1 = performance.now();
console.log(`Took ${t1 - t0} milliseconds`);

const counts = new Map();
pairs.forEach((value, key) => {
  const leftCount = counts.get(key[0]);
  if (leftCount) {
    counts.set(key[0], leftCount + value);
  } else {
    counts.set(key[0], value);
  }
  const rightCount = counts.get(key[1]);
  if (rightCount) {
    counts.set(key[1], rightCount + value);
  } else {
    counts.set(key[1], value);
  }
});

const sorted = Array.from(counts.values()).sort((a,b) => b -a).map((num) => Math.ceil(num / 2));
console.log(sorted);
console.log(sorted[0] - sorted[sorted.length -1]);