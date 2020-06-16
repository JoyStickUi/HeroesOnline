
export class EventManager{
    constructor() {
        this.subscribers = new Map();
        this.subscribers.set("keydown", new Set());
        this.subscribers.set("keyup", new Set());
        this.subscribers.set("mousedown", new Set());
        this.subscribers.set("mouseup", new Set());
        this.subscribers.set("mousemove", new Set());
        this.subscribers.set("windowresize", new Set());
        this.subscribers.set("wheel", new Set());
    }

    throwEvent(event_name, event_body){
        if(this.subscribers.has(event_name)){
            for(let subscriber of this.subscribers.get(event_name).values()){
                if('handleEvent' in subscriber)
                    subscriber.handleEvent(event_name, event_body);
            }
        }
    }

    subscribe(event_name, object){
        if(this.subscribers.has(event_name))
            this.subscribers.get(event_name).add(object);
    }
}