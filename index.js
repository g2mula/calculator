#! /usr/bin/env node

var readline = require('readline');
var Evaluator = require('./evaluator.js');
// var input = process.argv.slice(2).join(' ');
// // input = '15*8/(98 - 99)';

var evaluator = new Evaluator();

var reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

reader.setPrompt('calc > ');
reader.prompt();

reader.on('line', (line) => {
  switch (line.trim()) {
    case 'q':
    case 'Q':
      reader.close();
      return;
    default:
      try {
        console.log(evaluator.evaluate(line));
      } catch (error) {
        console.log(error);
      }
      break;
  }

  reader.prompt();
}).on('close', () => {
  console.log('Thank you for using the calculator.');
  process.exit(0);
});
