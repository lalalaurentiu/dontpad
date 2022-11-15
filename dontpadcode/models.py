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