import SolitaireViewModel from './SolitaireViewModel'
import ICardStyles from './Cards/ICardStyles'
import SimpleLerpCardAnimator from './Cards/Animation/SimpleLerpCardAnimator'
import {IFloatingCard} from './Cards/ViewModelData'
import ICardTicker from './Cards/ICardTicker'
import CardAnimator from './Cards/Animation/CardAnimator'
import {hold_pile} from './SolitaireCardCollectionsViewModel'

export default class AnimationController implements ICardTicker {

    private viewModel: SolitaireViewModel;
    private cardStyles: ICardStyles;
    private onAnimationEnd: ()=>void;
    private running: CardAnimator[] = [];
   
    constructor( viewModel: SolitaireViewModel, cardStyles: ICardStyles) {
        this.viewModel = viewModel;
        this.cardStyles = cardStyles;
    }

    public start_animation(card: IFloatingCard, box: ClientRect, pileIndex: number, fromX: number, fromY: number, turn: boolean, speed: number, onAnimationEnd: ()=>void) {
        
        this.onAnimationEnd = onAnimationEnd;
        const destX = box.left;
        let destY = box.top;
        
        if (pileIndex > 1 && pileIndex < 9) {
            const destPile = hold_pile(this.viewModel.data_sync().data(), pileIndex-2);
            if (destPile.cards.length > 0) {
                destY +=  this.cardStyles.previewSize; 
            }           
        }
        const animator = new SimpleLerpCardAnimator(card, destX + window.scrollX, destY + window.scrollY, turn, speed, this.onAnimEnd);
        this.running.push(animator);
    }

    public tick(): void {
        for (const t of this.running) {
            t.tick();
        }
        if (this.running.length) {
            this.viewModel.update_state();
        }
    }

    private onAnimEnd = () => {
        this.running.pop();
        this.onAnimationEnd();
        this.viewModel.update_state();
    }
    
}