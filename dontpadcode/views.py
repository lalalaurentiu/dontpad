from django.shortcuts import render
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
        for line in range(len(result)):
            print(result[line][0])
            if result[line][0] == "+":
                differnce += f"<div class='lineplus'> <span>+</span> {result[line].replace('+', '')} </div> \n"
            elif result[line][0] == "-":
                differnce += f"<div class='lineminus'> <span>-</span> {result[line].replace('-', '')} </div> \n"
    except:
        differnce = None

    context = {
        "code": last_code,
        "difference":differnce
    }

    if request.method == "POST":
        DontpadCode.objects.create(slug_id=obj[0].id,code = request.POST["code"])
        print(request.POST["code"])

    response = render(request, template_name, context)
    return response
