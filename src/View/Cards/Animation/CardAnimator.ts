import ICardAnimationData from './ICardAnimationData'

export enum CardAnimatorTickResult {
    stillAnimating,
    completed
}

export default abstract class CardAnimator {
 
    private data: ICardAnimationData;

    constructor(data: ICardAnimationData) {
        this.data = data;
    }

    public card_data(): Readonly<ICardAnimationData> {
        return this.data;
    }

    public abstract tick(): CardAnimatorTickResult;

    protected set_card_position(x: number, y: number) {
        this.data.cardX = x;
        this.data.cardY = y;
    }

    protected set_card_scale(x: number) {
        this.data.scaleX = x;
    }
}