from django.shortcuts import render, HttpResponse, redirect
from .models import *
from .forms import *


CHARACTERS ={
    " ":"&nbsp;",
    "<":"&lt;",
    ">":"&gt;",
    "&":"&amp;",
    "\\t":"&nbsp; &nbsp; &nbsp; &nbsp;"
}

# view-ul pentru o noua ruta
def new_file(request, slug):
    
    template_name = "file.html"

    #luam pathul si-l verificam in baza de date 
    #verificam in baza de date daca exista
    #daca exista il returnam 
    #daca nu exista cream unul
    file_name = request.path.replace("/", "")
    obj = DontpadURL.objects.get_or_create(slug=file_name)

    #verificam daca exista code in baza de date pentru acel path
    code = DontpadCode.objects.filter(slug_id = obj[0].id).order_by("-id")

    #formularul pentru incarcarea de fisiere
    uploadFileForm = UploadFile()

    #daca exista code pentru acel path il returnam pe ultimul
    try:
        last_code = code[0]
    except:
        last_code = None

    #metoda prin care vedem diferentele dintre coduri
    try:
        modified_code = code[1]
        from difflib import Differ
        d = Differ()
        result = list(d.compare(modified_code.code.splitlines(), last_code.code.splitlines()))

        differnce = ''
        line_index = 0
        
        for line in range(len(result)):
            line_index += 1
            letters = ""
            
            for letter in result[line]:
                try:
                    letters += CHARACTERS[letter]
                except KeyError:
                    letters += letter

            if letters[0] == "+":
                line_index -= 1
                differnce += f"<code class='lineplus'> {line_index} <span>+</span> {letters.replace('+', '')} </code> \n"
            elif letters[0] == "-":
                differnce += f"<code class='lineminus'>{line_index} <span>-</span> {letters.replace('-', '')} </code> \n"
            else:
                differnce += f"<code> {line_index} {letters} </code> \n"
    except:
        differnce = None

    context = {
        "code": last_code,
        "difference":differnce,
        "fileForm":uploadFileForm
        
    }

    #metoda prin care salvam un nou code
    if request.method == "POST":
        DontpadCode.objects.create(slug_id=obj[0].id,code = request.POST["code"])
        return HttpResponse(status = 200)

    response = render(request, template_name, context)
    return response

#view-ul pentru incarcarea fisierelor
def uploadFile(request, slug):
    if request.method == "POST":
        url = request.path.replace("/upload", "").replace("/", "")
        #citim din fisier
        fileContent = request.FILES['file'].read().decode("utf-8")

        #il salvam in baza de date 
        obj = DontpadURL.objects.filter(slug = url)[0].id
        DontpadCode.objects.create(slug_id = obj, code = fileContent)
    return redirect(request.path.replace("/upload", ""))
