from ..GameObject.GameObject import GameObject


class Figure(GameObject):
    def __init__(self, x: int, y: int, master: str, name: str):
        super(Figure, self).__init__(x, y)
        self.name = name
        self.health = 100
        self.move_radius = 2
        self.attack_radius = 2
        self.damage = 25
        self.master = master

    def isDead(self):
        return self.health <= 0

    def setHealth(self, hp: int):
        self.health = 100 if hp > 100 else 0 if hp < 0 else hp

    def addHealth(self, hp: int):
        self.setHealth(self.health + hp)

    def getDamage(self, hp: int):
        self.setHealth(self.health - hp)

    def getReport(self):
        report = {
            'name': self.name,
            'master': self.master,
            'x': self.x,
            'y': self.y,
            'props': {
                'move_radius': self.move_radius,
                'attack_radius': self.attack_radius,
                'health': self.health,
                'damage': self.damage
            }
        }
        return report
