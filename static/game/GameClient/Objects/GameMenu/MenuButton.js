import {GameObject} from "../GameObject/GameObject.js";
import {Rect} from "../../Components/Rect/Rect.js";

export class MenuButton extends GameObject{
    constructor(callback, sprite_atlas) {
        super("menu_btn", sprite_atlas);
        this.callback = callback;

        this.animation.createState("default", new Rect(0, 0, 99, 50), 1);
        this.animation.createState("highlighted", new Rect(200, 0, 99, 50), 1);
        this.animation.createState("selected", new Rect(100, 0, 99, 50), 1);

        this.disabled = false;
    }

    render(context) {
        super.render(context);
        if(this.disabled)
        {
            context.fillStyle = "rgba(0,0,0,0.7)";
            context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        }
    }

    handleEvent(event_name, event_body){
        if(!this.disabled){
            if(this.rect.include_point(event_body.clientX, event_body.clientY)){
                switch (event_name) {
                    case "mouseup":
                    {
                        this.callback();
                        this.animation.restoreState();
                    }
                    break;
                    case "mousedown":
                    {
                        this.animation.changeState("selected");
                    }
                    break;
                    case "mousemove":
                    {
                        this.animation.changeState("highlighted");
                    }
                    break;
                    default: return;
                }
            }else{
                this.animation.restoreState();
            }
        }
    }
}