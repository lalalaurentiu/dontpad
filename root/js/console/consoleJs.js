let consoleContainer = document.querySelector('.console_Js');
let consoleHeader = document.querySelector('.console_Js_header');
let consoleHeaderButton = consoleHeader.querySelectorAll('button');
let output = document.querySelector('.js_output');
let outputHtml = document.querySelector('.html_output_js').contentWindow;
// let outputBody = outputHtml.contentWindow.document.body;

outputHtml.console.log = function(message) {
    output.innerHTML += `<div>${message}</div>` ;
};

outputHtml.console.error = function(message) {
    output.innerHTML += `<div style="color:red;">${message}</div>` ;
};

function runCode(button){
  button.addEventListener('click', function(){
        consoleContainer.style.display = 'block';

        try {
          outputHtml.eval(editor.getValue());
        } catch (error) {
          output.innerHTML += `<div style="color:red;">${error}</div>` ;
        }
  });
}

runCode(consoleHeaderButton[0]);

consoleHeaderButton[1].addEventListener('click', function() {
    output.innerHTML = "";
});

consoleHeaderButton[2].addEventListener('click', function() {
    consoleContainer.style.display = 'none';
});

  
let dragItem = consoleHeader;
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let body = document.querySelector('body');

document.addEventListener("touchstart", dragStart, false);
document.addEventListener("touchend", dragEnd, false);
document.addEventListener("touchmove", drag, false);

document.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

function dragStart(e) {
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === dragItem) {
    active = true;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;

  active = false;
}

function drag(e) {
  if (active) {
    e.preventDefault();
  
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, consoleContainer);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

async function getFiles(){
  let file = window.location.pathname.split('/')[1].split('.')[0];
  let response = await fetch("?file=" + file);
  if (response.status === 200) {
    let data = await response.json();
    return data;
  }
  return false;
}


let files = getFiles();

if (files) {
  files.then(function(data){

    let htmlfile= data.html;
    if (htmlfile) {
      outputHtml.document.body.innerHTML = htmlfile.code;
    }
  });
  
}else {
}


