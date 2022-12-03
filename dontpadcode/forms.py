from django import forms
from .models import *

#crearea formularului pentru incarcarea fisierelor
class UploadFile(forms.Form):
    file = forms.FileField()

#crearea formularului pentru crearea exercitiilor
class CreateExercise(forms.ModelForm):
    class Meta:
        model = DontpadExercise
        fields = ['description', 'codeInput', 'hints', 'title']

