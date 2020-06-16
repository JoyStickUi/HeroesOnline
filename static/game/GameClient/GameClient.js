import {Game} from './Objects/Game/Game.js';
import {Rect} from './Components/Rect/Rect.js';
import {Constants} from "./Objects/Constants.js";
import {GameEditor} from "./Objects/GameEditor.js";
import {Drag} from "./Components/Drag&Drop/drag.js";
import {GameMenu} from "./Objects/GameMenu/GameMenu.js";
import {GlobalGameStateController} from "./Objects/GlobalGameStateController/GlobalGameStateController.js";

window.onload = function(){
    let canvas = document.querySelector("canvas");
    let nav_bar = document.querySelector("nav");
    let window_rect = new Rect(0, 0, window.innerWidth, window.innerHeight - nav_bar.clientHeight);

    canvas.width = window_rect.width;
    canvas.height = window_rect.height;

    Constants.game_master = document.getElementById('user').textContent.trim();


    try {
        document.addEventListener("mousedown", (e) => {
            if(Constants.game != null && GlobalGameStateController.current_state == "game")Constants.game.event_manager.throwEvent("mousedown", e);
            if(Constants.game_editor != null && GlobalGameStateController.current_state == "bridgehead")Constants.game_editor.event_manager.throwEvent("mousedown", e);
            if(Constants.game_menu != null && GlobalGameStateController.current_state == "menu")Constants.game_menu.event_manager.throwEvent("mousedown", e);
        });

        document.addEventListener("mouseup", (e) => {
            if(Constants.game != null && GlobalGameStateController.current_state == "game")Constants.game.event_manager.throwEvent("mouseup", e);
            if(Constants.game_editor != null && GlobalGameStateController.current_state == "bridgehead")Constants.game_editor.event_manager.throwEvent("mouseup", e);
            if(Constants.game_menu != null && GlobalGameStateController.current_state == "menu")Constants.game_menu.event_manager.throwEvent("mouseup", e);
        });

        document.addEventListener("mousemove", (e) => {
            if(Constants.game != null && GlobalGameStateController.current_state == "game")Constants.game.event_manager.throwEvent("mousemove", e);
            if(Constants.game_editor != null && GlobalGameStateController.current_state == "bridgehead")Constants.game_editor.event_manager.throwEvent("mousemove", e);
            if(Constants.game_menu != null && GlobalGameStateController.current_state == "menu")Constants.game_menu.event_manager.throwEvent("mousemove", e);
            Drag.holdPickedFigure(e);
        });

        document.addEventListener("keydown", (e) => {
            if(Constants.game != null && GlobalGameStateController.current_state == "game")Constants.game.event_manager.throwEvent("keydown", e);
            if(Constants.game_editor != null && GlobalGameStateController.current_state == "bridgehead")Constants.game_editor.event_manager.throwEvent("keydown", e);
            if(Constants.game_menu != null && GlobalGameStateController.current_state == "menu")Constants.game_menu.event_manager.throwEvent("keydown", e);
        });

        document.addEventListener("keyup", (e) => {
            if(Constants.game != null && GlobalGameStateController.current_state == "game")Constants.game.event_manager.throwEvent("keyup", e);
            if(Constants.game_editor != null && GlobalGameStateController.current_state == "bridgehead")Constants.game_editor.event_manager.throwEvent("keyup", e);
            if(Constants.game_menu != null && GlobalGameStateController.current_state == "menu")Constants.game_menu.event_manager.throwEvent("keyup", e);
        });

        document.addEventListener("wheel", (e)=>{
            if(Constants.game_menu != null && GlobalGameStateController.current_state == "menu")Constants.game_menu.event_manager.throwEvent("wheel", e);
            if(Constants.game_editor != null && GlobalGameStateController.current_state == "bridgehead")Constants.game_editor.event_manager.throwEvent("wheel", e);
        });

        window.addEventListener("resize", window_resize);

        GlobalGameStateController.add_class_and_state("game", game_session_handlers);
        GlobalGameStateController.add_class_and_state("menu", game_menu_creator);
        GlobalGameStateController.add_class_and_state("bridgehead", bridgehead_creator);

        GlobalGameStateController.changeGameState("menu");

    } catch (e) {
        alert(e);
    }

    function window_resize(e){
        window_rect.width = window.innerWidth;
        window_rect.height = window.innerHeight - nav_bar.clientHeight;

        canvas.width = window_rect.width;
        canvas.height = window_rect.height;

        if(Constants.game && GlobalGameStateController.current_state == "game")Constants.game.window_rect = window_rect;
        if(Constants.game_editor && GlobalGameStateController.current_state == "bridgehead")Constants.game_editor.window_rect = window_rect;
        if(Constants.game && GlobalGameStateController.current_state == "game")Constants.game.event_manager.throwEvent("windowresize", e);
        if(Constants.game_editor && GlobalGameStateController.current_state == "bridgehead")Constants.game_editor.event_manager.throwEvent("windowresize", e);
        if(Constants.game_menu != null && GlobalGameStateController.current_state == "menu")Constants.game_menu.event_manager.throwEvent("windowresize", e);
        Constants.setWindowRect(window_rect);
    }

    function bridgehead_creator(){
        Constants.game_editor = new GameEditor(canvas.getContext("2d"), window_rect);
        Constants.game_editor.start();
    }

    function game_menu_creator(){
        Constants.game_menu = new GameMenu(canvas.getContext("2d"));
        Constants.game_menu.start();
    }

    function game_session_handlers(){
        let websocket = new WebSocket("ws://" + window.location.host + "/session/" + Constants.lobby_name);

        websocket.onopen = function () {
            Constants.game = new Game(canvas.getContext("2d"), websocket, window_rect);

            websocket.send(JSON.stringify({
                'type': 'init',
                'user': Constants.game_master
            }));
        }

        websocket.onmessage = function (e) {
            let data = JSON.parse(String(e.data));
            switch (data['type']) {
                case 'init':
                {
                    Constants.game.init(data);
                }
                break;
                case 'game':
                {
                    Constants.game.handleServerRequest(data);
                }
                break;
                case 'close':
                {
                    websocket.send(JSON.stringify(data));
                    GlobalGameStateController.changeGameState("menu");
                }
                break;
                case 'game_end':
                {
                    let winner = data['winner'];
                    if(winner == Constants.game_master){
                       Constants.game.notificator.chargeState("win");
                    }else{
                        Constants.game.notificator.chargeState("lose");
                    }
                }
                break;
            }
        }

        websocket.onclose = function () {
            GlobalGameStateController.changeGameState("menu");
        }
    }
}