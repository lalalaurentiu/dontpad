function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let sentCode = document.getElementById("send")
let editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'text/x-perl',
});


sentCode.addEventListener("click", () =>{
    const url = window.location.href
    const csrftoken = getCookie("csrftoken")
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("X-CSRFToken", csrftoken)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(`code=${editor.getValue()}`)
    // xhr.onreadystatechange = () => { 
    //     if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    //             location.reload();
    //         }
    //     }
})

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

let chatRoom = location.pathname.split('/')[1]
let socket = new WebSocket("ws://" + window.location.host + "/ws/chat/" + chatRoom + "/");

socket.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data.message) {
        document.querySelector('#chat-log').value += (data.message )
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


