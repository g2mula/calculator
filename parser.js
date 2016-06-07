var Lexer = require('./lexer.js');

module.exports = function Parser() {
  var lexer;

  this.parse = function (input) {
    lexer = new Lexer(input);
    return parse_expression();
  };

  this.throw = function (message) {
    if (lexer) {
      lexer.throw(message);
    }
  };

  function parse_bracket() {
    var token = lexer.read();
    if (token.value !== '(') {
      lexer.throw('Unexpected token');
    }

    var expression = parse_expression();
    token = lexer.peek();
    if (token.value !== ')') {
      lexer.throw('Expected token is )');
    }

    lexer.read();
    return expression;
  }

  function parse_unary() {
    var token = lexer.peek();
    if (token.type === 'OPERATOR' && '+-'.indexOf(token.value) >= 0) {
      lexer.read();

      var expression = parse_low_level_expression();

      return {
        operation: token.value,
        right: expression
      }
    }

    lexer.throw('Unexpected token');
  }

  function parse_low_level_expression() {
    if (lexer.eol()) {
      return null;
    }

    var token = lexer.peek();
    switch (token.type) {
      case 'BRACKET':
        return parse_bracket();
      case 'NUMBER':
        token = lexer.read();
        return token;
      default:
        return parse_unary();
    }
  }

  function parse_second_level_expression() {
    var expression = parse_low_level_expression();
    var other_expression;
    var token = lexer.peek();
    while (!lexer.eol() && '*/'.indexOf(token.value) >= 0) {
      token = lexer.read();
      other_expression = parse_low_level_expression();

      expression = {
        operation: token.value,
        left: expression,
        right: other_expression
      };

      token = lexer.peek();
    }

    return expression;
  }

  function parse_first_level_expression() {
    var expression = parse_second_level_expression();
    var other_expression;
    var token = lexer.peek();
    while (!lexer.eol() && '+-'.indexOf(token.value) >= 0) {
      token = lexer.read();
      other_expression = parse_second_level_expression();

      expression = {
        operation: token.value,
        left: expression,
        right: other_expression
      };

      token = lexer.peek();
    }

    return expression;
  }


  function parse_expression() {
    var expression = parse_first_level_expression();
    return expression;
  }
};
