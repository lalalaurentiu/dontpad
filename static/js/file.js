function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

let sentCode = document.getElementById("send")
let editor = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'text/x-perl',
});


sentCode.addEventListener("click", () =>{
    const url = window.location.href
    const csrftoken = getCookie("csrftoken")
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader("X-CSRFToken", csrftoken)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.send(`code=${editor.getValue()}`)
    xhr.onreadystatechange = () => { 
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                location.reload();
            }
        }
})

let differcesContainer = document.querySelector(".modified")
let differencesButton = document.getElementById("differences")

differencesButton.addEventListener("click", () =>{
    let editor = document.querySelector(".editor")
    if (differcesContainer.style.display == "none"){
        editor.style.width = "50%"
        differcesContainer.style.display = "initial"
        differencesButton.innerHTML = "Hide differences"
    }else {
        editor.style.width = "100%"
        differcesContainer.style.display = "none"
        differencesButton.innerHTML = "Show differences"
    }
})
console.log(differcesContainer.style.display)


