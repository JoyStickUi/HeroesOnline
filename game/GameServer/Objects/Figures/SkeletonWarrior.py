from ..Figure.Figure import Figure


class SkeletonWarrior(Figure):
    def __init__(self, x: int, y: int, master: str):
        super(SkeletonWarrior, self).__init__(x, y, master, "SkeletonWarrior")
        self.damage = 10
        self.health = 20
        self.move_radius = 1
        self.attack_radius = 1
