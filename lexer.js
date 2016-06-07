var Stream = require('./stream.js');

module.exports = function Lexer(input) {
  var stream = new Stream(input);
  var current = null;

  this.read = read;
  this.peek = peek;
  this.eol = eol;
  this.throw = stream.throw;

  function is_bracket(character) {
    return '()'.indexOf(character) >= 0;
  }

  function is_digit(character) {
    return '0123456789'.indexOf(character) >= 0;
  }

  function is_operator(character) {
    return '+-*/'.indexOf(character) >= 0;
  }

  function is_whitespace(character) {
    return ' \t'.indexOf(character) >= 0;
  }

  function read_while(test) {
    var result = '';
    while (!stream.eol() && test(stream.peek())) {
      result += stream.read();
    }

    return result;
  }

  function read_number() {
    var has_dot = false;
    var number = read_while(function (character) {
      if (character === '.') {
        if (has_dot) {
          return false;
        }

        has_dot = true;
        return true;
      }

      return is_digit(character);
    });

    return { type: 'NUMBER', value: parseFloat(number) };
  }

  function read_next() {
    read_while(is_whitespace);
    if (stream.eol()) {
      return null;
    }

    var character = stream.peek();
    if (is_operator(character)) {
      return { type: 'OPERATOR', value: stream.read() };
    }

    if (is_bracket(character)) {
      return { type: 'BRACKET', value: stream.read() };
    }

    if (is_digit(character)) {
      return read_number();
    }

    stream.throw('Invalid character: ' + character);
  }

  function peek() {
    if (current) {
      return current;
    }

    current = read_next();
    return current;
  }

  function read() {
    var token = current || read_next();
    current = null;
    return token;
  }

  function eol() {
    return peek() === null;
  }
};
