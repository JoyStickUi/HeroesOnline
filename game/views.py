from django.core import serializers
from .models import FigureLink, Figure
from webapp.models import Friendship
from django.contrib.auth.models import User
from django.http import JsonResponse, Http404
from django.db.models import Q

import json

# Create your views here.


def api_get_landed_figures(request, username):
	l_figures = []
	user = User.objects.get(username=username)

	for obj in json.loads(
			serializers.serialize(
				'json',
				FigureLink.objects.filter(
					master=user,
					landed=True
				)
			)
	):
		figure = Figure.objects.get(id=obj['fields']['figure'])
		obj['fields']['name'] = figure.name
		obj['fields']['master'] = user.username
		obj['fields']['id'] = obj['pk']
		l_figures.append(obj['fields'])

	return JsonResponse({
		'Landed': l_figures
	})


def api_get_not_landed_figures(request, username):
	nl_figures = []
	user = User.objects.get(username=username)
	for obj in json.loads(
			serializers.serialize(
				'json',
				FigureLink.objects.filter(
					master=user,
					landed=False
				)
			)
	):
		obj['fields']['name'] = Figure.objects.get(id=obj['fields']['figure']).name
		obj['fields']['master'] = user.username
		obj['fields']['id'] = obj['pk']
		nl_figures.append(obj['fields'])

	return JsonResponse({
		'NotLanded': nl_figures
	})


def get_friends(request, username):
	user = User.objects.get(username=username)
	friends = []
	for friendship in Friendship.objects.filter(Q(f_user=user) | Q(s_user=user)):
		if friendship.f_user != user:
			friends.append(friendship.f_user.username)
		elif friendship.s_user != user:
			friends.append(friendship.s_user.username)
	return JsonResponse({
		'data': friends
	})


def save_bridgehead(request):
	if request.user.is_authenticated and request.method == 'POST':
		FigureLink.objects.filter(master=request.user, landed=True).update(landed=False)
		for figure in json.loads(request.POST['bridgehead']):
			FigureLink.objects.filter(id=figure['id']).update(x=figure['x'], y=figure['y'], landed=True)
		return JsonResponse({
			'response': 'OK'
		})
	return Http404()


def send_invite(request, username):
	return JsonResponse({
		'sent': 'ok'
	})
