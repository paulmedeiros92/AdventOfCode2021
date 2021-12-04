const fs = require('fs');

exports.txtToLineArray = (filePath) => {
  const allFileContents = fs.readFileSync(filePath, 'utf-8');
  return allFileContents.split(/\r?\n/)
}
