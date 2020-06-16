import {Constants} from "../../Objects/Constants.js";

export class Rect{
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    include_point(x, y){
        return this.x <= x && this.x + this.width >= x && this.y <= y - Constants.nav_height && this.y + this.height >= y - Constants.nav_height;
    }
}