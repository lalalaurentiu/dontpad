from django.shortcuts import render, HttpResponse, redirect
from twilio.rest import Client
from dontpad import settings
from .models import *
from .forms import *
import json

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

CHARACTERS ={
    " ":"&nbsp;",
    "<":"&lt;",
    ">":"&gt;",
    "&":"&amp;",
    "\\t":"&nbsp; &nbsp; &nbsp; &nbsp;"
}
#view-ul pentru home page
def home(request):
    template_name = "home/home.html"

    return render(request, template_name)

# view-ul pentru o noua ruta
def new_file(request, slug):
    
    template_name = "file.html"

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

    #daca exista code pentru acel path il returnam pe ultimul
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
        "versions":code
    }

    #metoda prin care salvam un nou code
    if request.method == "POST":
        DontpadCode.objects.create(slug_id=obj[0].id,code = request.POST["code"])
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
    obj = DontpadURL.objects.filter(slug = slug)[0].id
    comments = DontpadComment.objects.filter(slug_id = obj)
    comments = [comment.data() for comment in comments]

    if request.method == "POST" and request.user.is_authenticated:
        DontpadComment.objects.create(slug_id = obj, comment = json.loads(request.body)["comment"], line = json.loads(request.body)["line"], user_id = request.user.id)
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
            print(number, message, name)
            image = DontpadImage.objects.create(image = image)
            send_whatsapp(image.image.url, number, message, name) 
            
            return HttpResponse(status = 201)
    return HttpResponse(status = 400)
