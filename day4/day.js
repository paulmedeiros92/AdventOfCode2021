const { txtToLineArray } = require('../ingest/lineByLine');

function sumOfBoard(board) {
  return board.flat().filter((value) => value >= 0).reduce((prev, curr) => prev + curr, 0);
}

function hasBingo(board, x, y) {
  const hasRow = board[y].reduce((prev, curr) => prev + curr, 0) === board.length * -1;
  const hasCol = board.reduce((prev, curr) => prev + curr[x], 0) === board.length * -1;
  return hasRow || hasCol;
}

const lines = txtToLineArray('./day4/input.txt');
const order = lines.shift().split(',').map((str) => parseInt(str, 10));
lines.shift();
const boards = [];
let board = []
lines.forEach((line) => {
  if (line === '') {
    boards.push(board)
    board = [];
  } else {
    board.push(line.split(' ').filter((num) => num !== '').map((str) => parseInt(str, 10)));
  }
});

let bingo;
let winningBoard;
order.forEach((num, index) => {
  boards.forEach((board, boardIndex) => {
    for (let i = 0; i < board.length; i++) {
      const x = board[i].indexOf(num);
      if (x >= 0) {
        board[i][x] = -1;
        if (hasBingo(board, x, i)) {
          bingo = index;
          winningBoard = boards[boardIndex]
          boards[boardIndex] = [];
        }
        break;
      }
    }
  });
});

const sum = sumOfBoard(winningBoard);

console.log(sum);
console.log(order[bingo]);
console.log(sum * order[bingo]);