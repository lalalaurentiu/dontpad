from django.urls import path
from .views import *

app_name = "code"

urlpatterns = [
    path("/upload", uploadFile, name="upload"),
    path("", new_file, name="newfile"),
    
]