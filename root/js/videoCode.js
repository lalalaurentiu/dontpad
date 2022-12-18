let intervals = [];
// funtia de scriere a textului
function textWrite(txt, cm, speed,fromLine, fromCh , toLine, toCh) {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            cm.replaceRange(txt , {line: fromLine, ch:fromCh}, {line: toLine, ch:toCh});
            clearInterval(interval);
                resolve();
        }, speed);
        
        intervals.push(interval);
        
    });
};

async function writeText(txtList, cm, speed ,fromLine, fromCh , toLine, toCh) {
    for (let i = 0; i < txtList.length; i++) {
        await textWrite(txtList[i], cm, speed, fromLine, fromCh , toLine, toCh);
    }
};
// ------------------------------

let url = window.location.href;
// functia de preluare a datelor din baza de date
async function getData(url) {
    let response = await fetch(url + '?format=json');
    let data = await response.json();
    return JSON.parse(data);
}

let dataVideo = getData(url);

// 
let editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: 'text/x-perl',
    lineNumbers: true,
    keyMap:"sublime",
    theme: 'abbott',
    autoCloseBrackets: true,
    styleSelectedText:true,
});
// 
let audio = document.querySelector('audio');
// functia pentru play
audio.addEventListener("play", function() {
    console.log("play");
    if (intervals.length > 0 ) {
        let currentTime = parseInt(audio.currentTime * 1000);
        dataVideo.then(dataVideo => {
            dataVideo.forEach((item, i) => {
                if (item.time * 100 > currentTime + 200) {
                    writeText(item.text, editor, item.time * 100 - currentTime , item.from.line, item.from.ch , item.to.line, item.to.ch);
                    console.log("play mode ", item.time * 100 - currentTime);
                    
                }
            });
        });
            
    } else {
        dataVideo.then(dataVideo => {
            dataVideo.forEach((item, i) => { 
               writeText(item.text, editor, item.time * 100, item.from.line, item.from.ch , item.to.line, item.to.ch);
            });
        });
    }
    
});
// functia pentru pauza
audio.addEventListener("pause", function() {
    console.log("pause");
    intervals.forEach((item, i) => {
        clearInterval(item);
    }
    );
});

// functia pentru derulare 
audio.addEventListener("seeked", function() {
    console.log("seeked");
    editor.setValue('');
    let currentTime = parseInt(audio.currentTime * 1000);
    let words = "";
    dataVideo.then(dataVideo => {
        dataVideo.forEach((item, i) => {
            if (item.time * 100 < currentTime + 200) {
                words += item.text;
                editor.setValue(words);   
            }
        });
    });
});


// functia pentru stop
audio.addEventListener("ended", function() {
    console.log("ended");
    editor.setValue('');
});