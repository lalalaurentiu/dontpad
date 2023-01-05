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

function createUserVersion (obj, lst, ){
    let parrent = document.getElementById(`version${obj.parrentId}`).parentElement
    let studentVersion
    if (parrent.querySelector(".studentVersion")){
        studentVersion = parrent.querySelector(".studentVersion")
    } else {
        studentVersion = document.createElement("div")
        studentVersion.setAttribute("class", "studentVersion")
    }

    let input = document.createElement("input")
        input.setAttribute("type", "radio")
        input.setAttribute("name", "version")
        input.setAttribute("value", `${obj.code}`)
        input.setAttribute("id", `studentVersion${obj.parrentId}`)
        input.setAttribute("style", "margin-bottom:10px;top:-7px;display:block;position:relative;")
        input.setAttribute("checked", "checked")

    let label = document.createElement("label")
        label.setAttribute("for", `studentVersion${obj.parrentId}`)
        
    parrent.addEventListener("mousemove", () => {
        let position = parrent.getBoundingClientRect();
        studentVersion.style.top = position.top + "px";
        studentVersion.style.display = "block";
    });
    parrent.addEventListener("mouseout", () => {
        studentVersion.style.display = "none";
    });
    
    studentVersion.prepend(label)
    studentVersion.prepend(input)
    
    parrent.appendChild(studentVersion)

    lst.push(input)
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

let userVersion = document.querySelectorAll('.version');

versions.forEach(version => {
    version.addEventListener('change', (e) => {
        if(e.target.checked){
            editor.setValue(e.target.value);
        } 
    })
})

userVersion.forEach((element) => {
    try{
        let studentVersion = element.querySelector('.studentVersion');
        let showStudentVersion = element.querySelector('.showStudentVersion');
        // if (studentVersion.querySelector('input[name="version"]')) {
        // element.addEventListener("mousemove", () => {
        //     
        //     studentVersion.style.display = "block";
        // });
        // element.addEventListener("mouseout", () => {
        //     studentVersion.style.display = "none";
        // });
        // }
        showStudentVersion.addEventListener("click", () => {
            
            if (studentVersion.style.display == "none") {
                userVersion.forEach((element) => {
                    try{
                        element.querySelector('.studentVersion').style.display = "none";
                    } catch(e){
                        // console.log(e)
                    }
                })
                let position = showStudentVersion.getBoundingClientRect();
                studentVersion.style.top = position.top - 30 + "px";
                studentVersion.style.left = position.left - 5 + "px";
                studentVersion.style.display = "block";
            } else {
                studentVersion.style.display = "none";
            }
        }
        )

    } catch(e){
        // console.log(e)
    }
    
});

async function getVersions(){
    const url = window.location.href;
    let versions = await fetch(url + '?' + 'versions')
}

getVersions()