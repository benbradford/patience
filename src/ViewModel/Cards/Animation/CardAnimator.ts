import {IFloatingCard} from '../ViewModelData'

export default abstract class CardAnimator {
 
    private card: IFloatingCard;

    constructor(card: IFloatingCard) {
        this.card = card;
    }

    public card_data(): Readonly<IFloatingCard> {
        return this.card;
    }

    public abstract tick(): void;

    protected set_card_position(x: number, y: number) {
        this.card.box.left = x;
        this.card.box.right = x + this.card.box.width;
        this.card.box.top = y;
        this.card.box.bottom = y + this.card.box.height;
    }

    protected set_card_scale(x: number) {
        this.card.box.scaleX = x;
    }
}