import SolitaireViewModel from './SolitaireViewModel'
import ICardStyles from './Cards/ICardStyles'
import SimpleLerpCardAnimator from './Cards/Animation/SimpleLerpCardAnimator'
import FloatingCard from './Cards/FloatingCard'
import ICardTicker from './Cards/ICardTicker'
import CardAnimator from './Cards/Animation/CardAnimator'

export default class AnimationController implements ICardTicker {

    private viewModel: SolitaireViewModel;
    private cardStyles: ICardStyles;
    private onAnimationEnd: ()=>void;
    private running: CardAnimator[] = [];
    private updateState: () =>void;
   
    constructor( viewModel: SolitaireViewModel, cardStyles: ICardStyles, updateState: () =>void) {
        this.viewModel = viewModel;
        this.cardStyles = cardStyles;
        this.updateState = updateState;
    }

    public start_animation(card: FloatingCard, box: ClientRect, pileIndex: number, fromX: number, fromY: number, turn: boolean, speed: number, onAnimationEnd: ()=>void) {
        
        this.onAnimationEnd = onAnimationEnd;
        const destX = box.left;
        let destY = box.top;
        
        if (pileIndex > 1 && pileIndex < 9) {
            const destPile = this.viewModel.hold()[pileIndex - 2];
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
            this.updateState();
        }
    }

    private onAnimEnd = () => {
        this.running.pop();
        this.onAnimationEnd();
        this.updateState();
    }
    
}