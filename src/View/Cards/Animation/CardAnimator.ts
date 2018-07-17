import ICardAnimationData from './ICardAnimationData'

export enum CardAnimatorTickResult {
    stillAnimating,
    completed
}

export default abstract class CardAnimator {

    protected readonly destX: number;
    protected readonly destY: number;
    protected readonly fromX: number;
    protected readonly fromY: number;

    private data: ICardAnimationData;

    constructor(data: ICardAnimationData, fromX: number, fromY: number, destX: number, destY: number) {
        this.data = data;
        this.fromX = fromX;
        this.fromY = fromY;
        this.destX = destX;
        this.destY = destY;
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