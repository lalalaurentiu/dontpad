let consoleContainer = document.querySelector(".console_html");
let consoleHeader = document.querySelector(".console_html_header");
let consoleHeaderButton = consoleHeader.querySelector("button");
let output = document.querySelector(".html_output");

let outputBody = output.contentWindow.document.body;
let css = "";
let js = "";

output.contentWindow.log = function (message) {
  outputBody.innerHTML += `<div>${message}</div>`;
};

output.contentWindow.error = function (message) {
  outputBody.innerHTML += `<div style="color:red;">${message}</div>`;
};

function runCode(button) {
  button.addEventListener("click", function () {
    if (consoleContainer.style.display === "none") {
      consoleContainer.style.display = "block";
      try {
        outputBody.innerHTML = css + editor.getValue() + js;
        output.contentWindow.eval(
          js.split("<script>")[1].split("</script>")[0]
        );
      } catch (error) {
        outputBody.innerHTML += `<div style="color:red;">${error}</div>`;
      }
    } else {
      consoleContainer.style.display = "none";
    }
  });
}

runCode(consoleHeaderButton);

if (files) {
  files.then(function (data) {
    let cssfile = data.css;
    let jsfile = data.js;
    if (cssfile) {
      let style = `
        <style>
          ${cssfile.code}
        </style>
      `;
      css = style;
    }
    if (jsfile) {
      js = `
        <script>
          ${jsfile.code}
        </script>
      `;
    }
  });
} else {
  console.log("error");
}

editor.on("change", function () {
  try {
    outputBody.innerHTML = css + editor.getValue() + js;
    output.contentWindow.eval(js.split("<script>")[1].split("</script>")[0]);
  } catch (error) {
    outputBody.innerHTML += `<div style="color:red;">${error}</div>`;
  }
});

dragItem = consoleHeader;