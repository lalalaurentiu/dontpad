let consoleContainer = document.querySelector(".console_Js");
let consoleHeader = document.querySelector(".console_Js_header");
let consoleHeaderButton = consoleHeader.querySelectorAll("button");
let output = document.querySelector(".js_output");
let outputHtml = document.querySelector(".html_output_js").contentWindow;

outputHtml.console.log = function (message) {
  output.innerHTML += `<div>${message}</div>`;
};

outputHtml.console.error = function (message) {
  output.innerHTML += `<div style="color:red;">${message}</div>`;
};

function runCode(button) {
  button.addEventListener("click", function () {
    consoleContainer.style.display = "block";
    try {
      outputHtml.eval(editor.getValue());
    } catch (error) {
      output.innerHTML += `<div style="color:red;">${error}</div>`;
    }
  });
}

runCode(consoleHeaderButton[0]);

consoleHeaderButton[1].addEventListener("click", function () {
  output.innerHTML = "";
});

consoleHeaderButton[2].addEventListener("click", function () {
  consoleContainer.style.display = "none";
});

consoleHeaderButton[3].addEventListener("click", function () {
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
      outputHtml.document.body.innerHTML = htmlfile.code;
    }
  });
} else {
}

dragItem = consoleHeader;

consoleHeader.querySelector("input").value = window.location.pathname;

function getAllHints(e) {
  var hints = CodeMirror.hint.javascript(e);
  var anyHints = CodeMirror.hint.anyword(e);

  anyHints.list.forEach(function(hint) {
      if (hints.list.indexOf(hint) == -1)
          hints.list.push(hint);
  })

  console.log(hints);

  if (hints) {
      CodeMirror.on(hints, "pick", function(word) {
          if (word.charAt(word.length - 1) == ')')
              editor.execCommand("goCharLeft");
      });
  }
  return hints;
}

function showAllHints() {
  editor.showHint({
      hint: getAllHints,
      completeSingle: false
  });
}

editor.on("change", function () {
  let cur = editor.getCursor();
  let token = editor.getTokenAt(cur);

  if (token.type === "variable" || token.type === "property") {
    showAllHints();
  } else if (token.type !== null){
    editor.showHint({
      completeSingle: false,
    });
  }
});
