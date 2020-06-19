import random as rand
from game.GameServer.Objects.GameField.GameField import GameField
from game.GameServer.Objects.Figures.Figures import Figures
from game.GameServer.Constants import Constants
from game.GameServer.Objects.GameObject.GameObject import GameObject
from game.GameServer.Objects.Figure.Figure import Figure
from ..models import Figure as fg


class Game:
    def __init__(self, callback):
        self.turn = rand.randint(0, 1)
        self.game_field = GameField()
        self.callback = callback
        self.left = None
        self.right = None
        self.left_force = 0
        self.right_force = 0
        self.won_prize = 0
        self.winner = None

    def init(self, data, figures):
        if self.left is None:
            self.left = data['user']
            for figure in figures:                
                self.game_field.setFigure(Figures.get_figure(name=figure.figure.name)(figure.x, figure.y, self.left))
                self.left_force = self.left_force + 1
                self.won_prize += int(figure.figure.price / 10)
            if self.left_force <= 0:
                self.winner = ""
            return

        if self.right is None:
            self.right = data['user']
            for figure in figures:                
                self.game_field.setFigure(Figures.get_figure(name=figure.figure.name)(Constants.x_block_amount - figure.x - 1, figure.y, self.right))
                self.right_force = self.right_force + 1
                self.won_prize += int(figure.figure.price / 10)
            if self.right_force <= 0:
                self.winner = ""
            else:
                self.start()
            return

    def handleClientMessage(self, data):
        self.turn = abs(self.turn - 1)
        data['turn'] = self.left if self.turn == 0 else self.right
        for obj in data['actions']:
            from_x = obj['from_x']
            to_x = obj['to_x']
            if obj['master'] == self.right:
                obj['from_x'] = Constants.x_block_amount - obj['from_x'] - 1
                obj['to_x'] = Constants.x_block_amount - obj['to_x'] - 1
            if obj['type'] == 'attack':
                self.game_field.attackFigure(obj['from_x'], obj['from_y'], obj['to_x'], obj['to_y'])
                if isinstance(self.game_field.field_matrix[obj['to_x']][obj['to_y']], Figure):
                    if self.game_field.field_matrix[obj['to_x']][obj['to_y']].isDead():
                        if self.turn == 0:
                            self.left_force = self.left_force - 1
                        elif self.turn == 1:
                            self.right_force = self.right_force - 1
                        self.game_field.field_matrix[obj['to_x']][obj['to_y']] = GameObject(obj['to_x'], obj['to_y'])
            if obj['type'] == 'move':
                self.game_field.moveFigure(obj['from_x'], obj['from_y'], obj['to_x'], obj['to_y'])
            obj['from_x'] = from_x
            obj['to_x'] = to_x
        if self.left_force == 0 and self.right_force == 0:
            self.winner = None
        elif self.left_force == 0:
            self.winner = self.right
        elif self.right_force == 0:
            self.winner = self.left

    def start(self):
        self.callback({
            'type': 'init',
            'turn': self.left if self.turn == 0 else self.right,
            'field': self.game_field.getReport(),
            'left': self.left,
            'right': self.right
        })
