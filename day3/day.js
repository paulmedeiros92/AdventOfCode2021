const { txtToLineArray } = require('../ingest/lineByLine');

function shrink(array, index, isMost = true) {
  const ones = array.reduce((prev, line) => prev + line[index], 0);
  const key = isMost ?
    ((ones >= array.length / 2) ? 1 : 0) :
    ((ones >= array.length / 2) ? 0 : 1);
  const filteredArray = array.filter((line) => line[index] === key)
  if (filteredArray.length === 1)
    return filteredArray[0];
  return shrink(filteredArray, ++index, isMost);
}

const lines = txtToLineArray('./day3/input.txt').map((line) => {
  return line.split('').map((char) => parseInt(char, 10));
});

let positions = new Array(lines[1].length).fill(0);
lines.forEach((command) => {
  command.forEach((bit, index) => {
    positions[index] += bit;
  })
});

const gamma = positions.map((position) => position > (lines.length / 2) ? 1 : 0);
const epsilon = positions.map((position) => position > (lines.length / 2) ? 0 : 1);

const oxygen = parseInt(shrink(lines, 0).join(''), 2);
const co2 = parseInt(shrink(lines, 0, false).join(''), 2);
console.log(oxygen * co2);