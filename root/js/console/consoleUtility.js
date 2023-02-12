let dragItem;
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let body = document.querySelector("body");

document.addEventListener("touchstart", dragStart, false);
document.addEventListener("touchend", dragEnd, false);
document.addEventListener("touchmove", drag, false);

document.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

function dragStart(e) {
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === dragItem) {
    active = true;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;

  active = false;
}

function drag(e) {
  if (active) {
    e.preventDefault();

    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    setTranslate(currentX, currentY, consoleContainer);
  }
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

async function getFiles() {
  let file = window.location.pathname.split("/")[1].split(".")[0];
  let response = await fetch("?file=" + file);
  if (response.status === 200) {
    let data = await response.json();
    return data;
  }
  return false;
}

let files = getFiles();

files.then((data) => {
  if (data) {
    if (window.location.pathname.split("/")[1].split(".")[1] !== "py" && window.location.pathname.split("/")[1].split(".")[1] !== undefined) {
      let pathname = window.location.pathname.split("/")[1].split(".")[0];
      let versionContainer = document.querySelector(".versioning-container");
      let path = document.createElement("div");
      path.setAttribute("class", "path");
      path.innerHTML = "Files:";

      for (key in data) {
        let anchor = document.createElement("a");
        anchor.setAttribute("href", "/" + pathname + "." + key);
        if (key === window.location.pathname.split("/")[1].split(".")[1]) {
          anchor.setAttribute("class", "path-active");
        }
        anchor.innerHTML = pathname + "." + key;
        path.appendChild(anchor);
      }
      versionContainer.appendChild(path);
    }
  }
});
