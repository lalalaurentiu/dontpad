from django.shortcuts import render
from .models import CustomUser

def register(request):
    template_name = 'accounts/register.html'
    return render(request, template_name)
