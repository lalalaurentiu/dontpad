from pdb import line_prefix
from django.shortcuts import render, HttpResponse
from .models import *

def new_file(request, slug):
    
    template_name = "file.html"

    file_name = request.path.replace("/", "")

    obj = DontpadURL.objects.get_or_create(slug=file_name)
    code = DontpadCode.objects.filter(slug_id = obj[0].id).order_by("-id")
    

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
            if result[line][0] == "+":
                line_index -= 1
                differnce += f"<div class='lineplus'> {line_index} <span>+</span> {result[line].replace('+', '')} </div> \n"
            elif result[line][0] == "-":
                differnce += f"<div class='lineminus'>{line_index} <span>-</span> {result[line].replace('-', '')} </div> \n"
            else:
                differnce += f"<div> {line_index} {result[line]} </div> \n"
    except:
        differnce = None

    context = {
        "code": last_code,
        "difference":differnce
    }

    if request.method == "POST":
        DontpadCode.objects.create(slug_id=obj[0].id,code = request.POST["code"])
        print(request.POST["code"])
        return HttpResponse(status = 200)

    response = render(request, template_name, context)
    return response
