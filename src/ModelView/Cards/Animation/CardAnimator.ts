import FloatingCard from '../FloatingCard'

export default abstract class CardAnimator {
 
    private card: FloatingCard;

    constructor(card: FloatingCard) {
        this.card = card;
    }

    public card_data(): Readonly<FloatingCard> {
        return this.card;
    }

    public abstract tick(): void;

    protected set_card_position(x: number, y: number) {
        this.card.set_position(x, y);
    }

    protected set_card_scale(x: number) {
        this.card.set_scale(x);
    }
}