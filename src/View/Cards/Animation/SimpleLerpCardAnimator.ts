import ICardAnimationData from './ICardAnimationData'
import {CardAnimatorTickResult} from './CardAnimator'
import CardAnimator from './CardAnimator'

export default class SimpleLerpCardAnimator extends CardAnimator {

    private moveTime = 0;

    constructor(data: ICardAnimationData, destX: number, destY: number) {
        super(data, data.cardX, data.cardY, destX, destY);
    }

    public tick(): CardAnimatorTickResult {
        this.moveTime+=1;
        let delta = this.moveTime / 10;
        if (this.moveTime >= 10) {
            delta = 10;
        }
        this.set_card_position( this.fromX + (this.destX - this.fromX) * delta, this.fromY + (this.destY - this.fromY) * delta);
        if (delta === 10) {
            return CardAnimatorTickResult.completed;
        }
        return CardAnimatorTickResult.stillAnimating;
    }

}