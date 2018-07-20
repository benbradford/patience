import SolitaireModelView from '../ModelView/SolitaireModelView'
import ICardStyles from './ICardStyles'
import SimpleLerpCardAnimator from './Cards/Animation/SimpleLerpCardAnimator'
import FloatingCard from '../ModelView/Cards/FloatingCard'
import ICardTicker from '../ModelView/Cards/ICardTicker'
import CardAnimator from './Cards/Animation/CardAnimator'

export default class AnimationController implements ICardTicker {

    private modelView: SolitaireModelView;
    private cardStyles: ICardStyles;
    
    private running: CardAnimator[] = [];
   
    constructor( modelView: SolitaireModelView, cardStyles: ICardStyles) {
        this.modelView = modelView;
        this.cardStyles = cardStyles;
    }

    public start_animation(card: FloatingCard, box: ClientRect, pileIndex: number, fromX: number, fromY: number, turn: boolean, speed: number, onAnimationEnd: ()=>void) {
            
        const destX = box.left;
        let destY = box.top;
        
        if (pileIndex > 1 && pileIndex < 9) {
            const destPile = this.modelView.hold()[pileIndex - 2];
            if (destPile.cards.length > 0) {
                destY +=  this.cardStyles.previewSize; 
            }           
        }
        const animator = new SimpleLerpCardAnimator(card, destX + window.scrollX, destY + window.scrollY, turn, speed, onAnimationEnd);
        this.running.push(animator);
    }

    public tick(): void {
        for (const t of this.running) {
            t.tick();
        }
    }

    
}