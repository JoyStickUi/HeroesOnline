import {Figures} from "../Figures/Figures.js";
import {Cell} from "../Cell/Cell.js";
import {Drag} from "../../Components/Drag&Drop/drag.js";
import {Rect} from "../../Components/Rect/Rect.js";

export class Button extends Cell{
    constructor(figure_name) {
        super();
        this.gameobject = new (Figures.get_figure(figure_name))(true);
        this.gameobject.showHealth = false;
    }

    setObject(object){
        if(object != null){
            this.gameobject = object;
            object.setPosition(this.x, this.y);
            this.gameobject.rect = new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            this.gameobject.showHealth = false;
        }
    }

    handleEvent(event_name, event_body){
        if(this.rect.include_point(event_body.clientX, event_body.clientY)){
            switch (event_name) {
                case "mousemove":
                    this.animation.changeState("highlighted");
                    break;
                case 'mousedown':
                    this.animation.changeState("selected");
                    Drag.drag(this);
                    break;
                case 'mouseup':
                    this.animation.restoreState();
                    break;
            }
        }else{
            this.animation.restoreState();
        }
    }

}