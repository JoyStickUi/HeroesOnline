import {SkeletonArcher} from "./SkeletonArcher.js";
import {SkeletonWarrior} from "./SkeletonWarrior.js";
import {Peasant} from "./Peasant.js";
import {ElfMage} from "./ElfMage.js";
import {ElfAssassin} from "./ElfAssassin.js";
import {Spearman} from "./Spearman.js";

export class Figures{
    static get_figure(name){
        switch (name.toLowerCase()) {
            case "SkeletonArcher".toLowerCase(): return SkeletonArcher;
            case "Peasant".toLowerCase(): return Peasant;
            case "ElfMage".toLowerCase(): return ElfMage;
            case "ElfAssassin".toLowerCase(): return ElfAssassin;
            case "Spearman".toLowerCase(): return Spearman;
            case "SkeletonWarrior".toLowerCase(): return SkeletonWarrior;
            default: return null;
        }
    }
}