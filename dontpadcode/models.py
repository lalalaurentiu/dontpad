from django.db import models

#Modelul pentru noul proiect
class DontpadURL(models.Model):
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.slug
        
#Modelul pentru code
class DontpadCode(models.Model):
    slug = models.ForeignKey(DontpadURL, on_delete = models.CASCADE, related_name = "url")
    code = models.TextField()
