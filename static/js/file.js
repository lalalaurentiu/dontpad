// functia pentru prealuarea csrf_token din cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
//

//functia pentru crearea unui codeMirror in chat
function createChatCodeMessages(target, lineNumber){
    let editor = CodeMirror.fromTextArea(target, {
        lineNumbers: true,
        mode: 'text/x-perl',
        theme: 'abbott',
        keyMap:"sublime",
        autoCloseBrackets: true,
        styleSelectedText:true,
        firstLineNumber:lineNumber,
        readOnly:true,
    })
}

// schimbarea textarea intr-un obiect codemirror
let sentCode = document.getElementById("send")
let editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'text/x-perl',
    theme: 'abbott',
    keyMap:"sublime",
    autoCloseBrackets: true,
    styleSelectedText:true,
});

// marcajul codului demo
let lineStart , lineEnd 

editor.on('cursorActivity', function (selected) {
    lineStart = selected.getCursor(true).line
    lineEnd = selected.getCursor(false).line
  });

// afisarea versionarii codului
let versions = document.querySelectorAll('input[name="version"]');
versions.forEach(version => {
    version.addEventListener('change', (e) => {
        console.log(e.target.checked);
        if(e.target.checked){
            editor.setValue(e.target.value);
        } 
    })
})
// preluarea valorii din obiectul codemirror si trimiterea catre server
sentCode.addEventListener("click", () =>{
    const url = window.location.href
    const csrftoken = getCookie("csrftoken")
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("X-CSRFToken", csrftoken)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(`code=${editor.getValue()}`)
})
//

// afisarea si ascunderea diferentelor din cod
function codeMirrorMergeUI(target,historic,original){
    diff = CodeMirror.MergeView(
        target, {
            value: historic.value,
            origLeft: original,
            lineNumbers: true,
            mode: "text/x-perl",
            highlightDifferences: true,
            showDifferences: true,
            lineWrapping : true,
            revertButtons : false,
            collapseIdentical: true,
            theme: 'abbott',
            readOnly:true,
            });
}
let differcesContainer = document.querySelector(".modified")
let differencesButton = document.getElementById("differences")
let original = editor.getValue();
let historic = document.getElementById("difference");
let target = document.getElementById("editor2");
console.log(target)
codeMirrorMergeUI(target,historic,original)
differcesContainer.style.display = "none"
differencesButton.addEventListener("click", () =>{
    if (differcesContainer.style.display == "none"){
        differcesContainer.style.display = "initial"
        differencesButton.innerHTML = "Hide differences"
    }else {
        differcesContainer.style.display = "none"
        differencesButton.innerHTML = "Show differences"
    }
})
//

// schimbare websoket protocol 
let wsProtocol = "ws://"

if (window.location.protocol === "https:"){
    wsProtocol = "wss://" 
}
//

// deschiderea conexiune websoket
let chatRoom = location.pathname.split('/')[1]
let socket = new WebSocket(wsProtocol + window.location.host + "/ws/chat/" + chatRoom + "/");

socket.onmessage = (e) => {
    const data = JSON.parse(e.data)
    // afisarea mesajelor
    if (data.message) {
        let chatLogContainer = document.querySelector('#chat-log')
        let breakContainer = document.createElement("div")
        let chatMessage = document.createElement("span")
        chatMessage.setAttribute("class", "chat-message")
        chatMessage.innerHTML = data.message
        breakContainer.appendChild(chatMessage)
        chatLogContainer.appendChild(breakContainer)
        document.getElementById('chat').scrollTop = 9999999;
    }
    // afisarea codului
    if (data.code) {
        editor.setValue(data.code)
        historic.value = data.differnce
        target.innerHTML = ""
        differcesContainer.style.display = "initial"
        codeMirrorMergeUI(document.getElementById("editor2"),document.getElementById("difference"),editor.getValue())
        differcesContainer.style.display = "none"
    }
    // afisarea markarii codului
    if ( data.color && data.lineStart.toString() && data.lineEnd.toString() && document.getElementById("showMarkers").checked){
        let color = data.color
        let lineStart = data.lineStart
        let lineEnd = data.lineEnd
        let doc = editor.getDoc();
        let from = {line: lineStart, ch: 0};
        let to = {line: lineEnd + 1, ch: 0};
        let mark = doc.markText(from, to, {css: `color: ${color};`});
    }
    // afisarea codului in chat
    if (data.chatCode && data.lineStart.toString()){
       
        let code = data.chatCode
        let lineStart = data.lineStart
        let breakContainer = document.createElement("div")
        let chatMessage = document.createElement("div")
        chatMessage.setAttribute("class", "chat-message")
        breakContainer.appendChild(chatMessage)
        let chatCodeContainer = document.createElement("textarea")
        chatCodeContainer.value = code
        chatMessage.appendChild(chatCodeContainer)
        
        document.getElementById("chat-log").appendChild(breakContainer)
        createChatCodeMessages(chatCodeContainer, lineStart + 1)
        chatMessage.onclick = function() {
            editor.setCursor(lineStart, 0)
        }
    }
}

socket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function(e) {
    const messageInputDom = document.querySelector('#chat-message-input');
    const message = messageInputDom.value;
    socket.send(JSON.stringify({
        'message': message
    }));
    messageInputDom.value = '';
};
//

// marcajul codului demo
let mark = document.getElementById("mark")
mark.onclick = function() {
    let color = document.getElementById("markColor").value
    socket.send(JSON.stringify({
        "color": color,
        "lineStart": lineStart,
        "lineEnd": lineEnd,
    }))
}

// trimiterea codului in chat demo


let sendCode = document.getElementById("sendChat")
sendCode.onclick = function() {
    
    var doc = editor.getDoc();
    let code = `${doc.getRange({line: lineStart, ch: 0}, {line: lineEnd + 1, ch: 0})}`
    
    socket.send(JSON.stringify({
        "chatCode": {"code":code,
                    "lineStart":lineStart,
                }
    }))
}
