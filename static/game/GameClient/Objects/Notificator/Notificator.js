import {Rect} from "../../Components/Rect/Rect.js";
import {Constants} from "../Constants.js";

export class Notificator{
	constructor(){
		this.rect = new Rect(0,Constants.window_rect.height / 2, Constants.window_rect.width, Constants.block_size);
		this.alpha = 0;
		this.state = "";
	}

	chargeState(state){
		this.state = state;
		this.alpha = 1;
	}

	render(context){
		if(this.alpha > 0){
			let old_font = context.font;
			context.font = "32px Arial";
			switch (this.state) {
				case "win":
				{
					context.fillStyle = "rgba(73,200,25," + this.alpha + ")";
					context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
					context.fillStyle = "rgba(0,0,0," + this.alpha + ")";
					context.fillText("win", this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2) + 8);
				}
				break;
				case "lose":
				{
					context.fillStyle = "rgba(200,16,29," + this.alpha + ")";
					context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
					context.fillStyle = "rgba(0,0,0," + this.alpha + ")";
					context.fillText("lose", this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2) + 8);
				}
				break;
				case "draw":
				{
					context.fillStyle = "rgba(162,157,157," + this.alpha + ")";
					context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
					context.fillStyle = "rgba(0,0,0," + this.alpha + ")";
					context.fillText("draw", this.rect.x + (this.rect.width / 2), this.rect.y + (this.rect.height / 2) + 8);
				}
				break;
			}
			this.alpha -= 0.001;
			context.font = old_font;
		}
	}
}