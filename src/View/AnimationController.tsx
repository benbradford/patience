import * as React from 'react'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import ICardStyles from './ICardStyles'
import {ICardView} from '../ModelView/Cards/ModelViewData'
import CardAnimationView from './Cards/CardAnimationView'
import SimpleLerpCardAnimator from './Cards/Animation/SimpleLerpCardAnimator'
import CardProxy from '../ModelView/CardProxy'

export default class AnimationController {

    private modelView: SolitaireModelView;
    private animationView: React.RefObject<CardAnimationView>;
    private cardStyles: ICardStyles;
    private movingCard: CardProxy;
    private onAnimationEnd: ()=>void;

    constructor( modelView: SolitaireModelView, animationView: React.RefObject<CardAnimationView>, cardStyles: ICardStyles, onAnimationEnd: ()=>void) {
        this.modelView = modelView;
        this.animationView = animationView;
        this.cardStyles = cardStyles;
        this.onAnimationEnd = onAnimationEnd;
        this.movingCard = new CardProxy(modelView.data_sync());
    }
    
    public moving_card() {
        return this.movingCard.current();
    }

    public start_animation(card: ICardView, box: ClientRect, pileIndex: number, fromX: number, fromY: number, turn: boolean, speed: number = 1) {
        
        if (this.animationView.current) {
            // this.state.moving.card = card;
            // this.dragFrom = null;
            this.movingCard.set(card)
            const destX = box.left;
            let destY = box.top;
            
            if (pileIndex > 1 && pileIndex < 9) {
                const destPile = this.modelView.hold()[pileIndex - 2];
                if (destPile.cards.length > 0) {
                    destY +=  this.cardStyles.previewSize; 
                }           
            }
            const animator = new SimpleLerpCardAnimator({cardX:fromX, cardY:fromY, scaleX:1}, destX + window.scrollX, destY + window.scrollY, turn, speed);
            this.animationView.current.start_animation(card, animator, this.onAnimEnd);
        } 
    }

    private onAnimEnd = () => {
        this.movingCard.reset();
        this.onAnimationEnd();
    }
    
}