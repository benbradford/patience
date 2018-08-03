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
        this.card.box.set_position(x, y);
    }

    protected set_card_scale(x: number) {
        this.card.box.set_scale(x, 1);
    }
}