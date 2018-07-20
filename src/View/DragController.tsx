/*import * as React from 'react'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import ICardStyles from './ICardStyles'
import {ICardView} from '../ModelView/Cards/ModelViewData'
import AnimationController from './AnimationController'
import PileViews from './PileViews'
import CardProxy from '../ModelView/Cards/CardProxy'
import CardAnimationView from './Cards/CardAnimationView'
import MouseController from './Cards/MouseController'

interface IMoveDestination {
    pileIndex: number;
    box: ClientRect | null; 
}

export default class DragController {

    private animationController: AnimationController;
    private mouseOffsetX: number = 0;
    private mouseOffsetY: number = 0;
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

    public animation_controller(): AnimationController {
        return this.animationController;
    }

    public dragged_card_offset_x() {
        return MouseController.lastMouseX + this.mouseOffsetX + window.scrollX;
    }

    public dragged_card_offset_y() {
        return MouseController.lastMouseY + this.mouseOffsetY + window.scrollY
    }

    public floating_card() {
        if (this.is_dragged()) {
            return this.draggedCard.current();
        }
        return this.animationController.moving_card();
    }

    public handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
        
        if (this.is_dragged() === true) {
            this.updateState();
        }
    }
    
    public handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
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
                const x = this.dragged_card_offset_x();
                const y = this.dragged_card_offset_y();
           
                this.animationController.start_animation(anim.card, winning.box, anim.destPileIndex, x, y, false);
            } 
            this.resetDrag();

        } else {
            this.cancel();
        }
        
    }

    public handleMouseLeave = () => {
        if (this.draggedCard.has_card() && this.is_dragged() === true) {
            this.cancel();
        }
    }

    public onStartDrag = (c: ICardView, box: ClientRect) => {
        if (this.draggedCard.has_card()) {
            return;
        }
        this.dragFrom = box;
        this.mouseOffsetX = (box.left - MouseController.lastMouseX) - 14;
        this.mouseOffsetY= (box.top - MouseController.lastMouseY) - 8;
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
        const dminX = MouseController.lastMouseX + this.mouseOffsetX;
        const dminY = MouseController.lastMouseY + this.mouseOffsetY;
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

        if (dminX > box.right || dmaxX < box.left || dminY > box.bottom || dmaxY < box.top) {
            return -1;
        }

        let left = dminX;
        let right = box.right;
        if (box.left > dminX) {
            left = box.left;
            right = dmaxX;
        }

        let top = dminY;
        let bottom = box.bottom;
        if (box.top > dminY) {
            top = box.top;
            bottom = dmaxY;
        }

        return(right-left) * (bottom-top);
    }

    private cancel() {
        const card = this.draggedCard.current();
        if (card && this.dragFrom) {
            const x = this.dragged_card_offset_x();
            const y = this.dragged_card_offset_y();
           
            this.animationController.start_animation(card, this.dragFrom, card.pileIndex, x, y, false);
        }  
        this.resetDrag();
        
    }
}*/