import {EventManager} from "../../Components/EventManager/EventManager.js";
import {GameField} from "../GameField/GameField.js";
import {ServerMessagesQueue} from "../../Components/ServerMessagesQueue/ServerMessagesQueue.js";
import {UI} from "../UI/UI.js";
import {Notificator} from "../Notificator/Notificator.js";

import {Figures} from "../Figures/Figures.js";
import {Constants} from "../Constants.js";
import {GlobalGameStateController} from "../GlobalGameStateController/GlobalGameStateController.js";

export class Game{
    constructor(context, websocket, window_rect){
        this.context = context;
        this.ws = websocket;
        this.window_rect = window_rect;
        this.event_manager = new EventManager();
        this.game_field = new GameField("/static/game/Images/bg.png");
        this.ui = new UI();
        this.closed = false;
        this.notificator = new Notificator();
    }

    handleEvent(event_name, event_body){
        if(event_body.code == "Space")
        {
            this.game_field.end_turn();
            this.sendMessagesToServer();
        }
        if(event_body.key == "Backspace")
        {
            this.ws.send(JSON.stringify({
                'type': 'close'
            }));
            GlobalGameStateController.changeGameState("menu");
        }
    }

    sendMessagesToServer() {
        this.ws.send(JSON.stringify({
            'type': 'game',
            'user': Constants.game_master,
            'actions': ServerMessagesQueue.to_send
        }));
        ServerMessagesQueue.to_send = [];
    }

    handleServerRequest(data){
        this.ui.infobar.turn = data['turn'];

        if(data['user'] != Constants.game_master){
            for(let action of data['actions']){
                if (action['master'] != Constants.game_master) {
                    setTimeout(() => {
                        let from_x = action['from_x'];
                        let from_y = action['from_y'];
                        let to_x = action['to_x'];
                        let to_y = action['to_y'];
                        from_x = data['left'] != Constants.game_master ? Constants.x_field_block_amount - from_x - 1 : from_x;
                        to_x = data['left'] != Constants.game_master ? Constants.x_field_block_amount - to_x - 1 : to_x;
                        switch (action['type']) {
                            case 'attack': {
                                this.game_field.attackFigure(from_x, from_y, to_x, to_y);
                            }
                                break;
                            case 'move': {
                                this.game_field.moveObject(from_x, from_y, to_x, to_y);
                            }
                                break;
                        }
                    }, 0);
                }
            }
        }

        setTimeout(()=>{
            this.game_field.setTurn(data['turn']);
        }, 0);
    }

    renderAll(){
        this.game_field.render(this.context);
        this.ui.render(this.context);
        this.notificator.render(this.context);
    }

    init(server_data){
        this.ui.infobar.turn = server_data['turn'];

        setTimeout(()=> {
            for (let figure of server_data['field']) {
                let x = figure['x'];
                if (figure['master'] == Constants.game_master) {
                    x = x > Math.floor(Constants.x_field_block_amount / 2) ? Constants.x_field_block_amount - x - 1 : x;
                } else {
                    x = x < Math.round(Constants.x_field_block_amount / 2) ? Constants.x_field_block_amount - x - 1 : x;
                }
                let object = new (Figures.get_figure(figure['name']))(figure['master'] != Constants.game_master);
                object.setProps(figure['props']);
                this.game_field.setObject(object, x, figure['y']);
            }
        }, 0);
        setTimeout(()=>{
            this.game_field.setTurn(server_data['turn']);
        }, 0);
        this.start();
    }

    start(){
        this.event_manager.subscribe('keydown', this);
        this.event_manager.subscribe("mousedown", this.game_field);
        this.event_manager.subscribe("mouseup", this.game_field);
        this.event_manager.subscribe("keydown", this.game_field);
        this.event_manager.subscribe("mousedown", this.ui.infobar.btn_back);
        this.event_manager.subscribe("mouseup", this.ui.infobar.btn_back);
        this.event_manager.subscribe("mousemove", this.ui.infobar.btn_back);

        for(let i = 0; i < this.game_field.field_matrix.length; ++i){
            for(let j = 0; j < this.game_field.field_matrix[0].length; ++j){
                this.event_manager.subscribe("mousemove", this.game_field.field_matrix[i][j]);
            }
        }

        //starting game cycle
        let game_cycle = ()=>{
            this.renderAll();
            if(!this.closed) {
                requestAnimationFrame(game_cycle);
            }else{
                this.context.clearRect(this.window_rect.x, this.window_rect.y, this.window_rect.width, this.window_rect.height);
            }
        }
        requestAnimationFrame(game_cycle);
    }

    end(){
        this.closed = true;
        this.ws.send(JSON.stringify({
                'type': 'close'
            }));
    }
}