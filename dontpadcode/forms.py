from django import forms
from django import forms

class UploadFile(forms.Form):
    file = forms.FileField()