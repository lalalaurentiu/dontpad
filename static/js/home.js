//
let loc = window.location.host;
document.getElementById("location").innerHTML = loc  + "/";

let goButton = document.getElementById("go");
goButton.addEventListener("click", function(){
    let input = document.querySelector("input").value;
    window.open(input, "_self");
});