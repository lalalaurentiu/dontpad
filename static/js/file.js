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
};
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
    mode: 'text/x-perl',
    lineNumbers: true,
    keyMap:"sublime",
    theme: 'abbott',
    autoCloseBrackets: true,
    styleSelectedText:true,
});

// marcajul codului
let lineStart , lineEnd 

editor.on('cursorActivity', function (selected) {
    lineStart = selected.getCursor(true).line
    lineEnd = selected.getCursor(false).line
  });

// afisarea versionarii codului
function createVersions(lst, target, code, editor){
    let versionsContainer = document.createElement("div")
        versionsContainer.setAttribute("class", "version")

    let inputContainer = document.createElement("input")
        inputContainer.setAttribute("type", "radio")
        inputContainer.setAttribute("name", "version")
        inputContainer.setAttribute("value", `${code}`)
        inputContainer.setAttribute("checked", "checked")
        inputContainer.setAttribute("id", `version${lst.length + 1}`)

    versionsContainer.appendChild(inputContainer)

    let labelContainer = document.createElement("label")
        labelContainer.setAttribute("for", `version${lst.length + 1}`)
        labelContainer.innerHTML = `V${lst.length + 1}`

    versionsContainer.appendChild(labelContainer)
    target.prepend(versionsContainer)

    this.addEventListener("change", function(e){
        if(e.target.checked){
            editor.setValue(e.target.value);
        } 
    })
}
let versions = [...document.querySelectorAll('input[name="version"]')];
let userVersion = document.querySelectorAll('.version');

versions.forEach(version => {
    version.addEventListener('change', (e) => {
        if(e.target.checked){
            editor.setValue(e.target.value);
        } 
    })
})

userVersion.forEach((element) => {
    let studentVersion = element.querySelector('.studentVersion');
    if (studentVersion.querySelector('input[name="version"]')) {
    element.addEventListener("mousemove", () => {
        let position = element.getBoundingClientRect();
        studentVersion.style.top = position.top + "px";
        studentVersion.style.display = "block";
    });
    element.addEventListener("mouseout", () => {
        studentVersion.style.display = "none";
    });
    }
});
// preluarea valorii din obiectul codemirror si trimiterea catre server

// trimiterea codului catre server de catre profesor
function proffesorSendCode(){
    const url = window.location.href
    const csrftoken = getCookie("csrftoken")
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("X-CSRFToken", csrftoken)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(`code=${editor.getValue()}`)
}

// trimiterea codului catre server de catre student
function studentSendCode(){
    versions.forEach(version => {
        if (version.checked){
            let versionId = version.id.split("version")[1]
            const url = window.location.href
            const csrftoken = getCookie("csrftoken")
            const xhr = new XMLHttpRequest()
            xhr.open("POST", url, true)
            xhr.setRequestHeader("X-CSRFToken", csrftoken)
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
            xhr.send(`versionId=${versionId}&code=${editor.getValue()}`)
        }
    })
}

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
codeMirrorMergeUI(target,historic,original)
differcesContainer.style.display = "none"
differencesButton.addEventListener("click", () =>{
    if (differcesContainer.style.display == "none"){
        differcesContainer.style.display = "initial"
        differencesButton.innerHTML = "Ascunde diferentele"
    }else {
        differcesContainer.style.display = "none"
        differencesButton.innerHTML = "Diferente"
    }
})
//

// schimbare websoket protocol 
let wsProtocol = "ws://"

if (window.location.protocol === "https:"){
    wsProtocol = "wss://" 
}
//

function createUserBanner(obj){
    let userBanner = document.createElement("div")
        userBanner.setAttribute("class", "user-banner")

    let userBannerName = document.createElement("div")
        userBannerName.setAttribute("class", "user-banner-name")
        userBannerName.innerHTML = obj.first_name + " " + obj.last_name

    userBanner.appendChild(userBannerName)
    return userBanner
}

// deschiderea conexiune websoket
let chatRoom = location.pathname.split('/')[1]
let socket = new WebSocket(wsProtocol + window.location.host + "/ws/chat/" + chatRoom + "/");

socket.onmessage = (e) => {
    const data = JSON.parse(e.data)
    // afisarea mesajelor
    if (data.message) {
        let chatLogContainer = document.querySelector('#chat-log')
        let chatMessageContainer = document.createElement("div")
            chatMessageContainer.setAttribute("class", "chat-message-container")

        chatLogContainer.appendChild(chatMessageContainer)
        
        let breakContainer = document.createElement("div")
        let chatMessage = document.createElement("span")
            chatMessage.setAttribute("class", "chat-message")
            chatMessage.innerHTML = "<i></i>" + data.message

        breakContainer.appendChild(chatMessage)
        chatMessageContainer.appendChild(createUserBanner(data.user))
        chatMessageContainer.appendChild(breakContainer)
        
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
        // afisarea versiunilor
        versions.push(createVersions(versions, document.querySelector(".versioning"), data.code, editor))
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
        let chatElements = document.querySelector(".chat-elements")
        
        chatMessage.setAttribute("class", "chat-message")
        breakContainer.appendChild(chatMessage)
        let chatCodeContainer = document.createElement("textarea")
            chatCodeContainer.value = code

        chatMessage.appendChild(chatCodeContainer)
        chatElements.setAttribute("class", "show-chat")
        document.getElementById("chat-log").appendChild(breakContainer)

        setTimeout(() => {
            chatElements.setAttribute("class", "chat-elements")
        }, 10);

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
    
    let doc = editor.getDoc();
    let code = `${doc.getRange({line: lineStart, ch: 0}, {line: lineEnd + 1, ch: 0})}`
    
    socket.send(JSON.stringify({
        "chatCode": {"code":code,
                    "lineStart":lineStart,
                }
    }))
}

// afisarea comentariilor interactive

async function getComments (){
    const url = window.location.href
    let data = await fetch(url + "comment");
    let comments = await data.json();
    return comments 
}
    
let comments = getComments()

let test = document.getElementById("btn")
let button = document.querySelector(".right")
let i = document.getElementById("i")

var scroller = editor.getScrollerElement();
scroller.addEventListener('mousemove', function(e) { // or mousemove
    let isActive
    var pos = editor.coordsChar({left: e.clientX, top: e.clientY}, "window");
    let line = pos.line + 1;
    button.innerHTML = "";

    comments.then(function(result) {
        obj = result
        obj.comments.forEach(function(comment) {
            let commentContainer = document.createElement("div")
                commentContainer.setAttribute("class", "comment-container")

            let commentText = document.createElement("div")
                commentText.setAttribute("class", "comment-text")
                commentText.innerHTML = comment.comment

            commentContainer.appendChild(commentText)

            let commentDate = document.createElement("div")
                commentDate.setAttribute("class", "comment-date")
                commentDate.innerHTML = comment.date

            commentContainer.prepend(commentDate)

            let coommentUser = document.createElement("div")
                coommentUser.setAttribute("class", "comment-user")
                coommentUser.innerHTML = comment.user.first_name + " " + comment.user.last_name
            
            commentContainer.prepend(coommentUser)

            if (comment.line == line){
                let ipos = editor.charCoords({line: line - 1, ch: 0}, "local");
                button.appendChild(commentContainer)
                button.style.display = "initial"
                i.style.display = "initial"
                i.style.top = ipos.top + 10 + "px"
                isActive = true
            }
        });
        if (!isActive){
            button.style.display = "none"
            i.style.display = "none"
        }
    });
}, false);

// trimite comentariul
let commentButton = document.getElementById('comment');
let commentMessage = document.getElementById('commentMessage');

commentButton.addEventListener('click', function(){
    if (commentMessage.value && lineStart + 1){
        const csrftoken = getCookie("csrftoken");
        const url = window.location.href
        fetch(url + "comment/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                "comment": commentMessage.value,
                "line": lineStart + 1,
            })
        })
        commentMessage.value = ""
    }

    if(commentMessage.style.width == '0px'){
        commentMessage.style.width = 'initial';
        commentMessage.style.display = 'initial';
    }else{
        commentMessage.style.width = '0px';
        commentMessage.style.display = 'none';
    }
});

// ---crearea unei imagini din cod sitrimiterii catre server---
let node = document.querySelector('.whatsapp-container');
let share = document.getElementById("share")
let whatsapp_image_container = document.getElementById("whatsapp-image-container")
let image 

let whatsapp_container_btn = document.getElementById("whatsapp-close")
let whatsapp_send_btn = document.getElementById("whatsapp-end-btn")
let buttons = [whatsapp_container_btn, whatsapp_send_btn]

share.onclick = function() {
    node.style.display = "flex"
    
    let textarea = document.createElement("textarea")
    let doc = editor.getDoc();
    let code = `${doc.getRange({line: lineStart, ch: 0}, {line: lineEnd + 1, ch: 0})}`

    textarea.value = code
    whatsapp_image_container.appendChild(textarea)

    createChatCodeMessages(textarea, lineStart + 1)

    let imgNode = document.querySelector('#whatsapp .CodeMirror')
        imgNode.setAttribute("style", "height: 100vh; width: 100vw;position:absolute; top:0; left:0; z-index: -1;")

    htmlToImage.toJpeg(imgNode, { quality: 1, height: imgNode.clientHeight, width: imgNode.clientWidth })

        .then(function (dataUrl) {
            let img = new Image();
            img.id = "img";
            img.src = dataUrl;
            image = img
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });

    setTimeout(function(){
        imgNode.removeAttribute("style")
    }, 10)
}

whatsapp_send_btn.onclick = function() {
    const csrftoken = getCookie("csrftoken");
    const url = window.location.href
    const number = document.getElementById("number").value
    const message = document.getElementById("msg").value
    const name = document.getElementById("name").value

    fetch(image.src)
    .then(res => res.blob())
    .then(blob => {
        let image = new File([blob], "image.jpg", {type: "image/jpg"})
        let formData = new FormData();
            formData.append("image", image);
            formData.append("number", number);
            formData.append("message", message);
            formData.append("name", name);
            
        fetch(url + "whatsapp/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
            },
            body: formData
        })
        .then( () => {
            number.value = ""
            message.value = ""
            name.value = ""
        })
    })
}

buttons.forEach(function(button){
    button.addEventListener("click", function(){
        node.style.display = "none"
        whatsapp_image_container.innerHTML = ""
    })
})

// ----------------------------------