import ICardAnimationData from './ICardAnimationData'
import {CardAnimatorTickResult} from './CardAnimator'
import CardAnimator from './CardAnimator'

export default class SimpleLerpCardAnimator extends CardAnimator {

    private readonly destX: number;
    private readonly destY: number;
    private readonly fromX: number;
    private readonly fromY: number;

    private moveTime = 0;
    private scaleIn: boolean;
    private speed: number;
    constructor(data: ICardAnimationData, destX: number, destY: number, scaleIn: boolean, speed: number) {
        super(data);
        this.scaleIn = scaleIn;
        this.speed = speed;
        this.fromX = data.cardX;
        this.fromY = data.cardY;
        this.destX = destX;
        this.destY = destY;
    }

    public tick(): CardAnimatorTickResult {
        this.moveTime+=this.speed;
        let delta = this.moveTime / 10;
        if (this.moveTime >= 10) {
            delta = 10;
        }
        this.set_card_position( this.fromX + (this.destX - this.fromX) * delta, this.fromY + (this.destY - this.fromY) * delta);
        if (this.scaleIn) {
            this.set_card_scale(delta);
        }
        if (delta === 10) {
            return CardAnimatorTickResult.completed;
        }
        return CardAnimatorTickResult.stillAnimating;
    }

}