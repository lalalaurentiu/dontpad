function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};
function timer(time, button){
    let interval = setInterval(() => {
        if(time > 0){
            minutes = Math.floor(time / 60);
            seconds = time % 60;
            button.innerHTML = `Hint in ${minutes}:${seconds}`;
            time--;

        }else{
            button.innerHTML = `Hint`;
            button.disabled = false;
            button.addEventListener('click', () => {
                exerciseId = window.location.pathname.split("/")[2];
                code = window.location.pathname.split("/")[1];
                fetch(`/${code}/hint/${exerciseId}/`)
                    .then(response => response.json())
                    .then(data => {
                        alert(data.hint);
                    })
            });
            clearInterval(interval);
        }
    }, 1000);
}
let code = CodeMirror(document.getElementById("code"), {
    value: document.getElementById('code').getAttribute('aria-valuetext'),
    mode: "text/x-perl",
    theme: "abbott",
    lineNumbers: true,
    readOnly: true
});
let answer = CodeMirror.fromTextArea(document.getElementById("answer"), {
    mode: "text/x-perl",
    theme: "abbott",
    lineNumbers: true
});

if (!answer.getValue() != ""){
    console.log(answer.getValue());
    document.getElementById("submit").addEventListener("click", () => {
    let answerValue = answer.getValue();
    let exerciseId = window.location.pathname.split("/")[2];
    let code = window.location.pathname.split("/")[1];
    let url = `/${code}/submitExercise/${exerciseId}/`;
    let data = {
        answer: answerValue,
    };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if(data.status == "success" || data.status == "error"){
            alert(data.message);
        }
        else{
            alert("Raspunsul nu a fost trimis cu succes!");
        }
    })
    .catch(error => {
        console.log(error);
    });
});
} else {
    document.getElementById("submit").disabled = true;
    document.getElementById("submit").innerHTML = "Rezolvat";
}


timer(60*5, document.getElementById("hint"));
