from django.db import models
from accounts.models import CustomUser
from django.urls import reverse
from django.utils.text import slugify
import json

# Modelul pentru noul proiect


class DontpadURL(models.Model):
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.slug

# Modelul pentru code


class DontpadCode(models.Model):
    slug = models.ForeignKey(
        DontpadURL, on_delete=models.CASCADE, related_name="url")
    code = models.TextField()

    def get_absolute_url(self):
        return reverse("iframe", kwargs={"slug": self.slug.slug})

# Modelul pentru user code


class DontpadUserCode(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="user")
    slug = models.ForeignKey(
        DontpadURL, on_delete=models.CASCADE, related_name="user_url")
    proffesor_code = models.ForeignKey(
        DontpadCode, on_delete=models.CASCADE, related_name="proffesor_code")
    code = models.TextField()

    class Meta:
        ordering = ["-id"]


# modelul pentru comentarii
class DontpadComment(models.Model):
    slug = models.ForeignKey(DontpadURL, on_delete=models.CASCADE)
    userCode = models.ForeignKey(
        DontpadUserCode, on_delete=models.CASCADE, blank=True, null=True)
    proffesorCode = models.ForeignKey(
        DontpadCode, on_delete=models.CASCADE, blank=True, null=True)
    line = models.IntegerField()
    comment = models.TextField()
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
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

# Modelul pemntru imaginele whatsapp


class DontpadImage(models.Model):
    image = models.ImageField(upload_to="images/")

# Modelul pentru video


class DontpadVideo(models.Model):
    url = models.ForeignKey(DontpadURL, on_delete=models.CASCADE)
    video = models.FileField(upload_to="videos/")
    name = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

    def data(self):
        return {
            "name": self.name,
            "video": self.video.url,
        }

# modelul pentru exercitii


class DontpadExercise(models.Model):
    slug = models.ForeignKey(DontpadURL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    codeInput = models.TextField()
    hints = models.TextField(blank=True, null=True)
    exerciseSlug = models.SlugField(unique=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.exerciseSlug

    def get_absolute_url(self):
        return reverse('dontpadcode:createExercise', kwargs={'slug': self.slug.slug})

    def save(self, *args, **kwargs):
        self.exerciseSlug = slugify(self.slug.slug + "_" + self.title)
        super(DontpadExercise, self).save(*args, **kwargs)

# modelul pentru rezultatele exercitiilor


class DontpadExerciseResult(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    exercise = models.ForeignKey(
        DontpadExercise, on_delete=models.CASCADE, related_name="exercise")
    result = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    solved = models.BooleanField(default=False)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name + " " + self.exercise.title

    def get_absolute_url(self):
        return reverse('dontpadcode:viewExercise', kwargs={'slug': self.exercise.slug.slug})

# modelul pentru audio si video versiunea 2


class DontpadVideoCode(models.Model):
    url = models.ForeignKey(DontpadURL, on_delete=models.CASCADE)
    audio = models.FileField(upload_to="audio/")
    json = models.TextField()
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.audio.name.split(".mp3"))
        super(DontpadVideoCode, self).save(*args, **kwargs)

    def getJson(self):
        return json.loads(self.json)

    def __str__(self):
        return self.slug

    def get_absolute_url(self):
        return reverse('dontpadcode:videoCode', kwargs={'slug': self.slug})
