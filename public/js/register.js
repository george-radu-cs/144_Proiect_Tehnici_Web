window.onload = function () {
  let x = document.getElementsByClassName('close').length;

  for (let i = x - 1; i >= 0; i--) {
    document.getElementsByClassName('close')[i].onclick = function () {
      document.getElementById('alert-' + i).remove();
    }
  }
}
