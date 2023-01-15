
// afisarea comentariilor interactive

async function getComments (versionid){
    const url = window.location.href
    if (versionid.student){
        versionid = "student=" + versionid.student
    } else {
        versionid = "proffesor=" + versionid.proffesor
    }
    let data = await fetch(url + "comment" + `?${versionid}`);
    let comments = await data.json();
    return comments 
};
    
let comments;
let version;

versions.forEach(function(element){
    if (element.checked){
        
        if(element.id.includes("studentVersion")){
            version = { student : element.id.split("studentVersion")[1]}
        } else {
            version = { proffesor :element.id.split("version")[1]}
        }
        comments = getComments(version);

        comments.then((result) => {
            obj = result;
            let objectCommentsContainer = {};
            obj.comments.forEach(function(comment) {
                if (objectCommentsContainer[comment.line] != undefined){
                    objectCommentsContainer[comment.line] += comment.comment + "<br>";
                }else{
                    objectCommentsContainer[comment.line] = comment.comment + "<br>";
                }
                
            });
            
        
            for (let [key, value] of Object.entries(objectCommentsContainer)){
                let commentContainer = document.createElement("div");
        
                let commentButton = document.createElement("a");
                commentButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                    </svg> <span style="color:#3db92a;opacity:0.5;font-size:16px;">Comentariu</span>
                `;
                commentButton.style.fontSize = "20px";
                commentButton.style.cursor = 'pointer';
                commentButton.style.display = 'block';
        
                commentButton.querySelector("svg").style.transition = "transform 0.3s ease-in-out";
        
                commentContainer.appendChild(commentButton);
            
                let commentTextContainer = document.createElement("div");
                    commentTextContainer.style.display = "none";
                    commentTextContainer.style.paddingLeft = "15px";
                    commentTextContainer.innerHTML = value;
                commentContainer.appendChild(commentTextContainer);
        
                commentButton.addEventListener('click', function(){
                    if (commentTextContainer.style.display == "none"){
                        commentTextContainer.style.display = "block";
                        commentButton.querySelector("svg").style.transform = "rotate(90deg)";
                    }else{
                        commentTextContainer.style.display = "none";
                        commentButton.querySelector("svg").style.transform = "rotate(0deg)";
                    }
                });
                
                editor.addLineWidget(key - 1, commentContainer, {
                    coverGutter: false,
                    noHScroll: true,
                    above: false,
                });
            };
            let commentsContainer = document.querySelectorAll(".CodeMirror-linewidget");
            let showCommentsBtn = document.getElementById('showComments');
            showCommentsBtn.addEventListener("change", function(){
                if (this.checked){
                    this.parentNode.querySelector(".tooltipText").innerHTML = "Ascunde comentariile";
                    commentsContainer.forEach(comment => {
                        comment.style.display = "block";
                    })
                }else{
                    this.parentNode.querySelector(".tooltipText").innerHTML = "Arata comentariile";
                    commentsContainer.forEach(comment => {
                        comment.style.display = "none";
                    })
                }
            })
        });
        
    }

    element.addEventListener('change', function(e){
        if(e.target.checked){
            if(e.target.id.includes("studentVersion")){
                version = { student : e.target.id.split("studentVersion")[1]}
            } else {
                version = { proffesor :e.target.id.split("version")[1]}
            }
            comments = getComments(version);
            comments.then((result) => {
                obj = result;
                let objectCommentsContainer = {};
                obj.comments.forEach(function(comment) {
                    if (objectCommentsContainer[comment.line] != undefined){
                        objectCommentsContainer[comment.line] += comment.comment + "<br>";
                    }else{
                        objectCommentsContainer[comment.line] = comment.comment + "<br>";
                    }
                    
                });
                
            
                for (let [key, value] of Object.entries(objectCommentsContainer)){
                    let commentContainer = document.createElement("div");
            
                    let commentButton = document.createElement("a");
                    commentButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                        </svg> <span style="color:#3db92a;opacity:0.5;font-size:16px;">Comentariu</span>
                    `;
                    commentButton.style.fontSize = "20px";
                    commentButton.style.cursor = 'pointer';
                    commentButton.style.display = 'block';
            
                    commentButton.querySelector("svg").style.transition = "transform 0.3s ease-in-out";
            
                    commentContainer.appendChild(commentButton);
                
                    let commentTextContainer = document.createElement("div");
                        commentTextContainer.style.display = "none";
                        commentTextContainer.style.paddingLeft = "15px";
                        commentTextContainer.innerHTML = value;
                    commentContainer.appendChild(commentTextContainer);
            
                    commentButton.addEventListener('click', function(){
                        if (commentTextContainer.style.display == "none"){
                            commentTextContainer.style.display = "block";
                            commentButton.querySelector("svg").style.transform = "rotate(90deg)";
                        }else{
                            commentTextContainer.style.display = "none";
                            commentButton.querySelector("svg").style.transform = "rotate(0deg)";
                        }
                    });
                    
                    editor.addLineWidget(key - 1, commentContainer, {
                        coverGutter: false,
                        noHScroll: true,
                        above: false,
                    });
                    
                };
                let commentsContainer = document.querySelectorAll(".CodeMirror-linewidget");
                let showCommentsBtn = document.getElementById('showComments');
                if (showCommentsBtn.checked){
                    commentsContainer.forEach(comment => {
                        comment.style.display = "block";
                    })
                }else{
                    commentsContainer.forEach(comment => {
                        comment.style.display = "none";
                    })
                }
                showCommentsBtn.addEventListener("change", function(){
                    if (this.checked){
                        commentsContainer.forEach(comment => {
                            comment.style.display = "block";
                        })
                    }else{
                        commentsContainer.forEach(comment => {
                            comment.style.display = "none";
                        })
                    }
                });
            });
        } 
    })
});



// trimite comentariul

let emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹",
    "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗",
    "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓",
    "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕",
    "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😮‍💨",
    "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨",
    "😰", "😥", "😓", "🫣", "🤗", "🫡", "🤔", "🫢", "🤭", "🤫",
    "🤥", "😶", "😶‍🌫️", "😐", "😑", "😬", "🫠", "🙄", "😯", "😦",
    "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "😵‍💫", "🫥",
    "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠",
    "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽",
    "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀",
    "😿", "😾", "🙈", "🙉", "🙊", "💋", "💌", "💘", "💝", "💖",
    "💗", "💓", "💞", "💕", "💟", "❣️", "💔", "❤️", "🧡", "💛",
    "💚", "💙", "💜", "🤎", "🖤", "🤍", "💯", "💢", "💥", "💫",
    "💦", "💨", "🕳️", "💣", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤",
]

let gifs = [
    "https://media.tenor.com/2nKSTDDekOgAAAAM/coding-kira.gif",
    "https://media.tenor.com/GfSX-u7VGM4AAAAM/coding.gif",
    "https://media.tenor.com/7Tu-pBzg0_kAAAAM/programming.gif",
    "https://media.tenor.com/ggIWe4jxVrUAAAAM/computer-program-program.gif",
    "https://media.tenor.com/hmDMrE1yMAkAAAAM/when-the-coding-when-the.gif",
    "https://media.tenor.com/tZ2Xd8LqAnMAAAAM/typing-fast.gif",
    "https://media.tenor.com/gTg8ZSZMR6YAAAAM/scaler-create-impact.gif",
    "https://media.tenor.com/41I-iMyClCgAAAAM/programmer-programming.gif",
    "https://media.tenor.com/uYP_Nkq8VPsAAAAM/coding-hello-world.gif",
    "https://media.tenor.com/46Z0icVkLYgAAAAM/coding-is-tough-coding.gif",
    "https://media.tenor.com/_DOBjnGspYAAAAAM/code-coding.gif",
    "https://media.tenor.com/77IymeWcaBgAAAAM/coding-programming.gif",
    "https://media.tenor.com/i3lImBg2UEQAAAAM/scaler-create-impact.gif",
    "https://media.tenor.com/zNZjeqK_FxwAAAAM/code-works-code-not-working.gif",
    "https://media.tenor.com/IVCnKbtTeRQAAAAM/programming-computer.gif",
    "https://tenor.com/assets/img/gif-maker-entrypoints/search-entrypoint-optimized.gif",
    "https://media.tenor.com/VpZ2Nf5gdRYAAAAM/pc-banging.gif",
    "https://media.tenor.com/bQCHJwgCNuMAAAAM/kitten-cat.gif",
    "https://media.tenor.com/MYOUqnV-uGMAAAAM/scaler-create-impact.gif",
    "https://media.tenor.com/lYJUdIQn1IEAAAAM/stackoverflow-programming.gif",
    "https://media.tenor.com/4Spqr1waLjIAAAAM/coding-humor.gif",

]
let commentButton = document.getElementById('comment');
let commentMessage = document.getElementById('commentMessage');
let commentInputContainer = document.getElementById('commentInputContainer');
let sendCommentBtn = document.getElementById('sendComment');

let emojisContainer = document.getElementById('emojis');
    emojisContainer.style.display = "none";

let gifsContainer = document.getElementById('gifs');

gifs.forEach(gif => {
    let img = document.createElement('img');
    img.src = gif;
    img.classList.add('gif');
    gifsContainer.appendChild(img);

    img.addEventListener('click', function(){
        if (lineStart + 1){
            let versionId;
            if (version.student){
                versionId = {student:version.student}
            }else{
                versionId = {proffesor:version.proffesor};
            }
            const csrftoken = getCookie("csrftoken");
            const url = window.location.href
            fetch(url + "comment/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify({
                    "comment": `<img src="${gif}" class="gif">`,
                    "line": lineStart + 1,
                    "version": versionId,
                })
            })
            .then(result => {
                if (result.status == 201){
                    commentInputContainer.style.display = "none";
                    emojisContainer.style.display = "none";
                    gifsContainer.style.display = "none";
                    window.location.reload();
                }
            });
        }
    });
        
})

let gifButton = document.getElementById('gifButton');
gifButton.addEventListener('click', function(){
    if (gifsContainer.style.display == "none"){
        gifsContainer.style.display = "block";
        emojisContainer.style.display = "none";
    }else{
        gifsContainer.style.display = "none";
    }
});

emojis.forEach(emoji => {
    emojisContainer.innerHTML += `<span class="emoji">${emoji}</span>`;
});

emojisContainer.querySelectorAll('.emoji').forEach(emoji => {
    emoji.addEventListener('click', function(){
        commentMessage.value += emoji.innerHTML;
    })
})

let emojiButton = document.getElementById('emojiButton');
emojiButton.addEventListener('click', function(){
    if (emojisContainer.style.display == "none"){
        emojisContainer.style.display = "block";
        gifsContainer.style.display = "none";
    }else{
        emojisContainer.style.display = "none";
    }
});

commentButton.addEventListener('click', function(){
    if (commentInputContainer.style.display == "none"){
        commentInputContainer.style.display = "flex";
        editor.addLineWidget(lineStart, document.querySelector(".commentContainer"), {
            coverGutter: false,
            noHScroll: true,
            above: false,
            className: "before-line",
        });
        document.querySelector('.contextMenu').style.display = "none";
    }
    else{
        commentInputContainer.style.display = "none";
        emojisContainer.style.display = "none";
        editor.removeLineWidget(lineStart, commentInputContainer);
    };
});

sendCommentBtn.addEventListener('click', function(){
    if (commentMessage.value){
        let versionId;
        if (version.student){
            versionId = {student:version.student}
        }else{
            versionId = {proffesor:version.proffesor};
        }
        const csrftoken = getCookie("csrftoken");
        const url = window.location.href
        fetch(url + "comment/" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
                "comment": commentMessage.value,
                "line": editor.getCursor().line + 1,
                "version": versionId,
            })
        })
        .then(result => {
            if (result.status == 201){
                commentInputContainer.style.display = "none";
                emojisContainer.style.display = "none";
                gifsContainer.style.display = "none";
                commentMessage.value = "";
                window.location.reload();
            }
        });
    } else {
        commentInputContainer.style.display = "none";
        emojisContainer.style.display = "none";
        gifsContainer.style.display = "none";
    }
});