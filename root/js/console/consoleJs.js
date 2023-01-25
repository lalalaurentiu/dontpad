let consoleContainer = document.querySelector('.console_Js');
let consoleHeader = document.querySelector('.console_Js_header');
let consoleHeaderButton = consoleHeader.querySelectorAll('button');
let output = document.querySelector('.js_output');
let outputHtml = document.querySelector('.html_output_js').contentWindow;

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
        };
  });
};

runCode(consoleHeaderButton[0]);

consoleHeaderButton[1].addEventListener('click', function() {
    output.innerHTML = "";
});

consoleHeaderButton[2].addEventListener('click', function() {
    consoleContainer.style.display = 'none';
});

if (files) {
  files.then(function(data){
    let htmlfile= data.html;
    if (htmlfile) {
      outputHtml.document.body.innerHTML = htmlfile.code;
    };
  });
}else {};

dragItem = consoleHeader;

