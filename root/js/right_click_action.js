let contextMenu = document.querySelector('.contextMenu');
window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    contextMenu.style.display = 'block';
    contextMenu.style.top = event.pageY + 'px';
    contextMenu.style.left = event.pageX + 'px';
    
};

window.onclick = function(event) {
    if (!contextMenu.contains(event.target)) {
        contextMenu.style.display = 'none';
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