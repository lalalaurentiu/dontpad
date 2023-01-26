let contextMenu = document.querySelector(".contextMenu");
window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  contextMenu.style.display = "block";

  try {
    screenRecorder.style.display = "none";
    cmVideoContainer.style.display = "none";
  } catch (e) {}

  let parent = document.body;

  contextMenu.style.top = event.pageY + "px";
  contextMenu.style.left = event.pageX + "px";
  if (
    contextMenu.getBoundingClientRect().x +
      contextMenu.getBoundingClientRect().width +
      220 >
    parent.getBoundingClientRect().width
  ) {
    contextMenu.style.left =
      event.pageX - contextMenu.getBoundingClientRect().width + "px";
    try {
      screenRecorder.style.left = "-100%";
      cmVideoContainer.style.left = "-100%";
    } catch (e) {}
  } else {
    try {
      screenRecorder.style.left = "100%";
      cmVideoContainer.style.left = "100%";
    } catch (e) {}
  }

  if (
    contextMenu.getBoundingClientRect().y +
      contextMenu.getBoundingClientRect().height >
    parent.getBoundingClientRect().height
  ) {
    contextMenu.style.top =
      event.pageY - contextMenu.getBoundingClientRect().height + "px";
  }
};

window.onclick = function (event) {
  if (!contextMenu.contains(event.target)) {
    contextMenu.style.display = "none";
    try {
      screenRecorder.style.setProperty("left", "0");
      screenRecorder.style.setProperty("right", "0");
    } catch (e) {}
  }
};

function copyToClipboard() {
  let text = editor.getRange(editor.getCursor(true), editor.getCursor(false));
  navigator.clipboard.writeText(text);
  contextMenu.style.display = "none";
}

function cutToClipboard() {
  let text = editor.getRange(editor.getCursor(true), editor.getCursor(false));
  navigator.clipboard.writeText(text);
  editor.setValue(editor.getValue().replace(text, ""));
  contextMenu.style.display = "none";
}

function pasteFromClipboard() {
  navigator.clipboard.readText().then((clipText) => {
    editor.replaceSelection(clipText);
    contextMenu.style.display = "none";
  });
}

function deleteCode() {
  editor.setValue(
    editor
      .getValue()
      .replace(
        editor.getRange(editor.getCursor(true), editor.getCursor(false)),
        ""
      )
  );
  contextMenu.style.display = "none";
}

function undo() {
  editor.undo();
  contextMenu.style.display = "none";
}

function redo() {
  editor.redo();
  contextMenu.style.display = "none";
}
