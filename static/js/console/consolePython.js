function runCode(button){
    button.addEventListener('click', function() {
        consoleContainer.style.display = 'block';
        console.log('Run');
        let pyodideReadyPromise = main();

        async function evaluatePython() {
            let pyodide = await pyodideReadyPromise;
            try {
                pyodide.runPython(`
                    import sys
                    from io import StringIO
                    sys.stdout = StringIO()
                `);
                pyodide.runPython(editor.getValue());
                let stdout = pyodide.runPython("sys.stdout.getvalue()");
                addToOutput(stdout);
                consoleContainer.scrollTop = 999999999;
            } catch (err) {
                addToOutput(err);
                consoleContainer.scrollTop = 999999999;
            }
        }
        evaluatePython();
    });
}
let consoleContainer = document.querySelector('.console');
let consoleHeader = document.getElementById('console_header');
let consoleHeaderButtons = consoleHeader.querySelectorAll('button');
let output = document.querySelector('.output');

async function main() {
    let pyodide = await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/"});
    return pyodide
}

function addToOutput(stdout) {
    try {
        stdout.split('\n').forEach(line => {
            if (line !== ''){
                line = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                output.innerHTML += ">>> " + line + "<br>";
            };
        });
    } catch (err) {
        output.innerHTML += ">>> " + stdout + "<br>";
    }
}

function clearHistory() {
output.innerHTML = "";
}

runCode(consoleHeaderButtons[0]);

consoleHeaderButtons[1].addEventListener('click', function() {
    console.log('Clear');
    clearHistory();
});

consoleHeaderButtons[2].addEventListener('click', function() {
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