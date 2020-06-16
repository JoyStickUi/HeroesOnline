import {Animation} from "../../Components/Animation/Animation.js";
import {Rect} from '../../Components/Rect/Rect.js';
import {Constants} from "../Constants.js";

export class GameObject{
    constructor(name, sprite_atlas_url) {
        this.rect = new Rect(0, 0, Constants.block_size, Constants.block_size);
        this.animation = new Animation(name, sprite_atlas_url);
        this.x = 0;
        this.y = 0;
        this.name = name;
        this.id = null;
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
        this.rect.x = (x * Constants.block_size) + Constants.c_window_delta_field.x_delta;
        this.rect.y = (y * Constants.block_size) + Constants.c_window_delta_field.y_delta;
    }

    handleEvent(event_name, event_body){

    }
    
    render(context){
        this.animation.draw(context, this.rect);
    }
}