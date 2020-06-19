class GameObject:
    def __init__(self, x: int, y: int):
        self.x: int = x
        self.y: int = y

    def setPosition(self, x: int, y: int):
        self.x = x
        self.y = y