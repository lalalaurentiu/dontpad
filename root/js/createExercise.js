let codeInput = CodeMirror.fromTextArea(document.getElementById("id_codeInput"), {
    lineNumbers: true,
    mode: "text/x-perl",
    theme: "abbott"
});

let hints = CodeMirror.fromTextArea(document.getElementById("id_hints"), {
    mode: "text/x-perl",
    theme: "abbott"
});

codeInput.on("change", function(){
    document.getElementById("id_codeInput").value = codeInput.getValue();
});

hints.on("change", function(){
    document.getElementById("id_hints").value = hints.getValue();
});