import CardProxy from './CardProxy'
import { ICardView } from "./ViewModelData";
import ViewModelDataSync from "./ViewModelDataSync";

export default class FloatingCard {

    private cardProxy: CardProxy;
    private cardX: number;
    private cardY: number;
    private cardScaleX: number;

    constructor(card: ICardView, cardX: number, cardY: number, cardScaleX: number, dataSync: ViewModelDataSync) {
        this.cardProxy = new CardProxy(dataSync, card);
        this.cardX = cardX;
        this.cardY = cardY;
        this.cardScaleX = cardScaleX;
    }

    public proxy(): CardProxy {
        return this.cardProxy;
    }

    public current(): ICardView| null {
        return this.cardProxy.current();
    }

    public pos_x(): number {
        return this.cardX;
    }

    public pos_y(): number {
        return this.cardY;
    }

    public scale_x(): number {
        return this.cardScaleX;
    }

    public set_position(x: number, y: number) {
        this.cardX = x;
        this.cardY = y;
    }

    public set_scale(x: number) {
        this.cardScaleX = x;
    }
}