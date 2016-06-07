var Parser = require('./parser.js');

module.exports = function Evaluator() {
  var parser = new Parser();

  function evaluateOperation(node) {
    switch (node.operation) {
      case '+':
        if (node.left) {
          return evaluateNode(node.left) + evaluateNode(node.right);
        }

        return evaluateNode(node.right);
      case '-':
        if (node.left) {
          return evaluateNode(node.left) - evaluateNode(node.right);
        }

        return evaluateNode(node.right) * - 1;
      case '*':
        return evaluateNode(node.left) * evaluateNode(node.right);
      case '/':
        return evaluateNode(node.left) / evaluateNode(node.right);
      default:
        parser.throw('Unknown operation ' + node.operation);
    }
  }

  function evaluateNode(node) {
    if (node.operation) {
      return evaluateOperation(node);
    }

    if (node.type === 'NUMBER') {
      return node.value
    }

    parser.throw('Unhandled node\n' + JSON.stringify(node, null, 2));
  }

  this.evaluate = function (input) {
    var tree = parser.parse(input);
    if (tree === null) {
      return '';
    }

    return evaluateNode(tree);
  };
};

