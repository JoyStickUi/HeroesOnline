import {InfoBar} from "../../Components/UI/InfoBar/InfoBar.js";
import {Constants} from "../Constants.js";
import {Rect} from "../../Components/Rect/Rect.js";

export class UI{
    constructor(){
        this.infobar = new InfoBar(new Rect(Constants.window_rect.x, 0, Constants.window_rect.width, Constants.block_size));
    }

    render(context){
        this.infobar.render(context);
    }
}