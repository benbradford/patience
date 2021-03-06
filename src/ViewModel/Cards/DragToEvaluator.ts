import ICardStyles from './ICardStyles'
import {ICardView} from './ViewModelData'
import SolitaireViewModel from '../SolitaireViewModel'
import CardBox from './CardBox'
import MouseController from './MouseController'
import BoxFinder from './BoxFinder'

export interface IMoveDestination {
    pileIndex: number;
    box: CardBox; 
}

export default class DragToEvaluator {
     
    private cardStyles: ICardStyles;
    private boxFinder: BoxFinder;
    private viewModel: SolitaireViewModel;

    private validDestinations : IMoveDestination[];

    constructor(cardStyles: ICardStyles, boxFinder: BoxFinder, viewModel: SolitaireViewModel) {
        this.cardStyles = cardStyles;
        this.boxFinder = boxFinder;
        this.viewModel = viewModel;
    }

    public set_valid_destinations(card: ICardView) {
        const destinationPiles = this.viewModel.valid_move_to_destinations(card);
        this.validDestinations  = [];
        for (const p of destinationPiles) {
            const b= this.boxFinder.boxForPile(p);
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

    private check_overlap(box: CardBox | null, dminX: number, dminY: number, dmaxX: number, dmaxY: number): number {
        if (box === null) {
            return -1;
        }

        if (dminX > box.right() || dmaxX < box.left() || dminY > box.bottom() || dmaxY < box.top()) {
            return -1;
        }

        let left = dminX;
        let right = box.right();
        if (box.left() > dminX) {
            left = box.left();
            right = dmaxX;
        }

        let top = dminY;
        let bottom = box.bottom();
        if (box.top() > dminY) {
            top = box.top();
            bottom = dmaxY;
        }

        return(right-left) * (bottom-top);
    }
}