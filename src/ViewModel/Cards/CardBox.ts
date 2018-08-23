
interface IVec2 {
    x: number;
    y: number;
}

export default class CardBox {

    public readonly width: number;
    public readonly height: number;
    
    private pos: IVec2;
    private scale: IVec2;

    constructor(left: number, top: number, width: number, height: number) {
        this.pos = {x: left, y: top};
        this.width = width;
        this.height = height;
        this.scale = {x: 1, y: 1};
    }

    public readonly left = ():number => this.pos.x;
    public readonly top = ():number =>this.pos.y;
    public readonly right = ():number => this.pos.x + this.width; 
    public readonly bottom = ():number => this.pos.y + this.height;
    public readonly scaleX = ():number => this.scale.x;
    public readonly scaleY = ():number => this.scale.y;
    public center():IVec2 { return {x: this.pos.x + (this.scale.x / 2), y: this.pos.y + (this.scale.y / 2)}; }

    public set_position(left: number, top: number) {
        this.pos = {x: left, y: top};
    }

    public set_scale(scaleX: number, scaleY: number) {
        this.scale = {x: scaleX, y: scaleY};
    }
}