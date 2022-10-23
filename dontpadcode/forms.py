from django import forms

#crearea formularului pentru incarcarea fisierelor
class UploadFile(forms.Form):
    file = forms.FileField()