import {Constants} from "../Constants.js";
import {Cell} from "../Cell/Cell.js";
import {ServerMessagesQueue} from "../../Components/ServerMessagesQueue/ServerMessagesQueue.js";

export class GameField{
    constructor(background_texture_url) {
        this.img_background = new Image();
        this.img_background.src = background_texture_url;
        this.field_matrix = [];

        this.turn = "None";

        this.figure_move_manager = figure_move_manager(this.field_matrix);

        for(let i = 0; i < Constants.x_field_block_amount; ++i){
            this.field_matrix.push([]);
            for(let j = 0; j < Constants.y_field_block_amount; ++j){
                let cell = new Cell();
                this.field_matrix[i].push(cell);
                cell.setPosition(i, j);
            }
        }
    }

    end_turn(){
        for(let i = 0; i < Constants.x_field_block_amount; ++i){            
            for(let j = 0; j < Constants.y_field_block_amount; ++j){
                if(this.field_matrix[i][j].gameobject != null)
                    this.field_matrix[i][j].gameobject.couldBeMoved = false;
            }
        }
    }

    render(context){
        let window_rect = Constants.window_rect;

        if(this.img_background.complete)
            context.drawImage(this.img_background, window_rect.x, window_rect.y, window_rect.width, window_rect.height);

        for(let i = 0; i < Constants.x_field_block_amount; ++i){
            for(let j = 0; j < Constants.y_field_block_amount; ++j){
                this.field_matrix[i][j].render(context);
            }
        }
    }

    setTurn(user){
        if(user != this.turn){
            this.turn = user;
            if(this.turn == Constants.game_master){
                for(let i = 0; i < Constants.x_field_block_amount; ++i){
                    for(let j = 0; j < Constants.y_field_block_amount; ++j){
                        if(this.field_matrix[i][j].gameobject != null && !this.field_matrix[i][j].gameobject.isEnemy){
                            this.field_matrix[i][j].gameobject.couldBeMoved = true;
                        }
                    }
                }
            }
        }
    }

    moveObject(from_x, from_y, to_x, to_y){
        this.field_matrix[from_x][from_y].moveObject(this.field_matrix[to_x][to_y]);
    }

    setObject(object, x, y){
        if(object != null){
            this.field_matrix[x][y].setObject(object);
        }
    }

    attackFigure(from_x, from_y, to_x, to_y){
        if(this.field_matrix[to_x][to_y].gameobject != null && this.field_matrix[from_x][from_y].gameobject != null){
            this.field_matrix[to_x][to_y].gameobject.getDamage(this.field_matrix[from_x][from_y].gameobject.damage);
            if(this.field_matrix[to_x][to_y].gameobject.isDead())
                    this.field_matrix[to_x][to_y].gameobject.animation.changeState("dead", ()=>{
                        this.field_matrix[to_x][to_y].gameobject = null;
                    });
        }
    }

    handleEvent(event_name, event_body){
        let x = Math.floor((event_body.clientX - Constants.c_window_delta_field.x_delta) / Constants.block_size);
        let y = Math.floor((event_body.clientY - Constants.nav_height - Constants.c_window_delta_field.y_delta) / Constants.block_size);
        if(x < Constants.x_field_block_amount && x >= 0 && y < Constants.y_field_block_amount && y >= 0){
            this.field_matrix[x][y].handleEvent(event_name, event_body);

            if(event_name == "mousedown" && this.turn == Constants.game_master){
                if(
                    this.figure_move_manager.select(this.field_matrix[x][y]).moveIf((cells)=> cells.length >= 2)
                )
                    this.figure_move_manager.restore();
            }

        }
    }
}

function figure_move_manager(field_matrix){
    let cells = [];
    return {
        select: function(cell){
            if(
                cell.gameobject == null && cells.length == 0 ||
                cells.length == 0 && !cell.gameobject.couldBeMoved ||
                cell.gameobject != null && cell.gameobject.isEnemy && cells.length == 0
            ){
                cell.animation.changeDefaultState("default");
                cell.animation.restoreState();
                return this;
            }
            if(cells.length == 1 && cell.gameobject != null && cell.gameobject.isEnemy && cells[0].gameobject.couldBeMoved){
                cells[0].gameobject.animation.changeState("attack");
                cells[0].gameobject.couldBeMoved = false;
                if(Math.abs(cell.x - cells[0].x) <= cells[0].gameobject.attack_radius && Math.abs(cell.y - cells[0].y) <= cells[0].gameobject.attack_radius){
                    cell.gameobject.getDamage(cells[0].gameobject.damage);
                    ServerMessagesQueue.addToSendMessage({
                                'type': 'attack',
                                'master': document.getElementById('user').textContent.trim(),
                                'from_x': cells[0].x,
                                'from_y': cells[0].y,
                                'to_x': cell.x,
                                'to_y': cell.y
                            });
                }
                if(cell.gameobject.isDead())
                    cell.gameobject.animation.changeState("dead", ()=>{
                        cell.gameobject = null;
                    });
            }
            if(cells.length == 0 && cell.gameobject.couldBeMoved)
                highlight_walkable_attackable_cells(field_matrix, cell, "walkable", "could-be-attacked", "non-walkable");
            if(cells.length < 2)
                cells.push(cell);
            return this;
        },
        restore(){
            for(let cell of cells){
                cell.animation.changeDefaultState("default");
                cell.animation.restoreState();
            }
            cells = [];
            return this;
        },
        moveIf(predicate){
            if(predicate(cells)){
                highlight_walkable_attackable_cells(field_matrix, cells[0], "default", "default", "default");
                if(cells[0].gameobject != cells[1].gameobject){
                    let x_delta = Math.abs(cells[0].x - cells[1].x);
                    let y_delta = Math.abs(cells[0].y - cells[1].y);
                    if(cells[0].gameobject.move_radius >= x_delta && cells[0].gameobject.move_radius >= y_delta && cells[1].gameobject == null) {
                        cells[0].animation.changeDefaultState("default");
                        cells[0].gameobject.couldBeMoved = false;
                        cells[0].moveObject(cells[1]);
                        ServerMessagesQueue.addToSendMessage({
                            'type': 'move',
                            'master': document.getElementById('user').textContent.trim(),
                            'from_x': cells[0].x,
                            'from_y': cells[0].y,
                            'to_x': cells[1].x,
                            'to_y': cells[1].y
                        });
                    }
                }
                return true
            }
            return false;
        }
    }
}

function highlight_walkable_attackable_cells(field_matrix, cell, walkable_state, attack_state, non_walkable_state){

    let obj = cell.gameobject;

    if(obj != null){
        let start_x = cell.x - obj.move_radius < 0 ? 0 : cell.x - obj.move_radius;
        let start_y = cell.y - obj.move_radius < 0 ? 0 : cell.y - obj.move_radius;
        let end_x = cell.x + obj.move_radius + 1 > Constants.x_field_block_amount ? Constants.x_field_block_amount : cell.x + 1 + obj.move_radius;
        let end_y = cell.y + obj.move_radius + 1 > Constants.y_field_block_amount ? Constants.y_field_block_amount : cell.y + 1 + obj.move_radius;

        for(let x = start_x; x < end_x; ++x){
            for(let y = start_y; y < end_y; ++y){
                if(x == cell.x && y == cell.y) {
                    field_matrix[x][y].animation.changeDefaultState("selected");
                    continue;
                }
                if(field_matrix[x][y].gameobject != null && !field_matrix[x][y].gameobject.isEnemy){
                    field_matrix[x][y].animation.changeDefaultState(non_walkable_state);
                }else{
                    field_matrix[x][y].animation.changeDefaultState(walkable_state);
                }
                field_matrix[x][y].animation.restoreState();
            }
        }

        start_x = cell.x - obj.attack_radius < 0 ? 0 : cell.x - obj.attack_radius;
        start_y = cell.y - obj.attack_radius < 0 ? 0 : cell.y - obj.attack_radius;
        end_x = cell.x + obj.attack_radius + 1 > Constants.x_field_block_amount ? Constants.x_field_block_amount : cell.x + 1 + obj.attack_radius;
        end_y = cell.y + obj.attack_radius + 1 > Constants.y_field_block_amount ? Constants.y_field_block_amount : cell.y + 1 + obj.attack_radius;

        for(let x = start_x; x < end_x; ++x){
            for(let y = start_y; y < end_y; ++y){
                if(field_matrix[x][y].gameobject == null) continue;
                if(!field_matrix[x][y].gameobject.isEnemy) continue;
                field_matrix[x][y].animation.changeDefaultState(attack_state);
                field_matrix[x][y].animation.restoreState();
            }
        }
    }
}