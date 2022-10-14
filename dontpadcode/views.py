from django.shortcuts import render

def new_file(request, slug):
    template_name = "file.html"

    response = render(request, template_name)
    return response
