# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from .models import DontpadCode, DontpadURL
from django.dispatch import receiver
from difflib import Differ
from .views import CHARACTERS

from channels.consumer import AsyncConsumer

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
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message")
        code = text_data_json.get("code")
        if message:
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                },
            )
        elif code:
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_code",
                    "code": code,
                },
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event.get("message")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))
    async def chat_code(self, event):
        code = event.get("code")
        diferrence = event.get("differnce")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"code": code, "differnce": diferrence}))

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
