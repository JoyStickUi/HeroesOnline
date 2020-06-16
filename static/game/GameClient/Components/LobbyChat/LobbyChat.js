import {InputField} from "../../Objects/InputField/InputField.js";
import {Constants} from "../../Objects/Constants.js";
import {Rect} from "../Rect/Rect.js";
import {ServerMessagesQueue} from "../ServerMessagesQueue/ServerMessagesQueue.js";

export class LobbyChat{
    constructor(rect) {
        this.inputs = [];
        this.rect = rect;

        this.messages = [];

        this.input_field = new InputField();
        this.input_field.rect = new Rect(10, this.rect.height - 60, this.rect.width - 20, 50);
        this.input_field.evalLen();
        this.inputs.push(this.input_field);
        this.last_comments_amount = Constants.window_rect.height / (Constants.block_size / 1.5);
    }

    addMessage(sender, message){
        this.messages.push({
            'message': sender + ": " + message
        });
        if(this.messages.length > this.last_comments_amount)
            this.messages.shift();
    }

    handleEvent(event_name, event_body){
        for(let i = 0; i < this.inputs.length; ++i){
            this.inputs[i].handleEvent(event_name, event_body);
        }
        if(event_name == "keydown" && event_body.key == "Enter"){
            if(this.input_field.text != ""){
                ServerMessagesQueue.addToSendMessage({
                    'user': Constants.game_master,
                    'message': this.input_field.text
                });
                if(this.messages.length > this.last_comments_amount)
                    this.messages.shift();
                this.input_field.restore();
            }
        }
        if(event_name == "connect"){
            this.addMessage("Server", event_body['user'] + " join your lobby");
        }
        if(event_name == "message"){
            this.addMessage(event_body['user'], event_body['message']);
        }
    }

    render(context){
        context.fillStyle = "rgb(60,57,255)";
        context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        let old_font = context.font;
        context.font = "16px Arial";
        context.fillStyle = "black";
        //fix it
        for(let i = 0; i < this.messages.length; ++i){
            context.fillText(this.messages[i].message, this.rect.x + 10, this.rect.y + (Constants.block_size / 2 * i) + Constants.block_size / 2);
        }
        context.font = old_font;

        for(let i = 0; i < this.inputs.length; ++i){
            this.inputs[i].render(context);
        }
    }
}