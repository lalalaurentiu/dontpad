from django.db import models
from accounts.models import CustomUser

#Modelul pentru noul proiect
class DontpadURL(models.Model):
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.slug
        
#Modelul pentru code
class DontpadCode(models.Model):
    slug = models.ForeignKey(DontpadURL, on_delete = models.CASCADE, related_name = "url")
    code = models.TextField()

#Modelul pentru user code
class DontpadUserCode(models.Model):
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE, related_name = "user")
    slug = models.ForeignKey(DontpadURL, on_delete = models.CASCADE, related_name = "user_url")
    proffesor_code = models.ForeignKey(DontpadCode, on_delete = models.CASCADE, related_name = "proffesor_code")
    code = models.TextField()

    class Meta:
        ordering = ["-id"]


#modelul pentru comentarii
class DontpadComment(models.Model):
    slug = models.ForeignKey(DontpadURL, on_delete = models.CASCADE)
    line = models.IntegerField()
    comment = models.TextField()
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comment
    
    def data(self):
        dct = { 
            "comment": self.comment,
            "line": self.line,
            "user": {
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
            },
            "date": self.date.strftime("%d/%m/%Y %H:%M:%S"),
        }
        return dct

#Modelul pemntru imaginele whatsapp
class DontpadImage(models.Model):
    image = models.ImageField(upload_to = "images/")

#Modelul pentru video
class DontpadVideo(models.Model):
    url = models.ForeignKey(DontpadURL, on_delete = models.CASCADE)
    video = models.FileField(upload_to = "videos/")
    name = models.CharField(max_length = 100, blank = True, null = True)

    def __str__(self):
        return self.name

    def data(self):
        return {
            "name": self.name,
            "video": self.video.url,
        }

#modelul pentru exercitii
class DontpadExercise(models.Model):
    slug = models.ForeignKey(DontpadURL, on_delete = models.CASCADE)
    name = models.CharField(max_length = 100)
    description = models.TextField()
    code = models.TextField()
    test = models.TextField()

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return self.name

    def data(self):
        return {
            "name": self.name,
            "description": self.description,
            "code": self.code,
            "test": self.test,
        }

#modelul pentru rezultatele exercitiilor
class DontpadExerciseResult(models.Model):
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE)
    exercise = models.ForeignKey(DontpadExercise, on_delete = models.CASCADE, related_name = "exercise")
    code = models.TextField()
    result = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    solved = models.BooleanField(default = False)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name + " " + self.exercise.name

    def data(self):
        return {
            "user": {
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
            },
            "exercise": {
                "name": self.exercise.name,
            },
            "code": self.code,
            "result": self.result,
            "date": self.date.strftime("%d/%m/%Y %H:%M:%S"),
        }
