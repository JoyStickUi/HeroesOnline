import {MenuButton} from "../../Objects/GameMenu/MenuButton.js";
import {LobbyChat} from "../LobbyChat/LobbyChat.js";
import {Rect} from "../Rect/Rect.js";
import {Constants} from "../../Objects/Constants.js";
import {FriendsList} from "../FriendsList/FriendsList.js";

export class LobbyScene{
    constructor(start_game_callback, back_callback) {
        this.elements = [];

        this.btn_start = new MenuButton(start_game_callback, "/static/game/Images/MenuBtnStart.png");
        let btn_back = new MenuButton(back_callback, "/static/game/Images/MenuBtnBack.png");
        let lobbyChat = new LobbyChat(new Rect(0, 0, Constants.window_rect.width - Constants.block_size * 3, Constants.window_rect.height - Constants.nav_height));
        let friend_list = new FriendsList(new Rect(Constants.window_rect.width - Constants.block_size * 3, Constants.block_size * 2, Constants.block_size * 3, Constants.window_rect.height - Constants.nav_height));

        this.btn_start.rect = new Rect(Constants.window_rect.width - Constants.block_size * 3, 0, Constants.block_size * 3, Constants.block_size);
        btn_back.rect = new Rect(Constants.window_rect.width - Constants.block_size * 3, Constants.block_size, Constants.block_size * 3, Constants.block_size);

        this.elements.push(this.btn_start);
        this.elements.push(lobbyChat);
        this.elements.push(btn_back);
        this.elements.push(friend_list);
    }

    handleEvent(event_name, event_body){
        for(let i = 0; i < this.elements.length; ++i){
            this.elements[i].handleEvent(event_name, event_body);
        }
    }

    render(context){
        for(let i = 0; i < this.elements.length; ++i){
            this.elements[i].render(context);
        }
    }
}