// countdown for promotions
var countDownDate = new Date("Jun 21, 2021 13:13:21").getTime();
// update the countdown every 1s
window.onload = setInterval(function () {
  // get the current date and time
  var now = new Date().getTime();
  console.log(new Date());

  // calculate the difference between the 2 dates
  var diff = countDownDate - now;

  // time calculations for days, hours, minutes and seconds
  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // display the result in the element countdown
  document.getElementById("countdown").innerHTML = "Promotions end in: " +
    days + "d " + hours + "h " + minutes + "m " + seconds + "s";

  // if the countdown is finished write a text to show that the promotion is over
  if (diff < 0) {
    document.getElementById("countdown").innerHTML = "Promotion is over!";
  }
}, 1000);

// change the image from slides random, the timer is set to 7s but the function can select the same image that it's shown so nothing happens, thus the randomness
window.onload = setInterval(function changePicture() {
  let x = Math.floor((Math.random() * 3) + 1);
  document.getElementById('img-' + x).checked = true
}, 7000);

window.onload = setTimeout(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get('g');

  alert("Don't forget to create an account to be the first who receive the latest promotions!");
}, 10000);

// save the number of visits in total for the user, after 20 visits make an offer
window.onload = setTimeout(function () {
  // localStorage.removeItem("visits");

  // check if the item exists
  if (localStorage.getItem("visits") === null) {
    localStorage.setItem("visits", 0);
  }

  localStorage.setItem("visits", Number(localStorage.getItem("visits")) + 1);

  // reset the counter at 100
  if (localStorage.getItem("visits") == 100) {
    localStorage.setItem("visits", 1);
  }

  // for testing
  console.log(localStorage.getItem("visits"));
});

