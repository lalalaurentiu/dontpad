from django.contrib import admin
from .models import *
from accounts.models import CustomUser

admin.site.register(DontpadURL)
admin.site.register(DontpadCode)
admin.site.register(DontpadComment)
