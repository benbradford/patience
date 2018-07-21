import ICardStyles from './ICardStyles'
import {ICardView} from './ModelViewData'
import SolitaireModelView from '../SolitaireModelView'
import CardBox from './CardBox'
import MouseController from './MouseController'

export interface IMoveDestination {
    pileIndex: number;
    box: CardBox; 
}

type BoxFinder = (pileIndex: number) => CardBox | null;

export default class DragToEvaluator {
     
    private cardStyles: ICardStyles;
    private boxFinder: BoxFinder;
    private modelView: SolitaireModelView;

    private validDestinations : IMoveDestination[];

    constructor(cardStyles: ICardStyles, boxFinder: BoxFinder, modelView: SolitaireModelView) {
        this.cardStyles = cardStyles;
        this.boxFinder = boxFinder;
        this.modelView = modelView;
    }

    public set_valid_destinations(card: ICardView) {
        const destinationPiles = this.modelView.valid_move_to_destinations(card);
        this.validDestinations  = [];
        for (const p of destinationPiles) {
            const b= this.boxFinder(p);
            if (b) {
                this.validDestinations.push({pileIndex: p, box: b}); 
            }                   
        }
        
    }

    public winning_pile(dragFrom: CardBox, mouseOffsetX: number, mouseOffsetY: number) : IMoveDestination | null {
        const dminX = MouseController.lastMouseX + mouseOffsetX;
        const dminY = MouseController.lastMouseY + mouseOffsetY;
        const dmaxX = dminX + this.cardStyles.cardWidthValue;
        const dmaxY = dminY + this.cardStyles.cardLengthValue;
        
        let highestCoverage = 0;
        let winningPile: IMoveDestination | null = null;

        for (const dest of this.validDestinations) {
            
            const coverage = this.check_overlap(dest.box, dminX, dminY, dmaxX, dmaxY);
            if (coverage > highestCoverage) {
                winningPile = dest;
                highestCoverage = coverage;
            }
        }
        const returnCoverage = this.check_overlap(dragFrom, dminX, dminY, dmaxX, dmaxY);
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
}