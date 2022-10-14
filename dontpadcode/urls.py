from django.urls import path
from .views import *

app_name = "code"

urlpatterns = [
    path("<str:slug>", new_file, name="newfile")
]