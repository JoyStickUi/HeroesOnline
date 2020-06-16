import {Constants} from "../../Objects/Constants.js";
import {Rect} from "../Rect/Rect.js";
import {Button} from "../../Objects/Button/Button.js";
import {Drag} from "../../Components/Drag&Drop/drag.js";
import {Drop} from "../Drag&Drop/drop.js";

export class FiguresContainer{
    constructor(rect) {
        this.buttons = [];
        this.rect = rect;
        this.scroll = 0;
        this.buttons_per_scroll = 4;       

        Drop.figuresContainer = this;

        fetch('http://' + window.location.host + '/api/user/' + document.getElementById('user').textContent.trim() + '/figures/not/landed')
            .then(response=>response.json())
            .then(figures=>{                
                for(let i = 0; i < figures['NotLanded'].length; ++i){
                    let button = new Button(figures['NotLanded'][i]['name']);
                    button.rect = new Rect(this.rect.x + this.rect.width / 2 - Constants.block_size, this.rect.y + (i *  Constants.block_size * 2.5) + Constants.block_size, Constants.block_size * 2, Constants.block_size * 2);
                    button.gameobject.rect = new Rect(button.rect.x, button.rect.y, button.rect.width, button.rect.height);
                    button.gameobject.id = figures['NotLanded'][i]['id'];
                    this.buttons.push(button);                    
                }
            })
            .catch(error=>console.log(error));
    }

    handleEvent(event_name, event_body){
        switch (event_name) {
            case "keydown":
            {
                if(event_body.key == "Escape"){
                    Drag.discharge();
                }
            }
            break;
            case "wheel":
            {
                this.scroll += event_body.deltaY > 0 ? 1 : -1;
                this.scroll = this.scroll < 0 ? 0 : this.scroll;
                this.scroll = this.scroll >= this.buttons.length ? this.buttons.length - 1 : this.scroll;
                this.updateRects();
            }
            break;
            case 'mousedown':
            case 'mouseup':
            case 'mousemove':
            {
                for(let i = this.scroll; i < this.scroll + this.buttons_per_scroll; ++i){
                    if(i >= 0 && i < this.buttons.length)
                    {
                       this.buttons[i].handleEvent(event_name, event_body);                       
                    }
                }
            }
            break;
            default: return;
        }
    }

    updateRects(){
        for(let i = this.scroll; i < this.scroll + this.buttons_per_scroll; ++i){
            if(i >= 0 && i < this.buttons.length)
            {
               this.buttons[i].rect = new Rect(this.rect.x + this.rect.width / 2 - Constants.block_size, this.rect.y + ((i - this.scroll) *  Constants.block_size * 2.5) + Constants.block_size, Constants.block_size * 2, Constants.block_size * 2);
               this.buttons[i].gameobject.rect = new Rect(this.buttons[i].rect.x, this.buttons[i].rect.y, this.buttons[i].rect.width, this.buttons[i].rect.height);
            }
        }
    }

    render(context){
        context.fillStyle = "rgb(89,72,255)";
        context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        for(let i = this.scroll; i < this.scroll + this.buttons_per_scroll; ++i){
            if(i >= 0 && i < this.buttons.length){
                this.buttons[i].render(context);
            }            
        }
    }
}