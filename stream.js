module.exports = function Stream(input) {
  var position = 0;

  this.reset = function () {
    position = 0;
  };

  this.peek = function () {
    return input.charAt(position);
  };

  this.read = function () {
    return input.charAt(position++);
  };

  this.eol = function () {
    return this.peek() === '' || this.peek() === '\n';
  };

  this.throw = function (message) {
    var errorMessage = message + '\n' +
      input + '\n' +
      new Array(position + 1).join('-') + '^' + new Array(input.length - position).join('-') + '\n' +
      'Error at column ' + position;

    throw new Error(errorMessage);
  };
};
