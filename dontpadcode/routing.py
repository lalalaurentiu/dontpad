from django.urls import re_path
from .consumers import *

#rutele pentru websokets
websocket_urlpatterns = [
    #ruta pentru primirea mesajelor
    re_path(r'ws/chat/(?P<room_name>.*\w+)/$', ChatConsumer.as_asgi()),
]