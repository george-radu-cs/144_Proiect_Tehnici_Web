window.onload = () => {
  // get how many article elements are in the page
  let l = document.getElementsByTagName('article').length;

  // choose for which one to change the appearance
  let x = Math.floor((Math.random() * l - 1) + 1);

  // change it's style
  document.getElementsByTagName('article')[x].style.fontSize = '27px';
  document.getElementsByTagName('article')[x].style.lineHeight = '35px';
  document.getElementsByTagName('article')[x].style.color = '#EF626C';
  document.getElementsByTagName('article')[x].style.backgroundColor = '#312F2F';
}
