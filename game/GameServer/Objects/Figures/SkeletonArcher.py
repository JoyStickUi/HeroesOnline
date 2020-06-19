from ..Figure.Figure import Figure


class SkeletonArcher(Figure):
    def __init__(self, x: int, y: int, master: str):
        super(SkeletonArcher, self).__init__(x, y, master, "SkeletonArcher")
        self.damage = 5
        self.health = 10
        self.move_radius = 1
        self.attack_radius = 5
