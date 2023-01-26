from django.urls import path
from .views import *

app_name = "code"

urlpatterns = [
    path('createExercise/', createExercise, name="createExercise"),
    path('uploadVideo/', uploadVideo, name="uploadVideo"),
    # ruta pentru incarcarea fisierelor
    path("whatsapp/", whatsapp, name="whatsapp"),
    # ruta pentru incarcarea fisierelor
    path("upload", uploadFile, name="upload"),
    # ruta pentru comment
    path("comment/", comment, name="comment"),
    # ruta video V2
    path("PostVideoCode/", postVideoCode, name="PostVideoCode"),
    path("videoCode/<slugVideo>", getVideoCode, name="videoCode"),
    # ruta pentru hints
    path("hint/<id>/", exerciseHint, name="hint"),
    path("submitExercise/<id>/", submitExercise, name="submitExercise"),
    # ruta pentru exercitii
    path("<id>/", viewExercise, name="viewExercise"),
    # ruta pentru un nou path sau unul existent
    path("", new_file, name="newfile"),
]
