export default class CardBox {
    public left: number;
    public right: number;
    public bottom: number;
    public top: number;
    public width: number;
    public height: number;

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

    public scaleX() {
        return 1.0;
    }

    public scaleY() {
        return 1.0;
    }
}