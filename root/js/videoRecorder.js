let videoStartBtn = document.getElementById('cmVideo');
let mediaRecorder;
let audioChunks = [];
let changes = []

// functia de inregistrare a timpului
let time = 0;
function timer(){
  let interval = setInterval(function(){
    time++;
  }, 100);
  return interval;
}
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
      
      let blob = new Blob(audioChunks, {
          type: 'audio/mp3'
      });
      let audiourl = URL.createObjectURL(blob);

      let date = new Date();

      let audioName = date.getFullYear() + '-' +
                      (date.getMonth() + 1) + '-' +
                      date.getDate() + '-' +
                      date.getHours() + '-' +
                      date.getMinutes() + '-' +
                      date.getSeconds() + '.mp3';

      fetch(audiourl) 
      .then(res => res.blob())
      .then(blob => {
          const csrf_token = getCookie('csrftoken');
          let audio = new File([blob], audioName, {type: 'audio/mp3'});
          let formData = new FormData();
            formData.append('audio', audio);
            formData.append('changes', JSON.stringify(changes));
          fetch(url + 'PostVideoCode/', {
              method: 'POST',
              headers: {
                  'X-CSRFToken': csrf_token
              },
              body: formData
          })
          .then(res => res.json())
          .then(data => {
              console.log(JSON.parse(data.json));
              audioChunks = [];
              changes = [];
          })
      })
      
      audio.getTracks().forEach(track => track.stop());
  };
};
// ------------------------------

let startTime;

// functia de inregistrare a textului
function editorChange (instance, changeObj) {
  console.log("change")
  changeObj.time = time;
  changes.push(changeObj);
};

function editorKeyup (instance, event) {
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
};
// ------------------------------

videoStartBtn.addEventListener('click', function(){
  if (this.value == 'Start'){
    this.value = 'Stop';

    // pornim timpul
    startTime = timer();

    // pornim inregistrarea audio
    recordAudio();

    // pornim inregistrarea textului
    editor.on('change', editorChange)

    editor.on("keyup", editorKeyup)
      
    console.log('start');
  } else {
    this.value = 'Start';

    // oprim timpul
    clearInterval(startTime);
    time = 0;

    // oprim inregistrarea audio
    mediaRecorder.stop();

    // oprim inregistrarea textului
    editor.off("change", editorChange)
    editor.off("keyup", editorKeyup)
    
    console.log('stop');
  }
})

