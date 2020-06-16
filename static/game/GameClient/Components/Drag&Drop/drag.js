import {Constants} from "../../Objects/Constants.js";

export class Drag {

    static picked = false;
    static cell = null;

    static bridgehead = null;

    static holdPickedFigure(event_body){
        if(Drag.picked && Drag.cell != null && Drag.cell.gameobject != null){
            Drag.cell.gameobject.rect.x = event_body.clientX - Drag.cell.gameobject.rect.width / 2;
            Drag.cell.gameobject.rect.y = event_body.clientY - Drag.cell.gameobject.rect.height;
        }
    }

    static discharge(){
        Drag.picked = false;
        Drag.cell.setObject(Drag.cell.gameobject);
        Drag.cell = null;
    }

    static drag(obj){
        if(!Drag.picked){
            if(obj != null && obj.gameobject != null){
                Drag.cell = obj;
                Drag.cell.gameobject.rect.width = Constants.block_size;
                Drag.cell.gameobject.rect.height = Constants.block_size;
                Drag.picked = true;
            }
        }
    }
}