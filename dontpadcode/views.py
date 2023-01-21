from django.shortcuts import render, HttpResponse, redirect
from twilio.rest import Client
from dontpad import settings
from .models import *
from .forms import *
import json
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

def send_whatsapp(image_url, number, message =" ", name=" "):
     # Your Account SID from twilio.com/console
        account_sid = settings.TWILIO_ACCOUNT_SID
        # Your Auth Token from twilio.com/console
        auth_token  = settings.TWILIO_AUTH_TOKEN

        client = Client(account_sid, auth_token)
        message = client.messages.create(
                                    body=f"{name}: {message}",
                                    from_='whatsapp:+14155238886',
                                    to=f"whatsapp:+4{number}",
                                    media_url = str(image_url)
                                )

#view-ul pentru home page
def home(request):
    template_name = "home/home.html"

    return render(request, template_name)

# view-ul pentru o noua ruta
def new_file(request, slug):
    
    template_name = "filepath/file.html"

    #luam pathul si-l verificam in baza de date 
    #verificam in baza de date daca exista
    #daca exista il returnam 
    #daca nu exista cream unul
    file_name = request.path.replace("/", "")
    obj = DontpadURL.objects.get_or_create(slug=file_name)

    #verificam daca exista code in baza de date pentru acel path
    code = DontpadCode.objects.filter(slug_id = obj[0].id).order_by("-id")

    #formularul pentru incarcarea de fisiere
    uploadFileForm = UploadFile()

    videos = DontpadVideo.objects.filter(url_id = obj[0].id)

    exercise = DontpadExercise.objects.filter(slug_id = obj[0].id)

    #daca exista code pentru acel path il returnam pe ultimul

    videoCode = DontpadVideoCode.objects.filter(url_id = obj[0].id)

    try:
        last_code = code[0]
    except:
        last_code = None

    #metoda prin care vedem diferentele dintre coduri
    try:
        modified_code = code[1]
        differnce = modified_code.code
    except:
        differnce = ""

    context = {
        "code": last_code,
        "difference":differnce,
        "fileForm":uploadFileForm,
        "slug":slug,
        "versions":code,
        "videos":videos,
        "exercises":exercise,
        "videoCode":videoCode
    }

    #metoda prin care salvam un nou code
    if request.method == "POST":
        if request.user.is_professor:
            DontpadCode.objects.create(slug_id=obj[0].id,code = request.POST["code"])
        else:
            versionId = request.POST["versionId"]
            print(versionId)
            
            DontpadUserCode.objects.create(
                                    slug_id=obj[0].id,
                                    code = request.POST["code"],
                                    user_id = request.user.id,
                                    proffesor_code_id = versionId)
        return HttpResponse(status = 200)

    response = render(request, template_name, context)
    return response

#view-ul pentru incarcarea fisierelor
def uploadFile(request, slug):
    if request.method == "POST":
        url = request.path.replace("/upload", "").replace("/", "")
        #citim din fisier
        fileContent = request.FILES['file'].read().decode("utf-8")

        #il salvam in baza de date 
        obj = DontpadURL.objects.filter(slug = url)[0].id
        DontpadCode.objects.create(slug_id = obj, code = fileContent)
    return redirect(request.path.replace("/upload", ""))

#view-ul pentru commenturi
def comment(request, slug):
    
    proffesorCode = request.GET.get("proffesor")
    studentCode = request.GET.get("student")

    obj = DontpadURL.objects.filter(slug = slug)[0].id
    if proffesorCode:
        comments = DontpadComment.objects.filter(slug_id = obj, proffesorCode = proffesorCode)
    elif studentCode:
        comments = DontpadComment.objects.filter(slug_id = obj, userCode = studentCode)
    else:
        comments = DontpadComment.objects.filter(slug_id = obj)
    # comments = DontpadComment.objects.filter(slug_id = obj)
    comments = [comment.data() for comment in comments]

    if request.method == "POST" and request.user.is_authenticated:
        
        # print(json.loads(request.body)["version"])
        user = json.loads(request.body)["version"]

        if user.get("proffesor"):
            proffesorCode = DontpadCode.objects.filter(id = int(user["proffesor"])).first()
            print(proffesorCode)
            DontpadComment.objects.create(
                                    slug_id = obj, 
                                    comment = json.loads(request.body)["comment"], 
                                    line = json.loads(request.body)["line"], 
                                    proffesorCode = proffesorCode,
                                    user_id = request.user.id)
        elif user.get("student"):
            userCode = DontpadUserCode.objects.filter(id = int(user["student"])).first()
            DontpadComment.objects.create(
                                    slug_id = obj, 
                                    comment = json.loads(request.body)["comment"], 
                                    line = json.loads(request.body)["line"], 
                                    userCode = userCode,
                                    user_id = request.user.id)
        return HttpResponse(status = 201)

    return HttpResponse(json.dumps({"comments":comments}), content_type="application/json")

#view+ul pentru imagini
def whatsapp(request, slug):
    if request.method == "POST":
        image = request.FILES["image"]
        number = request.POST.get("number")
        message = request.POST.get("message")
        name = request.POST.get("name")
        if number and image:
            image = DontpadImage.objects.create(image = image)
            send_whatsapp(image.image.url, number, message, name) 
            
            return HttpResponse(status = 201)
    return HttpResponse(status = 400)

#view-ul pentru incarcarea video-urilor
def uploadVideo(request, slug):
    url_id = DontpadURL.objects.filter(slug = slug)[0].id
    videos = DontpadVideo.objects.filter(url_id = url_id)
    if request.method == "POST":
        video = request.FILES["video"]
        name = request.POST["name"]
        
        if video:
            video = DontpadVideo.objects.create(video = video, url_id = url_id, name = name)
            return HttpResponse(status = 201, 
            content = json.dumps({"video":video.video.url, "name":video.name}))
    return HttpResponse(status = 200, content = json.dumps({"videos":[video.data() for video in videos]}))

#view-ul pentru creare exercitilor
@login_required
def createExercise(request, slug):
    if request.user.is_professor:
        template_name = "createExercise.html"
        form = CreateExercise(request.POST)
        context = {
            "form":form
        }
        if request.method == "POST":
            url_id = DontpadURL.objects.filter(slug = slug)[0].id
            if form.is_valid():
                instance = form.save(commit=False)
                instance.slug_id = url_id
                instance.save()
                return redirect(request.path)
            else:
                print(form.errors)

        response = render(request, template_name, context)
        return response
    else:
        return HttpResponse(status = 403)

#view-ul pentru vizualizarea exercitiilor
@login_required
def viewExercise(request, slug, id):

    template_name = "viewExercise.html"
    url_id = DontpadURL.objects.filter(slug = slug)[0].id
    exercise = DontpadExercise.objects.filter(slug_id = url_id, id = id)[0]

    try:
        result = DontpadExerciseResult.objects.get(exercise_id = id, user_id = request.user.id)
    except:
        result = None

    context = {
        "exercise":exercise,
        "result":result.result if result else False
    }
    response = render(request, template_name, context)
    return response

@login_required
def exerciseHint(request, slug, id):
    hint = DontpadExercise.objects.filter(slug_id = DontpadURL.objects.filter(slug = slug)[0].id, id = id)[0].hints
    if hint:
        return HttpResponse(json.dumps({"hint":hint}), content_type="application/json")
    return HttpResponse(status = 400)

@login_required
def submitExercise(request, slug, id):
    getResponse = json.loads(request.body)
    if request.method == "POST":
        url_id = DontpadURL.objects.filter(slug = slug)[0].id
        exercise = DontpadExercise.objects.filter(slug_id = url_id, id = id)[0]
        
        if exercise:
            if exercise.hints == getResponse["answer"]:
                DontpadExerciseResult.objects.create(
                                                    exercise_id = id,
                                                    user_id = request.user.id,
                                                    result = getResponse["answer"],
                                                    solved = True
                                                    )
                return HttpResponse(status = 201, content = json.dumps({"status":"success", "message":"Felicitari! Ai rezolvat exercitiul corect!"}))
            else:
                return HttpResponse(status = 201, content = json.dumps({"status":"error", "message":"Codul nu este corect!"}))
    return HttpResponse(status = 400)

#view-ul pentru videourile incarcate V2
class VideoCode(TemplateView):

    def get (self, request, slugfile, slug):
        template_name = "videoCode.html"
        videos = DontpadVideo.objects.filter(slug = slug)
        context = {
            "videos":videos
        }
        response = render(request, template_name, context)
        return response

    def post(self, request,slugfile, slug):
        if request.method == "POST":
            url_id = DontpadURL.objects.filter(slug = slugfile)[0].id
        return HttpResponse(status = 400)

    def get_video_data(self, request, slug):
        url_id = DontpadURL.objects.filter(slug = slug)[0].id
        videos = DontpadVideo.objects.filter(url_id = url_id)
        return HttpResponse(json.dumps({"videos":[video.data() for video in videos]}), content_type="application/json")

def postVideoCode(request, slug):

    audio = request.FILES["audio"]
    changes = request.POST.get("changes")
    if request.method == "POST":
        url_id = DontpadURL.objects.filter(slug = slug)[0].id
        audio = DontpadVideoCode.objects.create(audio = audio, url_id = url_id, json = changes)
        return HttpResponse(status = 201, content = json.dumps({"audio":audio.audio.url, "json":audio.json}))
    return HttpResponse(status = 400)

def getVideoCode(request, slug, slugVideo):
    formatType = request.GET.get("format")
    url_id = DontpadURL.objects.filter(slug = slug)[0].id
    video = DontpadVideoCode.objects.filter(url_id = url_id, slug = slugVideo).first()
    template_name = "videoCode.html"
    context = {
        "video":video,
    }

    if formatType == "json":
        return HttpResponse(json.dumps(video.json), content_type="application/json")

    response = render(request, template_name, context)
    return response