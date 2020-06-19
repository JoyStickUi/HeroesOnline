from ..Figure.Figure import Figure


class ElfAssassin(Figure):
    def __init__(self, x: int, y: int, master: str):
        super(ElfAssassin, self).__init__(x, y, master, "ElfAssassin")
        self.damage = 20
        self.health = 10
        self.move_radius = 3
        self.attack_radius = 1
