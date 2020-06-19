from ..Figure.Figure import Figure


class ElfMage(Figure):
    def __init__(self, x: int, y: int, master: str):
        super(ElfMage, self).__init__(x, y, master, "ElfMage")
        self.damage = 10
        self.health = 5
        self.move_radius = 1
        self.attack_radius = 3
