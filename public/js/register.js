window.onload = setTimeout(() => {
  let x = document.getElementsByClassName('close').length;

  console.log(1);
  for (let i = x - 1; i >= 0; i--) {
    document.getElementsByClassName('close')[i].onclick = () => {
      document.getElementById('alert-' + i).remove();
    }
  }
}, 1000);
