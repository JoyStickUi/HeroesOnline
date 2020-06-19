from ..Figure.Figure import Figure


class Spearman(Figure):
    def __init__(self, x: int, y: int, master: str):
        super(Spearman, self).__init__(x, y, master, "Spearman")
        self.damage = 15
        self.health = 20
        self.move_radius = 1
        self.attack_radius = 2
