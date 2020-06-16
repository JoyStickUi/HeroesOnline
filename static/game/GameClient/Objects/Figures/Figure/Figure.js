import {GameObject} from "../../GameObject/GameObject.js";

export class Figure extends GameObject{
    constructor(name, sprite_atlas_url, isEnemy) {
        super(name, sprite_atlas_url);
        this.couldBeMoved = false;
        this.attack_radius = 2;
        this.move_radius = 2;
        this.health = "100";
        this.damage = 25;
        this.isEnemy = isEnemy;
        this.showHealth = true;
    }
    
    setProps(props = {
        'move_radius': 0,
        'attack_radius': 0,
        'health': 0,
        'damage': 0
    }){
        this.move_radius = props['move_radius'];
        this.attack_radius = props['attack_radius'];
        this.setHealth(props['health']);
        this.damage = props['damage'];
    }

    isDead() {
        let health = Number(this.health);
        return health <= 0;
    }

    setHealth(hp){
        if(hp < 0)
            hp = 0
        let health = String(hp);
        for(let i = 0; i < 4 - health.length; ++i){
            health = "0" + health;
        }
        if(Number(health) > 100)health = "100";
        if(Number(health) < 0)health = "000";
        this.health = health;
    }

    getDamage(hp){
        this.setHealth(Number(this.health) - hp);
    }

    addHealth(hp){
        this.setHealth(Number(this.health) + hp);
    }

    render(context) {
        super.render(context);
        if(this.showHealth){
            if(this.isEnemy){
                context.fillStyle = "rgba(255, 100, 100, 0.8)";
            }else{
                context.fillStyle = "rgba(0, 255, 0, 0.8)";
            }
            context.strokeStyle = "black";
            context.fillRect(this.rect.x + this.rect.width / 4, this.rect.y + this.rect.height * 0.75, this.rect.width - this.rect.width / 2, this.rect.height / 4);
            context.strokeText(this.health, this.rect.x + this.rect.width / 2.5, this.rect.y + this.rect.height * 0.75 + this.rect.height / 6);
        }
    }

    getPositionReport(){
        return {
            'id': this.id,
            'name': this.name,
            'x': this.x,
            'y': this.y
        }
    }
}