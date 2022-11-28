const csrftoken = getCookie('csrftoken');
const url = window.location.href;

let start = document.getElementById('start')
let stop  = document.getElementById('stop')
let stream

let videoContainer = document.getElementById('videosContainer');

let videoBtn = document.getElementById('videoBtn');
let screenRecorder = document.getElementById('screenRecorder');

function createVideoElement(node ,video, name){
  let videoName= document.createElement('button');
      videoName.value = video;
      videoName.innerHTML = name;

  let playBtn = document.createElement('div');
      playBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
        </svg>
      `;

  videoName.appendChild(playBtn);
  node.appendChild(videoName);
  playVideo(videoName);
}

function playVideo(button){
  button.addEventListener('click', function(){
    videoPlayer.style.display = 'initial';
    video.src = button.value;
    video.controls = true;
  })
}
  

start.addEventListener('click', recordScreen);

stop.addEventListener('click', function(){
    stream.stream.getTracks().forEach(track => track.stop());
    cosole.log('stop')
})

async function recordScreen(){
    const mimeType = 'mp4';
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: 'always',
            displaySurface: 'application',
            logicalSurface: true,
        },
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
            sampleSize: 16,
            channelCount: 2
        }
    });

    const audioStream = await navigator.mediaDevices.getUserMedia({audio: true});

    let tracks = [...displayStream.getTracks(), ...audioStream.getTracks()];

    const Stream = new MediaStream(tracks);

    stream = createRecorder(Stream, mimeType);
}

function createRecorder (stream, mimeType) {
  // the stream data is stored in this array
  let recordedChunks = []; 

  const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (e) {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }  
        };
        mediaRecorder.onstop = function () {
          saveFile(recordedChunks);
          recordedChunks = [];
        };
        mediaRecorder.start(200); 
  return mediaRecorder;
}

function saveFile(recordedChunks){
   const blob = new Blob(recordedChunks, {
      type: 'video/mp4'
    });
     
    let date = new Date();
    let fileName = date.getFullYear() + '-' + 
                  (date.getMonth() + 1) + '-' + 
                  date.getDate() + '-' + 
                  date.getHours() + '-' + 
                  date.getMinutes() + '-' + 
                  date.getSeconds() + '.mp4';
    
    let video = document.createElement('video');
        video.width = 400;
        video.height = 300;
        video.controls = true;
        video.src = URL.createObjectURL(blob);

    URL.revokeObjectURL(blob); 

    fetch(video.src)
    .then(res => res.blob())
    .then(blob => {
        let video = new File([blob], fileName , {type: 'video/mp4'});
        let formData = new FormData();
          formData.append('video', video);
          formData.append('name', fileName);
        fetch(url + 'uploadVideo/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            createVideoElement(videoContainer, data.video, data.name);
        })
    })
}



async function getVideos(){
    let res = await fetch(url + 'uploadVideo/');
    let data = await res.json();
    return data;
}

let getDataVideos = getVideos();

getDataVideos.then(data => {
    let videoContainer = document.getElementById('videosContainer');

    data.videos.forEach(video => {
      createVideoElement(videoContainer, video.video, video.name);
    })
})

let videoPlayer = document.getElementById('videoPlayer');
let video = videoPlayer.querySelector('video');


let videoControls = document.getElementById('videoControls');
let videoClose = videoControls.getElementsByTagName('button')[0];

videoClose.addEventListener('click', function(){
  video.src = '';
  videoPlayer.style.display = 'none';
})


videoBtn.addEventListener('click', function(){
  if (screenRecorder.style.transform == 'translateX(100%)'){
    screenRecorder.style.transform = 'translateX(0%)';
  }else{
    screenRecorder.style.transform = 'translateX(100%)';
  }
})



