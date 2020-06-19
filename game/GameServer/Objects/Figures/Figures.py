from .SkeletonArcher import SkeletonArcher
from .Peasant import Peasant
from .ElfMage import ElfMage
from .ElfAssassin import ElfAssassin
from .Spearman import Spearman
from .SkeletonWarrior import SkeletonWarrior


class Figures:
    @staticmethod
    def get_figure(name: str):
        if name.lower() == "SkeletonArcher".lower():
            return SkeletonArcher
        elif name.lower() == "Peasant".lower():
            return Peasant
        elif name.lower() == "ElfMage".lower():
            return ElfMage
        elif name.lower() == "ElfAssassin".lower():
            return ElfAssassin
        elif name.lower() == "Spearman".lower():
            return Spearman
        elif name.lower() == "SkeletonWarrior".lower():
            return SkeletonWarrior
        return None
