import {Rect} from "../Rect/Rect.js";
import {Constants} from "../../Objects/Constants.js";
import {MenuButton} from "../../Objects/GameMenu/MenuButton.js";

export class FriendsList{
    constructor(rect) {
        this.friends = [];
        this.index_selectedFriend = null;
        this.rect = rect;
        this.scroll = 0;
        this.max_friend_on_screen = 9;

        fetch("http://" + window.location.host + "/api/user/" + document.getElementById('user').textContent.trim() + "/friends")
            .then(response=>response.json())
            .then(friends=>{
                let index = 0;
                for(let friend of friends['data']){
                    this.friends.push({
                        'text_rect': null,
                        'info': friend,
                        'rect':  null,
                        'state': null,
                        'default_state': null
                    });
                    ++index;
                }
                this.updateRects();
            })
            .catch(error=>console.log(error));

        this.btn_invite = new MenuButton(()=>{
            if(this.index_selectedFriend != null){
                fetch("http://" + window.location.host + '/api/user/' + this.friends[this.index_selectedFriend]['info'] + '/send/invite')
                    .then(response=>response.json())
                    .then(response=>{
                        console.log("invitation sent");
                    })
                    .catch(error=>console.log(error));
            }
        }, "/static/game/Images/MenuBtnInvite.png");

        this.btn_invite.rect = new Rect(this.rect.x, this.rect.height - Constants.block_size, Constants.block_size * 3, Constants.block_size);
    }

    handleEvent(event_name, event_body){
        switch (event_name) {
            case 'mousemove':
            {
                for(let i = this.scroll; i < this.scroll + this.max_friend_on_screen; ++i){
                    if(i >= 0 && i < this.friends.length)
                        if(this.friends[i]['rect'].include_point(event_body.clientX, event_body.clientY))
                        {
                            this.friends[i]['state'] = 'highlighted';
                        }else{
                            this.friends[i]['state'] = this.friends[i]['default_state'];
                        }
                }
            }
            break;
            case 'mousedown':
            {
                for(let i = this.scroll; i < this.scroll + this.max_friend_on_screen; ++i){
                    if(i >= 0 && i < this.friends.length)
                        if(this.friends[i]['rect'].include_point(event_body.clientX, event_body.clientY))
                        {
                            this.index_selectedFriend = i;
                        }
                }
            }
            break;
            case 'mouseup':
            {

            }
            break;
            case 'wheel':
            {
                this.scroll += event_body.deltaY > 0 ? 1 : -1;
                this.scroll = this.scroll < 0 ? 0 : this.scroll;
                this.scroll = this.scroll >= this.friends.length ? this.friends.length - 1 : this.scroll;
                this.updateRects();
            }
            break;
        }
        this.btn_invite.handleEvent(event_name, event_body);
    }

    updateRects(){
        for(let i = this.scroll; i < this.scroll + this.max_friend_on_screen; ++i){
            if(i >= 0 && i < this.friends.length)
            {
                this.friends[i]['rect'] = new Rect(this.rect.x, this.rect.y + ((i - this.scroll) * Constants.block_size), Constants.block_size * 3, Constants.block_size);
                this.friends[i]['text_rect'] = new Rect(this.rect.x, this.friends[i]['rect'].y + (Constants.block_size / 2), 0, 0);
            }
        }
    }

    render(context){
        let oldfont =  context.font;
        for(let i = this.scroll; i < this.scroll + this.max_friend_on_screen; ++i){
             context.font = "16px Arial";
             if(i >= 0 && i < this.friends.length)
             {
                 context.strokeStyle = "black";
                 context.strokeRect(this.friends[i]['rect'].x, this.friends[i]['rect'].y, this.friends[i]['rect'].width, this.friends[i]['rect'].height);
                 if(this.index_selectedFriend == i){
                     context.fillStyle = "rgba(255,222,34,0.8)";
                     context.fillRect(this.friends[i]['rect'].x, this.friends[i]['rect'].y, this.friends[i]['rect'].width, this.friends[i]['rect'].height);
                 }else{
                     switch (this.friends[i]['state']) {
                         case 'highlighted':
                             context.fillStyle = "rgba(217,255,70,0.8)";
                             context.fillRect(this.friends[i]['rect'].x, this.friends[i]['rect'].y, this.friends[i]['rect'].width, this.friends[i]['rect'].height);
                             break;
                     }
                 }
                 context.fillStyle = "blue";
                 context.fillText(this.friends[i]['info'], this.friends[i]['text_rect'].x + 10, this.friends[i]['text_rect'].y);
             }
        }
        context.font = oldfont;
        this.btn_invite.render(context);
    }
}