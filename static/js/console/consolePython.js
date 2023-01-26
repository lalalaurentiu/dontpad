let consoleContainer = document.querySelector(".console");
let consoleHeader = document.getElementById("console_header");
let consoleHeaderButtons = consoleHeader.querySelectorAll("button");
let output = document.querySelector(".output");

function runCode(button) {
  button.addEventListener("click", function () {
    consoleContainer.style.display = "block";
    console.log("Run");
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

async function main() {
  let pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/",
  });
  return pyodide;
}

function addToOutput(stdout) {
  try {
    stdout.split("\n").forEach((line) => {
      if (line !== "") {
        line = line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        output.innerHTML += ">>> " + line + "<br>";
      }
    });
  } catch (err) {
    output.innerHTML += ">>> " + stdout + "<br>";
  }
}

function clearHistory() {
  output.innerHTML = "";
}

runCode(consoleHeaderButtons[0]);

consoleHeaderButtons[1].addEventListener("click", function () {
  console.log("Clear");
  clearHistory();
});

consoleHeaderButtons[2].addEventListener("click", function () {
  consoleContainer.style.display = "none";
});

dragItem = consoleHeader;
