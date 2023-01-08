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