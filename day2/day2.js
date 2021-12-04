const { txtToLineArray } = require('../ingest/lineByLine');

const lines = txtToLineArray('./day2/input.txt').map((line) => {
  const args = line.split(' ');
  return { direction: args[0], delta: parseInt(args[1], 10)}
});

let x = 0, y = 0, aim = 0;
lines.forEach((command) => {
  switch(command.direction) {
    case 'down':
      aim += command.delta;
      break;
    case 'up':
      aim -= command.delta;
      break;
    case 'forward':
      x += command.delta;
      y += aim * command.delta;
      break;
  }
});

console.log(x * y);
