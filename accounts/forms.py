from django.contrib.auth.forms import(
    UserCreationForm,
    UserChangeForm,
    AuthenticationForm
)   
from .models import(
    CustomUser
) 
from django import forms

class CustomUserCreationForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(CustomUserCreationForm, self).__init__(*args, **kwargs)  
        self.fields['email'] = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Email"}))
        self.fields['first_name'] = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Name"}))
        self.fields['last_name'] = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Last Name"}))
        self.fields['password1'] = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder":"Password"}))
        self.fields['password2'] = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder":"Confirm Password"}))

    class Meta:
        model = CustomUser
        fields = ('email', "first_name", "last_name","password1", "password2")

class CustomUserChangeForm(UserChangeForm):

    class Meta:
        model = CustomUser
        fields = ('email',)

class CustomAuthentificationForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={"placeholder":"Email"}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder":"Password"}))