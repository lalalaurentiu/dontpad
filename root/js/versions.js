// afisarea versionarii codului
let versionIcon = `
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 640 512"
        width="20"
        fill="currentColor" >
            <path 
                d="M320 336c44.2 0 80-35.8 80-80s-35.8-80-80-80s-80 
                35.8-80 80s35.8 80 80 80zm156.8-48C462 361 397.4 
                416 320 416s-142-55-156.8-128H32c-17.7 
                0-32-14.3-32-32s14.3-32 32-32H163.2C178 151 242.6 96 
                320 96s142 55 156.8 128H608c17.7 0 32 14.3 32 32s-14.3 
                32-32 32H476.8z"/>
    </svg>
`;

let buttonVersionIcon = `
<svg width="14" 
        height="16" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        version="1.1" 
        id="Layer_1" 
        x="0px" 
        y="0px" 
        viewBox="0 0 331 512" 
        xml:space="preserve">
        <path d="M124.8,2.1C133.4,5.9,139,14.5,139,24v40h16c70.7,0,
                128,57.3,128,128v166.7c28.3,12.3,48,40.5,48,73.3c0,44.2-35.8,80-80,80  
                s-80-35.8-80-80c0-32.8,19.7-61,48-73.3V192c0-35.3-28.7-64-64-64h-16v40c0,
                9.5-5.6,18.1-14.2,21.9s-18.8,2.3-25.8-4.1l-80-72  
                c-5.1-4.6-7.9-11-7.9-17.8S14,82.7,19,78.2l80-72C106-0.1,116.2-1.7,
                124.8,2.1L124.8,2.1z M251,456c13.3,0,24-10.7,24-24  
                s-10.7-24-24-24s-24,10.7-24,24S237.7,456,251,456z"/>
</svg>
`;

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
        labelContainer.innerHTML = versionIcon

    let versionNumber = document.querySelectorAll(".version")

    let versionNumberContainer = document.createElement("span")
        versionNumberContainer.innerHTML = `V${versionNumber.length + 1}`

    versionsContainer.appendChild(labelContainer)
    versionsContainer.appendChild(versionNumberContainer)
    target.prepend(versionsContainer)

    this.addEventListener("change", function(e){
        if(e.target.checked){
            editor.setValue(e.target.value);
        } 
    })
}

function createUserVersion (obj, lst, ){
    let parrent = document.getElementById(`version${obj.parrentId}`).parentElement
    console.log(obj)
    let studentVersion
    if (parrent.querySelector(".studentVersion")){
        studentVersion = parrent.querySelector(".studentVersion");
    } else {
        studentVersion = document.createElement("div")
        studentVersion.setAttribute("class", "studentVersion")
        studentVersion.setAttribute("style", "display:none;")
        let showStudentVersion = document.createElement("button")
        showStudentVersion.setAttribute("class", "showStudentVersion")
        showStudentVersion.innerHTML = buttonVersionIcon
        parrent.appendChild(showStudentVersion)
        parrent.appendChild(studentVersion)
    }
    let studentVersionContainer = document.createElement("div")
        studentVersionContainer.setAttribute("class", "tooltip")
        studentVersionContainer.setAttribute("style", "left:10px;")
    let input = document.createElement("input")
        input.setAttribute("type", "radio")
        input.setAttribute("name", "version")
        input.setAttribute("value", `${obj.code}`)
        input.setAttribute("id", `studentVersion${obj.elementId}`)
        input.setAttribute("checked", "checked")

    let label = document.createElement("label")
        label.setAttribute("for", `studentVersion${obj.elementId}`)
        label.innerHTML = versionIcon

    let user = document.createElement("span")
        user.setAttribute("class", "tooltipText")
        user.innerHTML = obj.user
    
    studentVersionContainer.prepend(label)
    studentVersionContainer.prepend(input)
    studentVersionContainer.append(user)
    studentVersion.prepend(studentVersionContainer)
    lst.push(input)
    reload()
}

let versions = [...document.querySelectorAll('input[name="version"]')];
versions.push = function(){
    Array.prototype.push.apply(this, arguments);
    arguments[0].addEventListener("change", function(e){
        if(e.target.checked){
            editor.setValue(e.target.value);
        }
    })
}

versions.forEach(version => {
    version.addEventListener('change', (e) => {
        if(e.target.checked){
            editor.setValue(e.target.value);
        } 
    })
});

let reload = () => {
    let userVersion = document.querySelectorAll('.version');  
    userVersion.forEach((element) => {

        try{
            let studentVersion = element.querySelector('.studentVersion');
            let showStudentVersion = element.querySelector('.showStudentVersion');
            showStudentVersion.replaceWith(showStudentVersion.cloneNode(true));
            showStudentVersion = element.querySelector('.showStudentVersion');
            showStudentVersion.addEventListener("click", () => {
                console.log("reload")
                if (studentVersion.style.display == "none") {
                    userVersion.forEach((element) => {
                        try{
                            element.querySelector('.studentVersion').style.display = "none";
                            element.querySelector('.showStudentVersion').style.display = "none";
                        } catch(e){
                            // console.log(e)
                        }
                    })
                    showStudentVersion.removeAttribute("style");
                    let position = showStudentVersion.getBoundingClientRect();
                    studentVersion.style.top = position.top - 30 + "px";
                    studentVersion.style.left = position.left - 5 + "px";
                    studentVersion.style.display = "block";
                } else {
                    studentVersion.style.display = "none";
                    userVersion.forEach((element) => {
                        try{
                            element.querySelector('.showStudentVersion').removeAttribute("style");
                        } catch(e){
                            // console.log(e)
                        }
                    })
                }
            })
        } catch(e){
            // console.log(e)
        }
        
    });
};

reload()