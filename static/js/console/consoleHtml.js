let consoleContainer = document.querySelector(".console_html");
let consoleHeader = document.querySelector(".console_html_header");
let consoleHeaderButton = consoleHeader.querySelectorAll("button");
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
    } else {
      js = `
        <script>
        </script>
      `;
    }
  });
} else {
  console.log("error");
}

function resetiframe() {
  let iframe = document.createElement("iframe");
  iframe.setAttribute("class", "html_output");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("width", "100%");
  iframe.setAttribute("height", "100%");
  output.replaceWith(iframe);
  output = document.querySelector(".html_output");
  outputBody = output.contentWindow.document.body;
  output.contentWindow.log = function (message) {
    outputBody.innerHTML += `<div>${message}</div>`;
  };
  output.contentWindow.error = function (message) {
    outputBody.innerHTML += `<div style="color:red;">${message}</div>`;
  };

  try {
    outputBody.innerHTML = css + editor.getValue() + js;
    output.contentWindow.eval(js.split("<script>")[1].split("</script>")[0]);
  } catch (error) {
    outputBody.innerHTML += `<div style="color:red;">${error}</div>`;
  }
}

CodeMirror.commands.autocomplete = function (cm, hint, options) {
  if (!hint) hint = CodeMirror.hint.html;
  if (hint.async) {
    hint(cm, options, function (data) {
      cm.showHint(options, data);
    });
  } else {
    return cm.showHint(options, hint(cm, options));
  }
};


editor.on("change", function () {
  resetiframe();
  let cur = editor.getCursor();
  let token = editor.getTokenAt(cur);
  if (token.type === "tag bracket" || token.type === "attribute")  {
    CodeMirror.commands.autocomplete(editor, () => {}, { completeSingle: false });
  } 
  try {
    outputBody.innerHTML = css + editor.getValue() + js;
    output.contentWindow.eval(js.split("<script>")[1].split("</script>")[0]);
  } catch (error) {
    outputBody.innerHTML += `<div style="color:red;">${error}</div>`;
  }
});

dragItem = consoleHeader;

consoleHeader.querySelector("input").value = window.location.pathname;


