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

let modes = {
    "py":{mode:{
            name: "python",
            version: 3,
            singleLineStringErrors: false
        },
        path:"/static/js/mode/python.js",
        ide:"/static/js/console/consolePython.js"},

    "js":{mode:{
            name: "javascript",
            version: 6,
            singleLineStringErrors: false
        },
        path:"/static/js/mode/javascript.js",
        ide:"/static/js/console/consoleJs.js"},

    "html":{mode:"text/html",
        path:"/static/js/mode/html.js",
        ide:"/static/js/console/consoleHtml.js"},

    "css":{mode:"text/x-gss",
            path:"/static/js/mode/css.js"},

}

function createHeaderScript(path){
    let script = document.createElement("script")
    script.src = path
    script.id = "mode"
    document.getElementsByTagName("head")[0].appendChild(script)
}

function createFooterScript(path){
    if (path !== undefined){
        let script = document.createElement("script")
        script.src = path
        script.id = "ide"
        document.getElementsByTagName("body")[0].appendChild(script)
    } else {
        document.querySelector(".run").style.display = "none"
    } 
}

function getExtension(mod) {
    let url = window.location.pathname
    let extension = url.split(".").pop().split("/")[0]
    if (extension === ""){
        return "text"
    }else{
        createHeaderScript(mod[extension].path)
        createFooterScript(mod[extension].ide)
        return mod[extension].mode
    }
}

//functia pentru crearea unui codeMirror in chat
function createChatCodeMessages(target, lineNumber){
    let editor = CodeMirror.fromTextArea(target, {
        lineNumbers: true,
        mode: "text/x-perl",
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
    keyMap:"sublime",
    theme: 'abbott',
    autoCloseBrackets: true,
    styleSelectedText:true,
});
let mode = getExtension(modes);
try {
    document.getElementById("mode").onload = () => {
        editor.setOption("mode", mode)
    };
    document.getElementById("ide").onload = () => {
        runCode(document.querySelector(".run"))
    };
} catch (error) {
    editor.setOption("mode", mode)
    document.querySelector(".run").style.display = "none"
}

// marcajul codului
let lineStart , lineEnd 

editor.on('cursorActivity', function (selected) {
    lineStart = selected.getCursor(true).line
    lineEnd = selected.getCursor(false).line
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
            let parrentNode = version.parentElement.parentElement.parentNode
            let versionId
            if(parrentNode.getAttribute("class") === "version"){
                versionId = parrentNode.children[0].id.split("version")[1]
            } else {
                parrentNode = version.parentElement.children[0]
                versionId = parrentNode.id.split("version")[1]
            }
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
    return diff
}
let differcesContainer = document.querySelector(".modified")
let differencesButton = document.getElementById("differences")
let original = editor.getValue();
let historic = document.getElementById("difference");
let target = document.getElementById("editor2");
let diffEditor = codeMirrorMergeUI(target,historic,original)
differcesContainer.style.display = "none"
differencesButton.addEventListener("click", () =>{
    if (differcesContainer.style.display == "none"){
        differcesContainer.style.display = "initial"
        differencesButton.innerHTML = "Hide Differences"
    }else {
        differcesContainer.style.display = "none"
        differencesButton.innerHTML = "Sow Differences"
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

        let chatContainer = document.querySelector(".chat-container")
        let chatBtn = document.getElementById("messageBtn")
        chatBtn.value = parseInt(chatBtn.value) + 1
        
        if (parseInt(chatBtn.value) > 0 && chatContainer.style.display == "none"){
            chatBtn.removeAttribute("class")
        }
    }
    // afisarea codului
    if (data.code) {
        if (!data.is_professor){
            createUserVersion(data, versions)
        } else {
            editor.setValue(data.code)
            historic.value = data.differnce
            target.innerHTML = ""
            differcesContainer.style.display = "initial"
            codeMirrorMergeUI(document.getElementById("editor2"),document.getElementById("difference"),editor.getValue())
            differcesContainer.style.display = "none"
            // afisarea versiunilor
            versions.push(createVersions(versions, document.querySelector(".versioning"), data.code, editor))
        } 
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
        document.querySelector(".contextMenu").style.display = "none"
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
        }, 100);

        createChatCodeMessages(chatCodeContainer, lineStart + 1)

        chatMessage.onclick = function() {
            editor.setCursor(lineStart, 0)
        }
        chatBtn.value = parseInt(chatBtn.value) + 1
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


try {
    // marcajul codului demo
    let mark = document.getElementById("mark")
    mark.onclick = function() {
        let color = document.getElementById("markColor").value
        socket.send(JSON.stringify({
            "color": color,
            "lineStart": lineStart,
            "lineEnd": lineEnd,
        }));
    };

    document.getElementById("showMarkers").onchange = function() {
        if (this.checked){
            this.parentNode.querySelector(".tooltipText").innerHTML = "Hide Markers"
        } else {
            this.parentNode.querySelector(".tooltipText").innerHTML = "Show Markers"
        }
    };


    // trimiterea codului in chat demo
    let sendCode = document.getElementById("sendChat")
    sendCode.onclick = function() {
        
        let doc = editor.getDoc();
        let code = `${doc.getRange({line: lineStart, ch: 0}, {line: lineEnd + 1, ch: 0})}`
        
        socket.send(JSON.stringify({
            "chatCode": {"code":code,
                        "lineStart":lineStart,
                    }
        }));

        if (document.querySelector(".chat-container").style.display == "none"){
            document.getElementById("messageBtn").click()
        };
    };


    // ---crearea unei imagini din cod sitrimiterii catre server---
    let node = document.querySelector('.whatsapp-container');
    let share = document.getElementById("share")
    let whatsapp_image_container = document.getElementById("whatsapp-image-container")
    let image 

    let whatsapp_container_btn = document.getElementById("whatsapp-close")
    let whatsapp_send_btn = document.getElementById("whatsapp-end-btn")
    let buttons = [whatsapp_container_btn, whatsapp_send_btn]

    share.onclick = function() {
        document.querySelector(".contextMenu").style.display = "none"
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

} catch (error) {}

// ----------------------------------

// Deschiderea chatului

let chatBtn = document.getElementById("messageBtn")
let chatContainer = document.querySelector(".chat-container")

chatBtn.onclick = function() {
    if (chatContainer.style.display == "none"){
        chatContainer.style.display = "initial"
        
        this.setAttribute("class", "no-after")
        this.value = "0"
    } else {
        chatContainer.style.display = "none"
        this.value = "0"
    }
}