window.onload = InitApp;

function InitApp() {

  var inputDisplay = document.getElementsByClassName('input')[0];
  var allButtons = document.getElementsByTagName('button');
  var deleteBtn = document.getElementById('delete');
  var resetBtn = document.getElementById('reset');
  var calculateBtn = document.getElementById('equals');

  inputDisplay.innerHTML = "0";
  for (var i = 0; i < allButtons.length; i++) {
    if (allButtons[i].hasAttribute('name')) {
      allButtons[i].onclick = function () {
        if (inputDisplay.innerHTML == "0" && ".*-/+".indexOf(this.name) < 0) {
          inputDisplay.innerHTML = "";
        }
        inputDisplay.innerHTML += this.name;
      };
    }
  }

  deleteBtn.onclick = function () {
    if (inputDisplay.innerHTML != "0")
      inputDisplay.innerHTML = inputDisplay.innerHTML.slice(0, inputDisplay.innerHTML.length - 1);
    if (inputDisplay.innerHTML == "") {
      inputDisplay.innerHTML = "0";
    }
  }

  resetBtn.onclick = function () {
    inputDisplay.innerHTML = "0";
  }

  calculateBtn.onclick = function(){
    
  }
}