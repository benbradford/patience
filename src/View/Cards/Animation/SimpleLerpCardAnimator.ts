import FloatingCard from '../../../ModelView/Cards/FloatingCard'
import CardAnimator from './CardAnimator'

export default class SimpleLerpCardAnimator extends CardAnimator {

    private readonly destX: number;
    private readonly destY: number;
    private readonly fromX: number;
    private readonly fromY: number;

    private moveTime = 0;
    private scaleIn: boolean;
    private speed: number;
    private onAnimationEnd: ()=>void;

    constructor(card: FloatingCard, destX: number, destY: number, scaleIn: boolean, speed: number, onAnimationEnd: ()=>void) {
        super(card);
        this.scaleIn = scaleIn;
        this.speed = speed;
        this.fromX = card.pos_x();
        this.fromY = card.pos_y();
        this.destX = destX;
        this.destY = destY;
        this.onAnimationEnd = onAnimationEnd;
    }

    public tick(): void {
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
            this.onAnimationEnd();
        } 
    }

}