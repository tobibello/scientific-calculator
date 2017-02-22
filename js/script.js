window.onload = InitApp;
function InitApp() {
  for (var i = 0; i < document.getElementsByTagName('button').length; i++) {
    document.getElementsByTagName('button')[i].onclick = EnterFigure;
  }
  function EnterFigure() {
    if (this.hasAttribute('name'))
      document.getElementsByClassName('input')[0].innerHTML += this.name;
  }
}