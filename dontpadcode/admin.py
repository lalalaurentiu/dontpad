from django.contrib import admin
from .models import *
from accounts.models import CustomUser

admin.site.register(DontpadURL)
admin.site.register(DontpadCode)
admin.site.register(DontpadComment)
admin.site.register(DontpadImage)
admin.site.register(DontpadVideo)
admin.site.register(DontpadUserCode)
admin.site.register(DontpadExercise)
admin.site.register(DontpadExerciseResult)
admin.site.register(DontpadVideoCode)