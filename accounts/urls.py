from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from .views import register
from .forms import CustomAuthentificationForm

app_name = "accounts"

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', LoginView.as_view(form_class = CustomAuthentificationForm  ,template_name = "accounts/login.html"), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]