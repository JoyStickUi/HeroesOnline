from ..Figure.Figure import Figure


class Peasant(Figure):
    def __init__(self, x: int, y: int, master: str):
        super(Peasant, self).__init__(x, y, master, "Peasant")
        self.damage = 1
        self.health = 5
        self.move_radius = 1
        self.attack_radius = 1
