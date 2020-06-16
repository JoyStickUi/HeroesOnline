import {Drag} from "./drag.js";

export class Drop{
    static subscribers = [];

    static figuresContainer = null;

    //only for cells
    static subscribe(obj){
        Drop.subscribers.push(obj);
    }

    static placeForDrop(x, y){
        let drop_target = null;
        Drop.subscribers.forEach((element)=>{
            if(element.rect.include_point(x, y)){
                drop_target = element;
            }
        });
        return drop_target;
    }

    static drop(event_body){
        if(Drag.picked){
            let place_for_drop = Drop.placeForDrop(event_body.clientX, event_body.clientY);
            if(place_for_drop != null){
                Drag.cell.gameobject.isEnemy = false;
                Drag.cell.moveObject(place_for_drop);
                place_for_drop.gameobject.updateStates();
                Drag.picked = false;
                Drop.figuresContainer.scroll = 0;
                let index = Drop.figuresContainer.buttons.indexOf(Drag.cell);
                Drop.figuresContainer.buttons.splice(index, 1);
                Drop.figuresContainer.updateRects();
            }
        }
    }
}