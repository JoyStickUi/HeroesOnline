from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth.models import User

from game.GameServer.Game import Game
from game.GameServer.Objects.GameSessionsStore.GameSessionsStore import GameSessionsStore

from .models import FigureLink
from webapp.models import Money

import random

binded_sessions_names = {}


class GameSessionConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.group_name = self.scope['url_route']['kwargs']['group_name']
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        if self.group_name not in GameSessionsStore.sessions:
            GameSessionsStore.sessions[self.group_name] = Game(
                lambda data: async_to_sync(self.channel_layer.group_send)(
                    self.group_name,
                    {
                        'type': "send_message",
                        'message': data
                    }
                )
            )
        self.accept()

    def disconnect(self, close_code):
        if self.group_name in GameSessionsStore.sessions:
            GameSessionsStore.sessions.pop(self.group_name)
        if self.group_name in binded_sessions_names:
            binded_sessions_names.pop(self.group_name)
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': "send_message",
                'message': {
                    'type': 'close'
                }
            }
        )
        async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)

    def receive_json(self, content):
        if content['type'] == 'game':
            if content['user'] == (GameSessionsStore.sessions[self.group_name].left if GameSessionsStore.sessions[self.group_name].turn == 0 else GameSessionsStore.sessions[self.group_name].right):
                GameSessionsStore.sessions[self.group_name].handleClientMessage(content)
                if GameSessionsStore.sessions[self.group_name].winner is not None:
                    money = Money.objects.get(master=User.objects.get(username=GameSessionsStore.sessions[self.group_name].winner))
                    money.money = money.money + GameSessionsStore.sessions[self.group_name].won_prize
                    money.save()
                    async_to_sync(self.channel_layer.group_send)(
                        self.group_name,
                        {
                            'type': "send_message",
                            'message': {
                                'type': 'game_end',
                                'winner': GameSessionsStore.sessions[self.group_name].winner
                            }
                        }
                    )
                else:
                    async_to_sync(self.channel_layer.group_send)(
                        self.group_name,
                        {
                            'type': "send_message",
                            'message': content
                        }
                    )
        elif content['type'] == 'init':
            figures = FigureLink.objects.filter(master=User.objects.get(username=content['user']), landed=True)
            GameSessionsStore.sessions[self.group_name].init(content, figures)
            if GameSessionsStore.sessions[self.group_name].winner is not None:
                async_to_sync(self.channel_layer.group_send)(
                    self.group_name,
                    {
                        'type': "send_message",
                        'message': {
                            'type': 'game_end',
                            'winner': GameSessionsStore.sessions[self.group_name].winner
                        }
                    }
                )
        elif content['type'] == 'close':
            self.close()


    def send_message(self, event):
        self.send_json(event['message'])


class GameMenuConsumer(JsonWebsocketConsumer):
    def connect(self):
        self.group_name = ""
        self.accept()

    def disconnect(self, code):
        if self.group_name in binded_sessions_names:
            binded_sessions_names.pop(self.group_name)
            async_to_sync(self.channel_layer.group_send)(
                self.group_name,
                {
                    'type': "send_message",
                    'message': {
                        'type': 'close'
                    }
                }
            )
            async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)

    def receive_json(self, content):
        if content['type'] == 'create_lobby':
            if content['lobby_name'] not in binded_sessions_names:
                binded_sessions_names[content['lobby_name']] = 1
                self.group_name = content['lobby_name']
                async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
                self.send_message({
                    'message': {
                        'type': 'success',
                        'success': "Lobby was created."
                    }
                })
            else:
                self.send_message({
                    'message': {
                        'type': 'create_error',
                        'error': "Can't set this lobby name. Try another one."
                    }
                })
        elif content['type'] == 'join_lobby':
            if content['lobby_name'] in binded_sessions_names:
                self.group_name = content['lobby_name']
                async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
                async_to_sync(self.channel_layer.group_send)(
                    self.group_name,
                    {
                        'type': "send_message",
                        'message': {
                            'type': 'connect',
                            'data': {
                                'user': self.scope['user'].username,
                                'lobby_name': self.group_name
                            }
                        }
                    }
                )
        elif content['type'] == 'message':
            if self.group_name in binded_sessions_names:
                async_to_sync(self.channel_layer.group_send)(
                    self.group_name,
                    {
                        'type': "send_message",
                        'message': {
                            'type': 'message',
                            'data': content['data']
                        }
                    }
                )
        elif content['type'] == 'close':
            self.close()
        elif content['type'] == 'ready':
            if self.group_name in binded_sessions_names:
                async_to_sync(self.channel_layer.group_send)(
                    self.group_name,
                    {
                        'type': "send_message",
                        'message': content
                    }
                )

    def send_message(self, event):
        self.send_json(event['message'])