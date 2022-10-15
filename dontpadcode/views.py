from django.shortcuts import render
from .models import *

def new_file(request, slug):
    
    template_name = "file.html"

    file_name = request.path.replace("/", "")

    obj = DontpadURL.objects.get_or_create(slug=file_name)
    code = DontpadCode.objects.filter(slug_id = obj[0].id).order_by("-id")
    

    try:
        code = code[0]
    except:
        code = None
    context = {
        "code": code
    }

    if request.method == "POST":
        DontpadCode.objects.create(slug_id=obj[0].id,code = request.POST["code"])
        print(request.POST["code"])

    response = render(request, template_name, context)
    return response
