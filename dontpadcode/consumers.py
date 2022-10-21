# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from .models import DontpadCode, DontpadURL
from django.dispatch import receiver
from difflib import Differ
from .views import CHARACTERS

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
        diferrence = event.get("differnce")

        # Send message to WebSocket
        self.send(text_data=json.dumps({"code": code, "differnce": diferrence}))

@receiver(post_save, sender=DontpadCode)
def post_code_receiver(sender, **kwargs):
    code = DontpadCode.objects.filter(slug_id = kwargs["instance"].slug.id).order_by("-id")
    try:
        modified_code = code[1]
        from difflib import Differ
        d = Differ()
        result = list(d.compare(modified_code.code.splitlines(), code[0].code.splitlines()))

        differnce = ''
        line_index = 0
        
        for line in range(len(result)):
            line_index += 1
            letters = ""
            
            for letter in result[line]:
                try:
                    letters += CHARACTERS[letter]
                except KeyError:
                    letters += letter

            if letters[0] == "+":
                line_index -= 1
                differnce += f"<code class='lineplus'> {line_index} <span>+</span> {letters.replace('+', '')} </code> \n"
            elif letters[0] == "-":
                differnce += f"<code class='lineminus'>{line_index} <span>-</span> {letters.replace('-', '')} </code> \n"
            else:
                differnce += f"<code> {line_index} {letters} </code> \n"
    except:
        differnce = None

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "chat_%s" % kwargs["instance"].slug.slug,
        {"type": "chat_code", "code": kwargs["instance"].code, "differnce": differnce},
    )
