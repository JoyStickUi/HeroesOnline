import {Rect} from "../Components/Rect/Rect.js";

export class Constants{
    static game = null;
    static game_editor = null;
    static game_menu = null;

    static session_player_amount = 2;
    static block_size = (window.innerWidth + window.innerHeight) / 30;
    static x_field_block_amount = 15;
    static y_field_block_amount = 7;
    static x_bridgehead_block_amount = 2;
    static y_bridgehead_block_amount = 7;
    static window_rect = new Rect(0,0, window.innerWidth, window.innerHeight);
    static lobby_name = null;
    static nav_height = 56;
    static game_master = "None";
    static c_window_delta_field = {
        x_delta: (window.innerWidth / 2) - ((Constants.block_size * Constants.x_field_block_amount) / 2),
        y_delta: (window.innerHeight / 2) - ((Constants.block_size * Constants.y_field_block_amount) / 2)
    }
    static field_rect = new Rect(
        Constants.c_window_delta_field.x_delta,
        Constants.c_window_delta_field.y_delta + Constants.nav_height,
        (Constants.x_field_block_amount * Constants.block_size) + Constants.c_window_delta_field.x_delta,
        (Constants.y_field_block_amount * Constants.block_size) + Constants.c_window_delta_field.y_delta
    );

    static setWindowRect(rect){
        Constants.window_rect = rect;

        Constants.block_size = (window.innerWidth + window.innerHeight) / 30;

        Constants.c_window_delta_field = {
            x_delta: (window.innerWidth / 2) - ((Constants.block_size * Constants.x_field_block_amount) / 2),
            y_delta: (window.innerHeight / 2) - ((Constants.block_size * Constants.y_field_block_amount) / 2)
        }

        Constants.nav_height = document.querySelector("nav").clientHeight;

        Constants.field_rect.x = Constants.c_window_delta_field.x_delta;
        Constants.field_rect.y = Constants.c_window_delta_field.y_delta + Constants.nav_height;
        Constants.field_rect.width = (Constants.x_field_block_amount * Constants.block_size) + Constants.c_window_delta_field.x_delta;
        Constants.field_rect.height = (Constants.y_field_block_amount * Constants.block_size) + Constants.c_window_delta_field.y_delta;
    }
}