window.onload = InitApp;

function InitApp() {

  var inputDisplay = document.getElementsByClassName('input')[0];
  var allButtons = document.getElementsByTagName('button');
  var deleteBtn = document.getElementById('delete');
  var resetBtn = document.getElementById('reset');
  var calculateBtn = document.getElementById('equals');

  inputDisplay.innerHTML = "0";
  var tokens = [];
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i].hasAttribute('name')) {
      allButtons[i].onclick = function () {
        if (inputDisplay.innerHTML == "0" && ".*-/+".indexOf(this.name) < 0) {
          inputDisplay.innerHTML = "";
        }
        inputDisplay.innerHTML += this.name;
        tokens.push(this.name);
      };
    }
  }

  deleteBtn.onclick = function () {
    if (inputDisplay.innerHTML != "0") {
      var deleted = tokens.pop();
      if (deleted == 'Ans' || deleted == 'x10')
        inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 3);
      else
        inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 1);
    }
    else if (inputDisplay.innerHTML == "") {
      inputDisplay.innerHTML = "0";
    }
  }

  resetBtn.onclick = function () {
    inputDisplay.innerHTML = "0";
    tokens = [];
  }

  calculateBtn.onclick = function () {
    var tokensEnumerator = MakeEnumerable(tokens).getEnumerator();
    var MakeEnumerable = function (items) {
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
    var i = 0;
    var lookahead = tokensEnumerator.moveNext() ? tokensEnumerator.getCurrent() : "</>";
    try {
      Expr();
      return lookahead == "</>";
    }
    catch (err) {
      return false;
    }

    function Expr() {
      Term();
      while (true) {
        if (lookahead == '+') {
          Match('+');
          Term();
        }
        else if (lookahead == '-') {
          Match('-');
          Term();
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
        }
        else if (lookahead == '/') {
          Match('/');
          Factor();
        }
        // else if (lookahead == '^') {
        //   Match('^');
        //   Factor();
        // }
        else return;
      }
    }

    function Factor() {
      if (!isNaN(parseInt(lookahead)) || lookahead == "Ans") {
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