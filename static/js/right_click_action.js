let contextMenu = document.querySelector('.contextMenu');
window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    contextMenu.style.display = 'block';
    screenRecorder.style.display = 'none';
    let parent = document.body;

    contextMenu.style.top = event.pageY + 'px';
    contextMenu.style.left = event.pageX + 'px';
    if (contextMenu.getBoundingClientRect().x 
        + contextMenu.getBoundingClientRect().width +
        screenRecorder.getBoundingClientRect().width > 
        parent.getBoundingClientRect().width
        ){
            contextMenu.style.left = event.pageX - contextMenu.getBoundingClientRect().width + 'px';
            screenRecorder.style.left = '-100%';
    } else {
        screenRecorder.style.left = '100%';
    }

    if (contextMenu.getBoundingClientRect().y + 
        contextMenu.getBoundingClientRect().height > 
        parent.getBoundingClientRect().height){
        contextMenu.style.top = event.pageY - contextMenu.getBoundingClientRect().height + 'px';
    }

};

window.onclick = function(event) {
    if (!contextMenu.contains(event.target)) {
        contextMenu.style.display = 'none';
        screenRecorder.style.setProperty('left', '0');
        screenRecorder.style.setProperty('right', '0');
    }
};


function copyToClipboard() {
    let text = editor.getRange( editor.getCursor(true), editor.getCursor(false));
    navigator.clipboard.writeText(text);
    contextMenu.style.display = 'none';
   }

function cutToClipboard() {
    let text = editor.getRange( editor.getCursor(true), editor.getCursor(false));
    navigator.clipboard.writeText(text);
    editor.setValue(editor.getValue().replace(text, ''));
    contextMenu.style.display = 'none';
}

function pasteFromClipboard() {
    navigator.clipboard.readText().then(clipText => {
        editor.replaceSelection(clipText);
        contextMenu.style.display = 'none';
    });
}

function deleteCode(){
    editor.setValue(editor.getValue().replace(editor.getRange( editor.getCursor(true), editor.getCursor(false)), ''));
    contextMenu.style.display = 'none';
}

function undo(){
    editor.undo();
    contextMenu.style.display = 'none';
}

function redo(){
    editor.redo();
    contextMenu.style.display = 'none';
}