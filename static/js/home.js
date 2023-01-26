//
let loc = window.location.host;
document.getElementById("location").innerHTML = loc + "/";

let goButton = document.getElementById("go");

goButton.addEventListener("click", function () {
  let input = document.getElementById("path").value;
  window.open(input, "_self");
});

goButton.addEventListener("touchstart", function () {
  let input = document.getElementById("path").value;
  window.open(input, "_self");
});

let input = document.getElementById("path");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    goButton.click();
  }
});
