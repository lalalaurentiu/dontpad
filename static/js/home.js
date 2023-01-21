//
let loc = window.location.host;
document.getElementById("location").innerHTML = loc  + "/";

let goButton = document.getElementById("go");

goButton.addEventListener("click", function(){
    let input = document.getElementById("path").value;
    window.open(input, "_self");
});

goButton.addEventListener("touchstart", function(){
    let input = document.getElementById("path").value;
    window.open(input, "_self");
});