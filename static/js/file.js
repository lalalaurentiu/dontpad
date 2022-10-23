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

// schimbarea textarea intr-un obiect codemirror
let sentCode = document.getElementById("send")
let editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'text/x-perl',
});
//

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
let differcesContainer = document.querySelector(".modified")
let differencesButton = document.getElementById("differences")

differencesButton.addEventListener("click", () =>{
    let editor = document.querySelector(".editor")
    if (differcesContainer.style.display == "none"){
        editor.style.width = "50%"
        differcesContainer.style.display = "initial"
        differencesButton.innerHTML = "Hide differences"
    }else {
        editor.style.width = "100%"
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
    if (data.message) {
        document.querySelector('#chat-log').value += (data.message + "\n")
    }
    if (data.code) {
        editor.setValue(data.code)
        differcesContainer.innerHTML = data.differnce
    }
}

socket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
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

