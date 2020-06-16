
export class Animation{
    constructor(name, sprite_atlas_url) {
        this.name = name;
        this.sprite_atlas = new Image();
        this.sprite_atlas.src = sprite_atlas_url;
        this.states = new Map();
        this.on_end_handlers = new Map();
        this.frame_counter = frame_counter(tick_counter(4));
        this.state = "default";
        this.default_state = "default";
    }

    add_on_end_state_handler(state, callback){
        if(!this.states.has(state) || !this.on_end_handlers.has(state))return;
        this.on_end_handlers.get(state).push(callback);
    }

    changeDefaultState(state_name){
        if(this.states.has(state_name))this.default_state = state_name;
    }

    changeState(state, on_end_callback = null){
        if(this.states.has(state)) this.state = state;
        if(this.states.has(state) && on_end_callback != null){
            this.on_end_handlers.get(state).push(on_end_callback);
        }
    }

    deleteStatesAndHandlers(){
        this.states = new Map();
        this.on_end_handlers = new Map();
    }

    restoreState(){
        this.state = this.default_state;
    }

    draw(context, rect){
        if(this.sprite_atlas.complete){
            let anim_prop = this.states.get(this.state);
            let frame_rect = anim_prop.frame_rect;
            let frames = anim_prop.frames;
            let frame = this.frame_counter(frames);
            if(frame == -1){
                frame = 0;
                let handlers = this.on_end_handlers.get(this.state);
                for(let handler of handlers){
                    handler(this);
                }
            }
            context.drawImage(
                this.sprite_atlas,
                frame_rect.x + (frame_rect.width * frame),
                frame_rect.y,
                frame_rect.width,
                frame_rect.height,
                rect.x,
                rect.y,
                rect.width,
                rect.height
            );
        }
    }

    createState(state_name, frame_rect, frames){
        this.states.set(state_name, {
            frame_rect: frame_rect,
            frames: frames
        });
        this.on_end_handlers.set(state_name, []);
    }
}

function tick_counter(tick_per_frame){
    let tick = 0;
    return function(){
        ++tick;
        if(tick>=tick_per_frame){
            tick = 0;
            return true;
        }
        return false;
    }
}

function frame_counter(tick_counter){
    let frame = 0;
    return function(frames){
        if(tick_counter() || frame == -1)++frame;
        if(frame>=frames)frame = -1;
        return frame;
    }
}