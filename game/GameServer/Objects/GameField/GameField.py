from game.GameServer.Objects.GameObject.GameObject import GameObject
from game.GameServer.Objects.Figure.Figure import Figure
from game.GameServer.Constants import Constants


class GameField:
    def __init__(self):
        self.field_matrix = []

        for i in range(0, Constants.x_block_amount):
            self.field_matrix.append([])
            for j in range(0, Constants.y_block_amount):
                self.field_matrix[i].append(GameObject(i, j))

    def setFigure(self, object: Figure):
        self.field_matrix[object.x][object.y] = object

    def moveFigure(self, from_x: int, from_y: int, to_x: int, to_y: int):
        tmp = self.field_matrix[to_x][to_y]
        self.field_matrix[to_x][to_y] = self.field_matrix[from_x][from_y]
        self.field_matrix[from_x][from_y] = tmp

    def getFigure(self, x: int, y: int):
        return self.field_matrix[x][y]

    def getReport(self):
        report = []
        for i in range(0, Constants.x_block_amount):
            for j in range(0, Constants.y_block_amount):
                if isinstance(self.field_matrix[i][j], Figure):
                    report.append(self.field_matrix[i][j].getReport())

        return report

    def attackFigure(self, from_x: int, from_y: int, to_x: int, to_y: int):
        if isinstance(self.field_matrix[to_x][to_y], Figure) and isinstance(self.field_matrix[from_x][from_y], Figure):
            self.field_matrix[to_x][to_y].getDamage(self.field_matrix[from_x][from_y].damage)
