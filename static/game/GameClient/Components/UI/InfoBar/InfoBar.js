import {Animation} from "../../Animation/Animation.js";
import {Rect} from "../../Rect/Rect.js";
import {MenuButton} from "../../../Objects/GameMenu/MenuButton.js";
import {GlobalGameStateController} from "../../../Objects/GlobalGameStateController/GlobalGameStateController.js";
import {Constants} from "../../../Objects/Constants.js";

export class InfoBar{
    constructor(rect) {
        this.animation = new Animation("InfoBar", "/static/game/Images/InfoBar.png");
        this.rect = rect;
        this.turn = "No one";

        this.btn_back = new MenuButton(()=>{
            GlobalGameStateController.changeGameState("menu");
        }, "/static/game/Images/MenuBtnBack.png");

        this.btn_back.rect = new Rect(this.rect.width - (this.rect.height * 3), this.rect.y, this.rect.height * 3, this.rect.height);

        this.animation.createState("default", new Rect(0, 0, 600, 100), 1);
    }

    handleEvent(event_name, event_body){
        this.btn_back.handleEvent(event_name, event_body);
    }

    render(context){
        this.animation.draw(context, this.rect);
        let old_font = context.font;
        context.font = "16px Arial";
        context.fillStyle = "white";
        context.fillText("Ход: " + this.turn, this.rect.x + 8, this.rect.y + this.rect.height / 2 + 8);
        context.font = old_font;
        this.btn_back.render(context);
    }
}