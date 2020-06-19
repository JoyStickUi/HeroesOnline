from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
	re_path(r'^session/(?P<group_name>\w+)$', consumers.GameSessionConsumer),
	re_path('menu', consumers.GameMenuConsumer)
]