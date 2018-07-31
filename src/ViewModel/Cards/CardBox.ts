export default class CardBox {
    public readonly left: number;
    public readonly right: number;
    public readonly bottom: number;
    public readonly top: number;
    public readonly width: number;
    public readonly height: number;

    constructor(  left: number,
         right: number,
         bottom: number,
         top: number,
         width: number,
         height: number)
         {
             this.left = left;
             this.right = right;
             this.bottom = bottom;
             this.top = top;
             this.width = width;
             this.height = height;
         }
}