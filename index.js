var Evaluator = require('./evaluator.js');
var input = process.argv.slice(2).join(' ');
// input = '15*8/(98 - 99)';

console.log(input);


var evaluator = new Evaluator();
console.log(evaluator.evaluate(input));

