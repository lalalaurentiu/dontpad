from django.shortcuts import render
from .models import *

def new_file(request, slug):
    
    template_name = "file.html"

    file_name = request.path.replace("/", "")

    obj = DontpadURL.objects.get_or_create(slug=file_name)
    print(obj[0].id)

    response = render(request, template_name)
    return response
