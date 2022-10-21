# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from .models import DontpadCode, DontpadURL
from django.dispatch import receiver

from channels.consumer import SyncConsumer

class EchoConsumer(SyncConsumer):

    def websocket_connect(self, event):
        self.send({
            "type": "websocket.accept",
        })

    def websocket_receive(self, event):
        self.send({
            "type": "websocket.send",
            "text": event["text"],
        })

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat_%s" % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json.get("message")
        code = text_data_json.get("code")
        if message:
            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                },
            )
        elif code:
            # Send message to room group
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "chat_code",
                    "code": code,
                },
            )

    # Receive message from room group
    def chat_message(self, event):
        message = event.get("message")

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))
    def chat_code(self, event):
        code = event.get("code")

        # Send message to WebSocket
        self.send(text_data=json.dumps({"code": code}))

@receiver(post_save, sender=DontpadCode)
def post_code_receiver(sender, **kwargs):
   
        print(kwargs['instance'].code)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "chat_%s" % kwargs["instance"].slug.slug,
            {"type": "chat_code", "code": kwargs["instance"].code},
        )
