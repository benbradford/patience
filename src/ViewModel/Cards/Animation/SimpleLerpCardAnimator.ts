import {IFloatingCard} from '../ViewModelData'
import CardAnimator from './CardAnimator'
import MultipleCardsSyncHelper from '../MultipleCardsSyncHelper'
import ViewModelDataSync from '../ViewModelDataSync';
import BoxFinder from '../BoxFinder';

export default class SimpleLerpCardAnimator extends CardAnimator {

    private readonly destX: number;
    private readonly destY: number;
    private readonly fromX: number;
    private readonly fromY: number;

    private moveTime = 0;
    private scaleIn: boolean;
    private speed: number;
    private onAnimationEnd: ()=>void;
    private cardSyncHelper: MultipleCardsSyncHelper;

    constructor(card: IFloatingCard, destX: number, destY: number, scaleIn: boolean, speed: number, onAnimationEnd: ()=>void, viewModel: ViewModelDataSync, boxFinder: BoxFinder) {
        super(card);
        this.scaleIn = scaleIn;
        this.speed = speed;
        this.fromX = card.box.left();
        this.fromY = card.box.top();
        this.destX = destX;
        this.destY = destY;
        this.onAnimationEnd = onAnimationEnd;
        this.cardSyncHelper = new MultipleCardsSyncHelper(card.card, boxFinder, viewModel);
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
        this.cardSyncHelper.update_positions();
        if (delta === 10) {
            this.onAnimationEnd();
        } 
    }

}