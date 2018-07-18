import * as React from 'react'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import ICardStyles from './ICardStyles'
import {ICardView} from '../ModelView/Cards/ModelViewData'
import AnimationController from './AnimationController'
import PileViews from './PileViews'
import CardProxy from '../ModelView/CardProxy'
import CardAnimationView from './Cards/CardAnimationView'

interface IMoveDestination {
    pileIndex: number;
    box: ClientRect | null; 
}

export default class DragController {

    public lastMouseX : number = 0;
    public lastMouseY : number = 0;
    public mouseOffsetX: number = 0;
    public mouseOffsetY: number = 0;
    public animationController: AnimationController;
   
    private modelView: SolitaireModelView;
    private cardStyles: ICardStyles;
    private pileViews: React.RefObject<PileViews>;
    private updateState: ()=>void;

    private dragFrom: ClientRect | null = null;
    private destinations: IMoveDestination[];

    private draggedCard: CardProxy;

    constructor(modelView: SolitaireModelView, cardStyles: ICardStyles, animationView: React.RefObject<CardAnimationView>, pileViews: React.RefObject<PileViews>, updateState: ()=>void) {
        this.modelView = modelView;
        this.cardStyles = cardStyles;
        this.animationController = new AnimationController(this.modelView, animationView, this.cardStyles, this.resetDrag);;
        this.pileViews = pileViews;
        this.updateState = updateState;
        this.draggedCard = new CardProxy(this.modelView.data_sync());
    }

    public floating_card() {
        if (this.is_dragged()) {
            return this.draggedCard.current();
        }
        return this.animationController.moving_card();
    }

    public handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        this.lastMouseX = event.clientX + window.scrollX;
        this.lastMouseY = event.clientY + window.scrollY;
        
        if (this.is_dragged() === true) {
            this.updateState();
        }
    }
    
    public handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        this.lastMouseX = event.clientX + window.scrollX;
        this.lastMouseY = event.clientY + window.scrollY;
        if (this.is_dragged() === false) {
            return;
        }
        const card = this.draggedCard.current();
        if (card === null) {
            this.resetDrag();

            return;
        }
        
        const winning = this.winning_pile();
        if (winning ) {
            
            const anim = this.modelView.move_card_to(card, winning.pileIndex ); // have this return an animation action?
            if (winning.box && anim) {
                const x = this.lastMouseX + this.mouseOffsetX + window.scrollX;
                const y = this.lastMouseY + this.mouseOffsetY + window.scrollY;
           
                this.animationController.start_animation(anim.card, winning.box, anim.destPileIndex, x, y, false);
            } 
            this.resetDrag();

        } else {
            this.revert_animation();
        }
        
    }

    public handleMouseLeave = () => {
        if (this.draggedCard.has_card() && this.is_dragged() === true) {
            this.revert_animation();
        }
    }

    public onStartDrag = (c: ICardView, box: ClientRect) => {
        if (this.draggedCard.has_card()) {
            return;
        }
        this.dragFrom = box;
        this.mouseOffsetX = (box.left - this.lastMouseX) - 14;
        this.mouseOffsetY= (box.top - this.lastMouseY) - 8;
        this.draggedCard.set(c);
        this.destinations = this.move_destinations(c);
        this.updateState();
    }

    public is_dragged() {

        return this.dragFrom !== null;
    }

    private resetDrag = () => {
        this.dragFrom = null;
        this.draggedCard.reset();
        this.updateState();
    }

    private move_destinations(card: ICardView): IMoveDestination[] {
        const destinationPiles = this.modelView.valid_move_to_destinations(card);
        const dests : IMoveDestination[] = [];
        const holdRef = this.pileViews.current;
        for (const p of destinationPiles) {
            if (holdRef !== null) {
                dests.push({pileIndex: p, box: holdRef.box_for(p)});
            }            
        }
        return dests;
    }

    private winning_pile() : IMoveDestination | null {
        const dminX = this.lastMouseX + this.mouseOffsetX;
        const dminY = this.lastMouseY + this.mouseOffsetY;
        const dmaxX = dminX + this.cardStyles.cardWidthValue;
        const dmaxY = dminY + this.cardStyles.cardLengthValue;
        
        let highestCoverage = 0;
        let winningPile: IMoveDestination | null = null;

        for (const dest of this.destinations) {
            
            const coverage = this.check_overlap(dest.box, dminX, dminY, dmaxX, dmaxY);
            if (coverage > highestCoverage) {
                winningPile = dest;
                highestCoverage = coverage;
            }
        }
        const returnCoverage = this.check_overlap(this.dragFrom, dminX, dminY, dmaxX, dmaxY);
        if (returnCoverage > highestCoverage) {
            return null;
        }
        return winningPile;
    }

    private check_overlap(box: ClientRect | null, dminX: number, dminY: number, dmaxX: number, dmaxY: number): number {
        if (box === null) {
            return -1;
        }

        if (dminX > box.left + this.cardStyles.cardWidthValue || dmaxX < box.left || dminY > box.top + this.cardStyles.cardLengthValue || dmaxY < box.top) {
            return -1;
        }

        let left = dminX;
        let right = box.left + this.cardStyles.cardWidthValue;
        if (box.left > dminX) {
            left = box.left;
            right = dmaxX;
        }

        let top = dminY;
        let bottom = box.top + this.cardStyles.cardLengthValue;
        if (box.top > dminY) {
            top = box.top;
            bottom = dmaxY;
        }

        return(right-left) * (bottom-top);
    }

    private revert_animation() {
        const card = this.draggedCard.current();
        if (card && this.dragFrom) {
            const x = this.lastMouseX + this.mouseOffsetX + window.scrollX;
            const y = this.lastMouseY + this.mouseOffsetY + window.scrollY;
           
            this.animationController.start_animation(card, this.dragFrom, card.pileIndex, x, y, false);
        }  
        this.resetDrag();
        
    }
}