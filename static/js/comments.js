// afisarea comentariilor interactive

async function getComments (){
    const url = window.location.href
    let data = await fetch(url + "comment");
    let comments = await data.json();
    return comments 
};
    
let comments = getComments();

comments.then(function(result) {
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
            </svg>
        `;
        commentButton.style.color = "white";
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
let commentButton = document.getElementById('comment');
let commentMessage = document.getElementById('commentMessage');
let commentInputContainer = document.getElementById('commentInputContainer');

let emojisContainer = document.getElementById('emojis');
    emojisContainer.style.display = "none";

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
    }else{
        emojisContainer.style.display = "none";
    }
});

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

    if (commentInputContainer.style.display == "none"){
        commentInputContainer.style.display = "flex";

    }
    else{
        commentInputContainer.style.display = "none";
        emojisContainer.style.display = "none";
    };

    // if(commentMessage.style.width == '0px'){
    //     commentMessage.style.width = 'initial';
    //     commentMessage.style.display = 'initial';
    //     em
    // }else{
    //     commentMessage.style.width = '0px';
    //     commentMessage.style.display = 'none';
    // }
});