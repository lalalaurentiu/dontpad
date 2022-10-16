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

def new_file(request, slug):
    
    template_name = "file.html"

    file_name = request.path.replace("/", "")

    obj = DontpadURL.objects.get_or_create(slug=file_name)
    code = DontpadCode.objects.filter(slug_id = obj[0].id).order_by("-id")
    uploadFileForm = UploadFile()
    

    try:
        last_code = code[0]
    except:
        last_code = None

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
                differnce += f"<div class='lineplus'> {line_index} <span>+</span> {letters.replace('+', '')} </div> \n"
            elif letters[0] == "-":
                differnce += f"<div class='lineminus'>{line_index} <span>-</span> {letters.replace('-', '')} </div> \n"
            else:
                differnce += f"<div> {line_index} {letters} </div> \n"
    except:
        differnce = None

    context = {
        "code": last_code,
        "difference":differnce,
        "fileForm":uploadFileForm
        
    }

    if request.method == "POST":
        DontpadCode.objects.create(slug_id=obj[0].id,code = request.POST["code"])
        print(request.POST["code"])
        return HttpResponse(status = 200)

    response = render(request, template_name, context)
    return response

def uploadFile(request, slug):
    if request.method == "POST":
        url = request.path.replace("/upload", "").replace("/", "")
        fileContent = request.FILES['file'].read().decode("utf-8")

        obj = DontpadURL.objects.filter(slug = url)[0].id
        DontpadCode.objects.create(slug_id = obj, code = fileContent)
    return redirect(request.path.replace("/upload", ""))
