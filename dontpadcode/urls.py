from django.urls import path
from .views import *

app_name = "code"

urlpatterns = [
    path('uploadVideo/', uploadVideo, name = "uploadVideo"),
    #ruta pentru incarcarea fisierelor
    path("whatsapp/", whatsapp, name="whatsapp"),
    #ruta pentru incarcarea fisierelor
    path("upload", uploadFile, name="upload"),
    #ruta pentru comment
    path("comment/", comment, name="comment"),
    #ruta pentru un nou path sau unul existent
    path("", new_file, name="newfile"),
    
]