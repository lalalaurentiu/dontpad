from django.shortcuts import render, redirect
from .models import CustomUser
from .forms import CustomUserCreationForm

def register(request):
    template_name = 'accounts/register.html'
    form = CustomUserCreationForm()

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('accounts:login')
    else:
        form = CustomUserCreationForm()

    context = {
        'form': form
    }

    return render(request, template_name, context)
