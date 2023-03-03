let consoleContainer = document.querySelector(".console_css");
let consoleHeader = document.querySelector(".console_css_header");
let consoleHeaderButton = consoleHeader.querySelectorAll("button");
let output = document.querySelector(".css_output");

let outputBody = output.contentWindow.document.body;
let html = "";

function runCode(button) {
  button.addEventListener("click", function () {
    if (consoleContainer.style.display === "none") {
      consoleContainer.style.display = "block";
      outputBody.innerHTML = `<style>${editor.getValue()}</style>` + html;
    } else {
      consoleContainer.style.display = "none";
    }
  });
}

runCode(consoleHeaderButton[0]);

consoleHeaderButton[1].addEventListener("click", function () {
  if (consoleContainer.style.width === "100%") {
    consoleContainer.style.width = "50%";
    consoleContainer.style.height = "80vh";
  } else {
    consoleContainer.style.width = "100%";
    consoleContainer.style.height = "100%";
  }
});

if (files) {
  files.then(function (data) {
    let htmlfile = data.html;
    if (htmlfile) {
      html = htmlfile.code;
    }
  });
}

editor.on("change", function () {
  let cur = editor.getCursor();
  let token = editor.getTokenAt(cur);

  if (token.type !== null) {
    editor.showHint({ completeSingle: false });
  }
  CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
    outputBody.innerHTML = `<style>${editor.getValue()}</style>` + html;
});

dragItem = consoleHeader;

consoleHeader.querySelector("input").value = window.location.pathname;
