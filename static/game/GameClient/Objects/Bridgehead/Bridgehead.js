import {Constants} from "../Constants.js";
import {Cell} from "../Cell/Cell.js";
import {Button} from "../Button/Button.js";
import {Drag} from "../../Components/Drag&Drop/drag.js";
import {Drop} from "../../Components/Drag&Drop/drop.js";
import {Figures} from "../Figures/Figures.js";

export class Bridgehead{
    constructor(bg_image_url) {
        this.img_bg = new Image();
        this.img_bg.src = bg_image_url;
        this.cell_container = [];

        Drag.bridgehead = this;

        for(let i = 0; i < Constants.x_bridgehead_block_amount; ++i){
            this.cell_container.push([]);
            for(let j = 0; j < Constants.y_bridgehead_block_amount; ++j){
                let cell = new Cell(i, j);
                cell.setPosition(i, j);
                this.cell_container[i].push(cell);
                Drop.subscribe(cell);
            }
        }

        fetch('http://' + window.location.host + '/api/user/' + document.getElementById('user').textContent.trim() + '/figures/landed')
            .then(response=>response.json())
            .then(figures=>{                
                for(let i = 0; i < figures['Landed'].length; ++i){
                    let figure = new (Figures.get_figure(figures['Landed'][i]['name']))(false);
                    figure.id = figures['Landed'][i]['id'];
                    this.cell_container[figures['Landed'][i]['x']][figures['Landed'][i]['y']].setObject(figure);
                }
            })
            .catch(error=>console.log(error));
    }

    handleEvent(event_name, event_body){
        switch (event_name) {
            case "mousedown":
            {
                let x = Math.floor((event_body.clientX - Constants.c_window_delta_field.x_delta) / Constants.block_size);
                let y = Math.floor((event_body.clientY - Constants.nav_height - Constants.c_window_delta_field.y_delta) / Constants.block_size);
                if(x < Constants.x_bridgehead_block_amount && x >= 0 && y < Constants.y_bridgehead_block_amount && y >= 0 && this.cell_container[x][y].gameobject != null){
                    let button = new Button(this.cell_container[x][y].gameobject.name);
                    button.gameobject.id = this.cell_container[x][y].gameobject.id;
                    button.gameobject.isEnemy = true;
                    button.gameobject.updateStates();
                    Drop.figuresContainer.buttons.push(button);                    
                    Drop.figuresContainer.updateRects();
                    this.cell_container[x][y].gameobject = null;
                }
            }
            break;
            case "mouseup":
            {
                Drop.drop(event_body);
            }
            break;
            default: return;
        }
    }

    render(context){
        if(this.img_bg.complete)context.drawImage(this.img_bg, Constants.window_rect.x, Constants.window_rect.y, Constants.window_rect.width, Constants.window_rect.height);

        for(let i = 0; i < Constants.x_bridgehead_block_amount; ++i){
            for(let j = 0; j < Constants.y_bridgehead_block_amount; ++j){
                this.cell_container[i][j].render(context);
            }
        }
    }

}