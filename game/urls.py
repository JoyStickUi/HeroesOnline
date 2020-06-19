from django.urls import path

from . import views

urlpatterns = [
	path('api/user/<username>/figures/landed', views.api_get_landed_figures, name='api_get_landed_figures'),
	path('api/user/<username>/figures/not/landed', views.api_get_not_landed_figures, name='api_get_not_landed_figures'),
	path('api/game/editor/save/bridgehead', views.save_bridgehead, name="save_bridgehead"),
	path('api/user/<username>/friends', views.get_friends, name="friends"),
	path('api/user/<username>/send/invite', views.send_invite, name="send_invite")
]