"""
ASGI config for dontpad project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dontpad.settings')
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from dontpadcode.routing import websocket_urlpatterns
from channels.security.websocket import AllowedHostsOriginValidator

django_asgi_app = get_asgi_application()
application = ProtocolTypeRouter({
  'http': django_asgi_app,
  'websocket': AllowedHostsOriginValidator(
      AuthMiddlewareStack(
      URLRouter(
        websocket_urlpatterns
      ),
    )
  )
  
})
