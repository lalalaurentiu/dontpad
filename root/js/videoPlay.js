// funtia de scriere a textului
function textWrite(txt, cm, speed,fromLine, fromCh , toLine, toCh) {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            cm.replaceRange(txt[0] , {line: fromLine, ch:fromCh}, {line: toLine, ch:toCh});
            clearInterval(interval);
                resolve();
        }, speed);
    });
};

async function writeText(txtList, cm, speed ,fromLine, fromCh , toLine, toCh) {
        await textWrite(txtList[i], cm, speed, fromLine, fromCh , toLine, toCh);
};
// ------------------------------

let testceva = CodeMirror.fromTextArea(document.getElementById('ceva'), {
    mode: 'text/x-perl',
    lineNumbers: true,
    keyMap:"sublime",
    theme: 'abbott',
    autoCloseBrackets: true,
    styleSelectedText:true,
  });



let btn = document.getElementById('cevabtn');
btn.addEventListener('click', function(){
  console.log('ceva');
  changes.forEach((element, index) => {
    textWrite(element.text, testceva, element.time * 100, element.from.line, element.from.ch, element.to.line, element.to.ch);
  });
})