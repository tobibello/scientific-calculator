window.onload = InitApp;

function InitApp() {

  var inputDisplay = document.getElementsByClassName('input')[0];
  var resultDisplay = document.getElementsByClassName('result')[0];
  var allButtons = document.getElementsByTagName('button');
  var deleteBtn = document.getElementById('delete');
  var resetBtn = document.getElementById('reset');
  var calculateBtn = document.getElementById('equals');

  inputDisplay.innerHTML = "";
  var tokens = ["0"];
  var Ans = 0;
  var flag = false;

  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i].hasAttribute('name')) {
      allButtons[i].onclick = function () {
        var peek = this.name;
        /*if (inputDisplay.innerHTML == "0" && ".*-/+".indexOf(peek) < 0) {
          inputDisplay.innerHTML = "";
        } else */
        if (flag) {
          inputDisplay.innerHTML = "";
          tokens = [];
          flag = false;
        }
        inputDisplay.innerHTML += peek;

        if ((!isNaN(parseInt(peek)) || peek == '.')
          && tokens.length > 0
          && (!isNaN(parseInt(tokens[tokens.length - 1])) || tokens[tokens.length - 1] == '.')) {
          var last = tokens.pop();
          tokens.push(last + peek);
        } else {
          tokens.push(peek);
        }
      };
    }
  }

  deleteBtn.onclick = function () {
    if (inputDisplay.innerHTML != "0") {
      var deleted = tokens.pop();
      if (deleted == 'Ans' || deleted == 'x10') {
        inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 3);
      }
      else {
        inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 1);
        if (!isNaN(parseInt(deleted)) && deleted.length > 1) {
          tokens.push(deleted.slice(0, deleted.length - 1));
        }
      }
    }
    else if (inputDisplay.innerHTML == "") {
      inputDisplay.innerHTML = "0";
    }
  }

  resetBtn.onclick = function () {
    inputDisplay.innerHTML = "";
    resultDisplay.innerHTML = "";
    tokens = ['0'];
    Ans = 0;
    flag = false;
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
      Ans = stack.pop()
      resultDisplay.innerHTML = lookahead == "</>" ? Ans : err;
    }
    catch (err) {
      resultDisplay.innerHTML = err;
    } finally {
      flag = true;
    }

    function Expr() {
      Term();
      while (true) {
        if (lookahead == '+') {
          Match('+');
          Term();
          Solve('+');
        }
        else if (lookahead == '-') {
          Match('-');
          Term();
          Solve('-');
        }
        else return;
      }
    }

    function Term() {
      Factor();
      while (true) {
        if (lookahead == '*') {
          Match('*');
          Factor();
          Solve('*');
        }
        else if (lookahead == '/') {
          Match('/');
          Factor();
          Solve('/');
        }
        else if (lookahead == 'x10') {
          Match('x10');
          Factor();
          Solve('x10');
        }
        else return;
      }
    }

    function Factor() {
      var intlookahead = parseFloat(lookahead);
      if (!isNaN(intlookahead) || lookahead == "Ans") {
        stack.push(lookahead == "Ans" ? Ans : intlookahead);
        Match(lookahead);
      }
      // else if (lookahead.tag == '(') {
      //   Match('(');
      //   Expression();
      //   Match(')');
      // } 
      else throw "Syntax Error";
    }

    function Match(t) {
      if (lookahead == t) {
        lookahead = tokensEnumerator.moveNext() ? tokensEnumerator.getCurrent() : "</>";
      } else throw "Syntax Error";
    }

    function Solve(operator) {
      var secondOperand = stack.pop();
      var firstOperand = stack.pop();
      if (operator == '+') {
        stack.push(firstOperand + secondOperand);
      } else if (operator == '-') {
        stack.push(firstOperand - secondOperand);
      } else if (operator == '*') {
        stack.push(firstOperand * secondOperand);
      } else if (operator == '/') {
        stack.push(firstOperand / secondOperand);
      } else if (operator == 'x10') {
        stack.push(firstOperand * Math.pow(10, secondOperand));
      }
    }
  }

  inputDisplay.onclick = function () {
    flag = false;
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