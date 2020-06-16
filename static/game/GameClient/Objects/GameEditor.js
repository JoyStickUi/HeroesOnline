import {EventManager} from "../Components/EventManager/EventManager.js";
import {Bridgehead} from "./Bridgehead/Bridgehead.js";
import {Constants} from "./Constants.js";
import {FiguresContainer} from "../Components/FiguresContainer/FiguresContainer.js";
import {Rect} from "../Components/Rect/Rect.js";
import {GlobalGameStateController} from "./GlobalGameStateController/GlobalGameStateController.js";
import {MenuButton} from "./GameMenu/MenuButton.js";

export class GameEditor{
    constructor(context, window_rect) {
        this.context = context;
        this.event_manager = new EventManager();
        this.bridgehead = new Bridgehead("/static/game/Images/bg.png");
        this.figuresContainer = new FiguresContainer(
            new Rect(window_rect.width - window_rect.width / 3, window_rect.y, window_rect.width / 3, window_rect.height)
            );
        this.btn_save = new MenuButton(()=>{
            let bridgehead = [];
            for(let i = 0; i < Constants.x_bridgehead_block_amount; ++i){
                for(let j = 0; j < Constants.y_bridgehead_block_amount; ++j){
                    if(this.bridgehead.cell_container[i][j].gameobject != null){
                        bridgehead.push(this.bridgehead.cell_container[i][j].gameobject.getPositionReport());
                    }
                }
            }
            let formdata = new FormData();
            formdata.append("bridgehead", JSON.stringify(bridgehead));
            formdata.append('csrfmiddlewaretoken', document.querySelector("input[name='csrfmiddlewaretoken']").value);
            fetch('http://' + window.location.host + '/api/game/editor/save/bridgehead', {
                method: 'POST',
                body: formdata,
                credentials: 'same-origin'
            })
                .then(response=>response.text())
                .then(response=>{
                    console.log(response);
                })
                .catch(error=>console.log(error));
        }, "/static/game/Images/MenuBtnSave.png");
        this.btn_save.rect = new Rect(this.figuresContainer.rect.x - (Constants.block_size * 6), Constants.window_rect.height - Constants.block_size - Constants.nav_height, Constants.block_size * 3, Constants.block_size);
        this.btn_back = new MenuButton(()=>{
            GlobalGameStateController.changeGameState("menu");
        }, "/static/game/Images/MenuBtnBack.png");
        this.btn_back.rect = new Rect(this.figuresContainer.rect.x - (Constants.block_size * 3), Constants.window_rect.height - Constants.block_size - Constants.nav_height, Constants.block_size * 3, Constants.block_size);
        this.window_rect = window_rect;
        this.closed = false;
    }

    renderAll(){
        this.bridgehead.render(this.context);
        this.figuresContainer.render(this.context);
        this.btn_save.render(this.context);
        this.btn_back.render(this.context);
    }

    handleEvent(event_name, event_body){

    }

    start(){
        this.event_manager.subscribe('keydown', this);

        for(let i = 0; i < Constants.x_bridgehead_block_amount; ++i){
            for(let j = 0; j < Constants.y_bridgehead_block_amount; ++j){
                this.event_manager.subscribe("mousemove", this.bridgehead.cell_container[i][j]);
                this.event_manager.subscribe("mousedown", this.bridgehead.cell_container[i][j]);
                this.event_manager.subscribe("mouseup", this.bridgehead.cell_container[i][j]);
            }
        }

        this.event_manager.subscribe("mousemove", this.bridgehead);
        this.event_manager.subscribe("mouseup", this.bridgehead);
        this.event_manager.subscribe("mousedown", this.bridgehead);
        this.event_manager.subscribe("keydown", this.figuresContainer);
        this.event_manager.subscribe("wheel", this.figuresContainer);
        this.event_manager.subscribe("mousemove", this.figuresContainer);
        this.event_manager.subscribe("mouseup", this.figuresContainer);
        this.event_manager.subscribe("mousedown", this.figuresContainer);
        this.event_manager.subscribe("mousemove", this.btn_save);
        this.event_manager.subscribe("mouseup", this.btn_save);
        this.event_manager.subscribe("mousedown", this.btn_save);
        this.event_manager.subscribe("mousemove", this.btn_back);
        this.event_manager.subscribe("mouseup", this.btn_back);
        this.event_manager.subscribe("mousedown", this.btn_back);

        //starting draw cycle
        let draw_cycle = ()=>{
            this.renderAll();
            if(!this.closed) {
                requestAnimationFrame(draw_cycle);
            }else{
                this.context.clearRect(this.window_rect.x, this.window_rect.y, this.window_rect.width, this.window_rect.height);
            }
        }
        requestAnimationFrame(draw_cycle);
    }

    end(){
        this.closed = true;
    }
}