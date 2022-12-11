let videoStartBtn = document.getElementById('videoStartBtn');
let videoStopBtn = document.getElementById('videoStopBtn');

let mediaRecorder;
let audioChunks = [];
let changes = []

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

// functia de inregistrare a timpului
let time = 0;
function timer(){
  let interval = setInterval(function(){
    time++;
  }, 100);
  return interval;
}
timer();
// ------------------------------

// functia de inregistrare a audio-ului

async function recordAudio() {
    // asteptam ca utilizatorul sa dea permisiunea de a folosi microfonul
    let audio = await navigator.mediaDevices.getUserMedia({ audio: true })

    mediaRecorder = new MediaRecorder(audio);
    mediaRecorder.start();

    mediaRecorder.ondataavailable = function (e) {
        audioChunks.push(e.data);
    };

    mediaRecorder.onstop = function () {
        audio.getTracks().forEach(track => track.stop());
        let blob = new Blob(audioChunks, {
            type: 'audio/mp3'
        });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('audio');
        a.src = url;
        a.controls = true;
        document.body.appendChild(a);
        audioChunks = [];
    };
};
// ------------------------------


videoStartBtn.addEventListener('click', function(){
    recordAudio();
})

videoStopBtn.addEventListener('click', function(){
    mediaRecorder.stop();
})

editor.on ('change', function (instance, changeObj) {
  changeObj.time = time;
  changes.push(changeObj);
  console.log(changes);
  })

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

editor.on ("keyup", function (instance, event) {
  if (event.keyCode == 13){
    console.log('enter');
    let enterObj = {
      from: {line: editor.getCursor().line, ch: 0},
      to: {line: editor.getCursor().line, ch: 0},
      text: ["\n"],
      time: time,
    }
    changes.push(enterObj);
    }
  })