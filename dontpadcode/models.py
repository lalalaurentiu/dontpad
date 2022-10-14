from django.db import models

#Modelul pentru noul proiect
class DontpadURL(models.Model):
    slug = models.SlugField()

#Modelul pentru code
class DontpadCode(models.Model):
    slug = models.ForeignKey(DontpadURL, on_delete = models.CASCADE, related_name = "url")
    code = models.TextField()
