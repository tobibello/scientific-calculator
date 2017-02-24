window.onload = InitApp;

function InitApp() {

  var inputDisplay = document.getElementsByClassName('input')[0];
  var resultDisplay = document.getElementsByClassName('result')[0];
  var allButtons = document.getElementsByTagName('button');
  var deleteBtn = document.getElementById('delete');
  var resetBtn = document.getElementById('reset');
  var calculateBtn = document.getElementById('equals');

  inputDisplay.innerHTML = "";
  inputDisplay.style.backgroundColor = '#86a2a5';
  var tokens = ['0'];
  var Ans = 0;
  var flag = false;

  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i].hasAttribute('name')) {
      allButtons[i].onclick = function () {
        var peek = this.name;
        if (flag) {
          inputDisplay.innerHTML = "";
          tokens = ['0'];
          flag = false;
          inputDisplay.style.backgroundColor = '#86a2a5';
        }
        inputDisplay.innerHTML += peek;
        if (((!isNaN(parseInt(peek)) || peek == '.') && peek != "10^(")
          && tokens.length > 0
          && ((!isNaN(parseInt(tokens[tokens.length - 1])) || tokens[tokens.length - 1] == '.') && tokens[tokens.length - 1] != "10^(")) {
          var last = tokens.pop();
          tokens.push(last + peek);
        }
        else {
          if (tokens.length == 1 && tokens[0] == '0') {
            tokens.pop();
          }
          tokens.push(peek);
        }
      };
    }
  }

  deleteBtn.onclick = function () {
    if (inputDisplay.innerHTML != "" && !flag) {
      var deleted = tokens.pop();
      if ('e^(, ^(, √('.indexOf(deleted) >= 0) {
        inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 2);
      } else if ('Ans, mod, 10^(, ln('.indexOf(deleted) >= 0) {
        inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 3);
      } else if ('<sub>x10^</sub>, sin(, cos(, tan(, log('.indexOf(deleted) >= 0) {
        inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 4);
      }
      else if ('asin(, acos(, atan('.indexOf(deleted) >= 0) {
        inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 5);
      }
      else {
        inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 1);
        if (!isNaN(parseInt(deleted)) && deleted.length > 1) {
          tokens.push(deleted.slice(0, deleted.length - 1));
        }
      }
    }
  }

  resetBtn.onclick = function () {
    inputDisplay.innerHTML = "";
    resultDisplay.innerHTML = "";
    tokens = ['0'];
    Ans = 0;
    flag = false;
    inputDisplay.style.backgroundColor = '#86a2a5';
  }

  calculateBtn.onclick = function () {
    var tokensEnumerator = MakeEnumerable(tokens).getEnumerator();
    function MakeEnumerable(items) {
      counter = -1;
      return {
        enumerator: {
          moveNext: function () {
            counter++;
            return counter < items.length;
          },
          getCurrent: function () {
            return items[counter];
          }
        },
        getEnumerator: function () {
          return this.enumerator;
        }
      };
    };
    var lookahead = tokensEnumerator.moveNext() ? tokensEnumerator.getCurrent() : "</>";
    var stack = [];
    try {
      Expr();
      // Ans = stack.pop();
      if (stack.length == 1) Ans = stack.pop(); else throw 'Unexpected Error';
      resultDisplay.innerHTML = lookahead == "</>" ? Ans : err;
    }
    catch (err) {
      resultDisplay.innerHTML = err;
    } finally {
      flag = true;
      inputDisplay.style.backgroundColor = '#9AB7BB';
    }

    function Expr() {
      Term1();
      while (true) {
        if (lookahead == '+') {
          Match('+');
          Term1();
          SolveBinary('+');
        }
        else if (lookahead == '-') {
          Match('-');
          Term1();
          SolveBinary('-');
        }
        else return;
      }
    }

    function Term1() {
      Term2();
      while (true) {
        if (lookahead == '*') {
          Match('*');
          Term2();
          SolveBinary('*');
        }
        else if (lookahead == '/') {
          Match('/');
          Term2();
          SolveBinary('/');
        } else if (lookahead == 'mod') {
          Match('mod');
          Term2();
          SolveBinary('mod');
        }
        else if (lookahead == '<sub>x10^</sub>') {
          Match('<sub>x10^</sub>');
          Term2();
          SolveBinary('<sub>x10^</sub>');
        }
        else return;
      }
    }

    function Term2() {
      Unary();
      while (true) {
        if (lookahead == '^(') {
          Match('^(');
          Unary();
          if (lookahead == ')') Match(')');
          SolveBinary('^(');
        }
        else return;
      }
    }

    function Unary() {
      if (lookahead == '√(') {
        Match('√(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('√(');
      } else if (lookahead == 'sin(') {
        Match('sin(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('sin(');
      } else if (lookahead == 'cos(') {
        Match('cos(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('cos(');
      } else if (lookahead == 'tan(') {
        Match('tan(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('tan(');
      } else if (lookahead == 'asin(') {
        Match('asin(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('asin(');
      } else if (lookahead == 'acos(') {
        Match('acos(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('acos(');
      } else if (lookahead == 'atan(') {
        Match('atan(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('atan(');
      } else if (lookahead == 'ln(') {
        Match('ln(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('ln(');
      } else if (lookahead == 'log(') {
        Match('log(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('log(');
      } else if (lookahead == '10^(') {
        Match('10^(');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('10^(');
      } else if (lookahead == 'e^()') {
        Match('e^()');
        Unary();
        if (lookahead == ')') Match(')');
        SolveUnary('e^()');
      }
      else {
        Factor();
        return;
      }
    }

    function Factor() {

      var intlookahead = parseFloat(lookahead);
      if (!isNaN(intlookahead) || lookahead == "Ans") {
        stack.push(lookahead == "Ans" ? Ans : intlookahead);
        Match(lookahead);
      }
      else if (lookahead == '(') {
        Match('(');
        Expr();
        Match(')');
      }
      else throw "Syntax Error";
      while (true) {
        if (lookahead == '!') {
          Match('!');
          SolveUnary('!');
        } else return;
      }
    }

    function Match(t) {
      if (lookahead == t) {
        lookahead = tokensEnumerator.moveNext() ? tokensEnumerator.getCurrent() : "</>";
      } else throw "Syntax Error";
    }

    function SolveBinary(operator) {
      var secondOperand = stack.pop();
      var firstOperand = stack.pop();
      switch (operator) {
        case '+': stack.push(firstOperand + secondOperand); break;
        case '-': stack.push(firstOperand - secondOperand); break;
        case '*': stack.push(firstOperand * secondOperand); break;
        case '/': stack.push(firstOperand / secondOperand); break;
        case 'mod': stack.push(firstOperand % secondOperand); break;
        case '^(': stack.push(Math.pow(firstOperand, secondOperand)); break;
        case '√(': stack.push(Math.sqrt(firstOperand, secondOperand)); break;
        case '<sub>x10^</sub>': stack.push(firstOperand * Math.pow(10, secondOperand)); break;
        default: throw 'Invalid Operator';
      }
    }

    function SolveUnary(operator) {
      var operand = stack.pop();
      switch (operator) {
        case '10^(': stack.push(Math.pow(10, operand)); break;
        case 'e^()': stack.push(Math.exp(operand)); break;
        case 'log(': stack.push(Math.log10(operand)); break;
        case 'ln(': stack.push(Math.log(operand)); break;
        case '√(': stack.push(Math.sqrt(operand)); break;
        case '!': stack.push(Factorial(operand)); break;
        case 'sin(': stack.push(Math.sin(ConvertToRadian(operand))); break;
        case 'cos(': stack.push(Math.cos(ConvertToRadian(operand))); break;
        case 'tan(': stack.push(Math.tan(ConvertToRadian(operand))); break;
        case 'asin(': stack.push(ConvertToDegrees(Math.asin(operand))); break;
        case 'acos(': stack.push(ConvertToDegrees(Math.acos(operand))); break;
        case 'atan(': stack.push(ConvertToDegrees(Math.atan(operand))); break;
        default: throw 'Invalid Operator';
      }
    }

    function Factorial(n) {
      var sum = 1;
      if (typeof n == "number") {
        if (n == 0 || n == 1) return sum;
        else if (n < 0) throw 'Invalid Number';
        else {
          for (var i = 2; i <= n; i++) {
            sum *= i;
          }
          return sum;
        }
      }
    }

    function ConvertToRadian(degrees) {
      return degrees * Math.PI / 180;
    }

    function ConvertToDegrees(radians) {
      return radians * 180 / Math.PI;
    }
  }

  inputDisplay.onclick = function () {
    flag = false;
    inputDisplay.style.backgroundColor = '#86a2a5';
  }
}


/*
    var tokens = SplitToTokens(expression);
    function SplitToTokens(source) {
      var charArray = [];
      for (var i = 0; i < source.length; i++)
        charArray.push(source.charAt(i));
      var tokens = [];
      var i = 0;
      while (i < charArray.length) {
        peek = charArray[i];
        if (!isNaN(parseInt(peek)) || peek == '.') {
          var v = 0;
          while (!isNaN(parseInt(peek)) && i < charArray.length) {
            v = 10 * v + (peek.charCodeAt(0) - '0'.charCodeAt(0));
            i++;
            if (i < charArray.length) peek = charArray[i];
          }
          tokens.push(v);
        }
        else if (peek == 'A' && i < charArray.length) {
          var ans = '';
          for (var j = 0; j < 3; j++) {
            ans += peek;
            i++;
            if (i < charArray.length) peek = charArray[i];
          }
          tokens.push(ans);
        }
        else if (peek == 'x' && i < charArray.length) {
          var exp = '';
          for (var j = 0; j < 3; j++) {
            exp += peek;
            i++;
            if (i < charArray.length) peek = charArray[i];
          }
          tokens.push(exp);
        }
        else {
          tokens.push(peek);
          i++;
          if (i < charArray.length) peek = charArray[i];
        }
      }
      return tokens;
    }
*/