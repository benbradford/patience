export default class CardBox {
    public left: number;
    public right: number;
    public bottom: number;
    public top: number;
    public width: number;
    public height: number;
    public scaleX: number = 1;
    public scaleY: number = 1;

    constructor(  left: number,
         right: number,
         bottom: number,
         top: number,
         width: number,
         height: number) {
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    public set_position(x: number, y: number) {
        this.left = x;
        this.top = y;
        this.right = x + this.width;
        this.bottom = y + this.height;
    }
}