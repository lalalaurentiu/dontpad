let consoleContainer = document.querySelector(".console_css");
let consoleHeader = document.querySelector(".console_css_header");
let consoleHeaderButton = consoleHeader.querySelector("button");
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

runCode(consoleHeaderButton);

if (files) {
  files.then(function (data) {
    let htmlfile = data.html;
    if (htmlfile) {
      html = htmlfile.code;
    }
  });
}

editor.on("change", function () {
    outputBody.innerHTML = `<style>${editor.getValue()}</style>` + html;
});

dragItem = consoleHeader;
