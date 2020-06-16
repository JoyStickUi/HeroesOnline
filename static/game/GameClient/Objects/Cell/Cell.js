import {GameObject} from "../GameObject/GameObject.js";
import {Rect} from "../../Components/Rect/Rect.js";

export class Cell extends GameObject{
    constructor() {
        super("Cell", "/static/game/Images/cell_sprites.png");
        this.gameobject = null;

        this.animation.createState("default", new Rect(0, 0, 101, 100), 1);
        this.animation.createState("walkable", new Rect(100, 0, 101, 100), 1);
        this.animation.createState("could-be-attacked", new Rect(200, 0, 101, 100), 1);
        this.animation.createState("non-walkable", new Rect(300, 0, 101, 100), 1);
        this.animation.createState("highlighted", new Rect(400, 0, 101, 100), 1);
        this.animation.createState("selected", new Rect(500, 0, 101, 100), 1);
    }

    setObject(object){
        if(object != null){
            this.gameobject = object;
            this.gameobject.rect = new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            this.gameobject.showHealth = true;
            object.setPosition(this.x, this.y);
        }
    }

    moveObject(cell){
        if(cell.gameobject == null) {
            cell.setObject(this.gameobject);
            this.gameobject = null;
        }
    }

    render(context){
        super.render(context);
        if(this.gameobject != null){
            this.gameobject.render(context);
        }
    }

    handleEvent(event_name, event_body){
        if(this.rect.include_point(event_body.clientX, event_body.clientY)){
            switch (event_name) {
                case "mousemove":
                    if(this.gameobject != null && this.gameobject.couldBeMoved){
                        this.animation.changeState("selected");
                    }else{
                        this.animation.changeState("highlighted");
                    }
                    break;
            }
        }else{
            this.animation.restoreState();
        }
        if(this.gameobject && "handleEvent" in this.gameobject)this.gameobject.handleEvent(event_name, event_body);
    }

}