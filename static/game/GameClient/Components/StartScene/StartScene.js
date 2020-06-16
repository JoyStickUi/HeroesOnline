import {MenuButton} from "../../Objects/GameMenu/MenuButton.js";
import {Constants} from "../../Objects/Constants.js";
import {Rect} from "../Rect/Rect.js";
import {InputField} from "../../Objects/InputField/InputField.js";

export class StartScene{
    constructor(create_lobby_callback, bridgehead_editor_callback) {
        this.buttons = [];

        let btn_create_lobby = new MenuButton(create_lobby_callback, "/static/game/Images/MenuBtnLobby.png");
        let btn_bridgehead_editor = new MenuButton(bridgehead_editor_callback, "/static/game/Images/MenuBtnEditor.png");
        this.input_field = new InputField();

        this.buttons.push(this.input_field);
        this.buttons.push(btn_create_lobby);
        this.buttons.push(btn_bridgehead_editor);

        for(let i = 0; i < this.buttons.length; ++i){
            this.buttons[i].rect = new Rect(Constants.window_rect.width / 2 - Constants.block_size * 1.5, Constants.window_rect.height / 3 + (i * Constants.block_size * 1.5), Constants.block_size * 3, Constants.block_size);
        }

        this.input_field.evalLen();
    }

    handleEvent(event_name, event_body){
        for(let i = 0; i < this.buttons.length; ++i){
            this.buttons[i].handleEvent(event_name, event_body);
        }
    }

    render(context){
        for(let i = 0; i < this.buttons.length; ++i){
            this.buttons[i].render(context);
        }
    }
}