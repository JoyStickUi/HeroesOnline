import {Constants} from "../Constants.js";

export class GlobalGameStateController{
    static state_classes = new Map();
    static current_state = null;

    static add_class_and_state(state, creation_method){
        GlobalGameStateController.state_classes.set(state, creation_method);
    }

    static changeGameState(state){
        GlobalGameStateController.current_state = state;
        if(Constants.game != null && !Constants.game.closed)
            Constants.game.end();
        Constants.game = null;
        if(Constants.game_editor != null && !Constants.game_editor.closed)
            Constants.game_editor.end();
        Constants.game_editor = null;
        if(Constants.game_menu != null && !Constants.game_menu.closed)
            Constants.game_menu.end();
        Constants.game_menu = null;
        GlobalGameStateController.state_classes.get(state)();
    }
}