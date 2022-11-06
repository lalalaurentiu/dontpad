# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from .models import DontpadCode, DontpadURL
from django.dispatch import receiver
from difflib import Differ
from .views import CHARACTERS
from accounts.models import CustomUser
from django.contrib.sessions.models import Session

from channels.consumer import AsyncConsumer

#utilitati
#creaza un obiect
class CreateObjFromDict(object):
    def __init__(self, **entries):
        self.__dict__.update(entries)


# metoda pentru trimiterea de mesaje asincrone
class EchoConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.send({
            "type": "websocket.accept",
        })

    async def websocket_receive(self, event):
        self.send({
            "type": "websocket.send",
            "text": event["text"],
        })

#metoda prin care acceptam, deconectam, primim mesaje, trimitem mesaje prin protocolul websokets
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = await self.getUser() 
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()
        await self.send(text_data=json.dumps({"message": f"{self.user.first_name} {self.user.last_name} sa conectat!", "user": {"first_name": "Server", "last_name": " "}}))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        user = {
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        }
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message")
        code = text_data_json.get("code")

        # data for mark code
        color = text_data_json.get("color")
        lineStart = text_data_json.get("lineStart")
        lineEnd = text_data_json.get("lineEnd")

        #data for chat code
        chatCode = text_data_json.get("chatCode")

        if message:
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "user": user,
                },
            )
        if code:
            # Send code to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_code",
                    "code": code,
                },
            )

        if str(color) and str(lineStart) and str(lineEnd):
            # Send mark to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_mark",
                    "data": {
                    "color": color,
                    "lineStart": lineStart,
                    "lineEnd": lineEnd,
                    }
                },
            )

        if chatCode:
            # Send chat code to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_codeChat",
                    "data": chatCode,
                },
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event.get("message")
        user = event.get("user")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message, "user": user}))

    async def chat_code(self, event):
        code = event.get("code")
        diferrence = event.get("differnce")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"code": code, "differnce": diferrence}))

    async def chat_mark(self, event):
        data = event.get("data")
        color = data.get("color")
        lineStart = data.get("lineStart")
        lineEnd = data.get("lineEnd")

        await self.send(text_data=json.dumps({"color": color, "lineStart": lineStart, "lineEnd": lineEnd}))

    async def chat_codeChat(self, event):
        data = event.get("data")
        code = data.get("code")
        lineStart = data.get("lineStart")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"chatCode": code, "lineStart": lineStart}))
    
    #prealuarea userului curent
    @database_sync_to_async
    def getUser(self):
        try:
            session_key = self.scope["cookies"]["sessionid"]
            session = Session.objects.get(session_key=session_key)
            session_data = session.get_decoded()
            uid = session_data.get("_auth_user_id")
            user = CustomUser.objects.get(id = uid)
        except:
            obj = {"first_name": "Anonim", "last_name": ""}
            user = CreateObjFromDict(**obj)
        return user

#metoda prin care trimitem diferentele de cod prin protocolul websokets
@receiver(post_save, sender=DontpadCode)
def post_code_receiver(sender, **kwargs):
    code = DontpadCode.objects.filter(slug_id = kwargs["instance"].slug.id).order_by("-id")
    try:
        modified_code = code[1]
        differnce = modified_code.code
    except:
        differnce = ""

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "chat_%s" % kwargs["instance"].slug.slug,
        {"type": "chat_code", "code": kwargs["instance"].code, "differnce": differnce},
    )
