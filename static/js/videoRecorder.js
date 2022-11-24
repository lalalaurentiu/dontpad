let start = document.getElementById('start')
let stop  = document.getElementById('stop')
let stream

start.addEventListener('click', recordScreen)

stop.addEventListener('click', function(){
    stream.stream.getTracks().forEach(track => track.stop());
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
    let videoContainer = document.getElementById('screenRecorder');
    let filename = window.prompt('Enter file name')
    let video = document.createElement('video');
    video.width = 400;
    video.height = 300;
    video.controls = true;
    video.src = URL.createObjectURL(blob);
    videoContainer.appendChild(video);
    URL.revokeObjectURL(blob); 
}