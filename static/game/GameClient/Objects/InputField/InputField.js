import {GameObject} from "../GameObject/GameObject.js";
import {Rect} from "../../Components/Rect/Rect.js";

export class InputField extends GameObject{
    constructor() {
        super("inputfield", "/static/game/Images/InputField.png");
        this.text = "";
        this.max_length = 0;
        this.isSelected = false;
        
        this.animation.createState("default", new Rect(0, 0, 200, 50), 1);
        this.animation.createState("selected", new Rect(200, 0, 200, 50), 1);
    }

    handleEvent(event_name, event_body){
        if(event_name == "keydown"){
            if(event_body.keyCode == 8){
                this.text = this.text.slice(0, this.text.length - 1);
            }else{
                if(this.isSelected && this.text.length + 1 < this.max_length)
                    this.text += event_body.key.length > 1 ? "" : event_body.key;
            }
        }
        if(event_name == "mousedown"){
            if(this.rect.include_point(event_body.clientX, event_body.clientY)){
                this.isSelected = true;
                this.animation.changeState("selected");
            }else{
                this.isSelected = false;
                this.animation.restoreState();
            }
        }
    }

    evalLen(){
        this.max_length = (this.rect.width - 32) / 9;
    }

    restore(){
        this.text = "";
    }

    render(context){
        super.render(context);
        let oldfont = context.font;
        context.fillStyle = "black";
        context.font = "16px Arial";
        context.fillText(this.text.length > this.max_length ? this.text.slice(0, this.max_length) : this.text, this.rect.x + 16, (this.rect.y + this.rect.height / 2) + 4);
        context.font = oldfont;
    }
}