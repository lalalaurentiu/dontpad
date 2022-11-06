from django.urls import path
from django.contrib.auth.views import LoginView, LogoutView
from .views import register
app_name = "accounts"

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', LoginView.as_view(template_name = "accounts/login.html"), name='login'),
]