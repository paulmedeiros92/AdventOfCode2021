const { txtToLineArray } = require('../ingest/lineByLine');

const uniqueLengths = [2, 3, 4, 7];

function determineKeys(keys) {
  const knownLengths = [
    { digit: 1, length: 2 },
    { digit: 4, length: 4 },
    { digit: 7, length: 3 },
    { digit: 8, length: 7 },
  ]
  const identifiedKeys = new Array(10);
  // find 1, 4, 3, 7
  knownLengths.forEach(({digit, length}) => {
    const foundIndex = keys.findIndex((key) => key.length === length);
    identifiedKeys[digit] = keys[foundIndex].split('');
    keys.splice(foundIndex, 1);
  });
  // find all with 7 in it
  const sevens = keys.filter((key) => identifiedKeys[7].every((char) => key.includes(char)));
  sevens.forEach((seven) => {
    keys.splice(keys.findIndex((key) => key === seven), 1);
  });
  // find 3
  let foundIndex = sevens.findIndex((key) => key.length === 5);
  identifiedKeys[3] = sevens[foundIndex].split('');
  sevens.splice(foundIndex, 1);
  // find 9
  foundIndex = sevens.findIndex((key) => identifiedKeys[4].every((char) => key.includes(char)));
  identifiedKeys[9] = sevens[foundIndex].split('');
  sevens.splice(foundIndex, 1);
  // find 0
  identifiedKeys[0] = sevens[0].split('');
  // find 6
  foundIndex = keys.findIndex((key) => key.length === 6);
  identifiedKeys[6] = keys[foundIndex].split('');
  keys.splice(foundIndex, 1);
  // find 5
  const countA = identifiedKeys[4].reduce((previous, current) => {
    const inc = keys[0].includes(current) ? 1 : 0;
    return previous + inc;
  }, 0);
  const countB = identifiedKeys[4].reduce((previous, current) => {
    const inc = keys[1].includes(current) ? 1 : 0;
    return previous + inc;
  }, 0);
  identifiedKeys[5] = countA > countB ? keys[0].split('') : keys[1].split('');
  identifiedKeys[2] = countA > countB ? keys[1].split('') : keys[0].split('');
  return identifiedKeys.map((key) => key.sort().join(''));
}

const lines = txtToLineArray('./day8/input.txt');
const mapNOutput = lines.map((line) => {
  const both = line.split(' | ')
  return {
    keys: determineKeys(both[0].split(' ')),
    out: both[1].split(' ').map((strDigit) => strDigit.split('').sort().join(''))
  };
});

const x = mapNOutput.reduce((previous, current) => {
  let strNum = ''
  current.out.forEach((digitCode) => {
    strNum += current.keys.findIndex((key) => key === digitCode);
  });
  return previous + parseInt(strNum, 10);
}, 0);

console.log(x);
