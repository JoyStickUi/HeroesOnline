import {EventManager} from "../../Components/EventManager/EventManager.js";
import {StartScene} from "../../Components/StartScene/StartScene.js";
import {LobbyScene} from "../../Components/LobbyScene/LobbyScene.js";
import {Constants} from "../Constants.js";
import {ServerMessagesQueue} from "../../Components/ServerMessagesQueue/ServerMessagesQueue.js";
import {GlobalGameStateController} from "../GlobalGameStateController/GlobalGameStateController.js";

export class GameMenu{
    constructor(context) {
        this.event_manager = new EventManager();
        this.event_manager.subscribers.set("connect", new Set());
        this.event_manager.subscribers.set("message", new Set());
        this.ws = null;
        this.context = context;
        this.currentScene = "start";
        this.opponent_connected = false;
        this.ready_player_amount = 0;
        this.isReady = false;
        //render components
        this.start_scene = new StartScene(()=>{
            if(this.start_scene.input_field.text != ""){
                this.ws = new WebSocket("ws://" + window.location.host + "/menu");
                this.init_ws();
            }
        }, ()=>{
            GlobalGameStateController.changeGameState("bridgehead");
        });

        this.lobby_scene = new LobbyScene(()=>{
            if(!this.isReady && this.opponent_connected)
                this.ws.send(JSON.stringify({
                    'type': 'ready',
                    'user': Constants.game_master
                }));
        }, ()=>{
            this.ws.send(JSON.stringify({
                'type': 'close'
            }));
            this.ws = null;
            this.currentScene = "start";
            this.context.fillStyle = "white";
            this.context.fillRect(0, 0, Constants.window_rect.width, Constants.window_rect.height);
        });

        this.closed = false;

        this.init_ws = ()=>{
            this.ws.onopen = (e)=>{
                this.currentScene = "lobby";
                this.context.fillStyle = "white";
                this.context.fillRect(0, 0, Constants.window_rect.width, Constants.window_rect.height);

                Constants.lobby_name = this.start_scene.input_field.text;

                this.ws.send(JSON.stringify({
                    'type': 'create_lobby',
                    'lobby_name': this.start_scene.input_field.text
                }));
            }

            this.ws.onmessage = (e)=>{
                let data = JSON.parse(e.data);
                switch (data['type']) {
                    case 'connect':
                    {
                        if(data['data']['user'] != Constants.game_master)
                            {this.event_manager.throwEvent("connect", data['data']);}
                        else{
                            this.event_manager.throwEvent("message", {
                                'user': 'Server',
                                'message': 'you joined to lobby named ' + data['data']['lobby_name']
                            });
                        }
                        this.opponent_connected = true;
                    }
                    break;
                    case 'ready':
                    {
                        this.ready_player_amount += 1;
                        if(this.opponent_connected && this.ready_player_amount == Constants.session_player_amount){
                            GlobalGameStateController.changeGameState("game");
                        }
                        if(data['user'] == Constants.game_master)
                        {
                            this.isReady = true;
                            this.lobby_scene.btn_start.disabled = true;
                        }
                    }
                    break;
                    case 'message':
                    {
                        this.event_manager.throwEvent("message", data['data']);
                    }
                    break;
                    case 'create_error':
                    {
                        this.ws.send(JSON.stringify({
                            'type': 'join_lobby',
                            'lobby_name': this.start_scene.input_field.text
                        }));
                    }
                    break;
                    case 'close':
                    {
                        this.ws.send(JSON.stringify(data));
                    }
                    break;
                    default: return;
                }
            }

            this.ws.onclose = (e)=>{
                this.isReady = false;
                this.opponent_connected = false;
                this.lobby_scene.btn_start.disabled = false;
                this.ready_player_amount = 0;
                this.lobby_scene = new LobbyScene(()=>{
                    if(!this.isReady && this.opponent_connected)
                        this.ws.send(JSON.stringify({
                            'type': 'ready',
                            'user': Constants.game_master
                        }));
                }, ()=>{
                    this.ws.send(JSON.stringify({
                        'type': 'close'
                    }));
                    this.ws = null;
                    this.currentScene = "start";
                    this.context.fillStyle = "white";
                    this.context.fillRect(0, 0, Constants.window_rect.width, Constants.window_rect.height);
                });

                this.currentScene = "start";
                this.context.fillStyle = "white";
                this.context.fillRect(0, 0, Constants.window_rect.width, Constants.window_rect.height);
            }
        }
    }

    handleEvent(event_name, event_body) {
        if(this.currentScene == "start"){
            this.start_scene.handleEvent(event_name, event_body);
        }else if(this.currentScene == "lobby"){
            this.lobby_scene.handleEvent(event_name, event_body);
        }
    }


    renderAll(){
        this.context.clearRect(Constants.window_rect.x, Constants.window_rect.y, Constants.window_rect.width, Constants.window_rect.height);
        if(this.currentScene == "start"){
            this.start_scene.render(this.context);
        }else if(this.currentScene == "lobby"){
            this.lobby_scene.render(this.context);
        }
    }

    start(){
        this.event_manager.subscribe("mouseup", this);
        this.event_manager.subscribe("mousedown", this);
        this.event_manager.subscribe("mousemove", this);
        this.event_manager.subscribe("keydown", this);
        this.event_manager.subscribe("wheel", this);
        this.event_manager.subscribe("connect", this);
        this.event_manager.subscribe("message", this);

        let menu_cycle = ()=>{
            this.renderAll();
            if(ServerMessagesQueue.to_send.length > 0 && !this.closed)
            {
                this.ws.send(JSON.stringify({
                    'type': 'message',
                    'data': ServerMessagesQueue.to_send.pop()
                }));
            }
            if(!this.closed) {
                requestAnimationFrame(menu_cycle);
            }else{
                this.context.clearRect(Constants.window_rect.x, Constants.window_rect.y, Constants.window_rect.width, Constants.window_rect.height);
            }
        }
        requestAnimationFrame(menu_cycle);
    }

    end(){
        this.closed = true;
        if(this.ws != null)
            this.ws.send(JSON.stringify({
                'type': 'close'
            }));
    }
}