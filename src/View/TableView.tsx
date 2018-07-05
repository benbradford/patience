import * as React from 'react'
import {IModelViewData, ICardView, PileName} from '../ModelView/ModelViewData'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import PileViews from './PileViews'
import {cardWidthValue, cardLengthValue} from  './CardRenderer'
import CardDragView from './CardDragView'

interface IMoveDestination {
    pile: PileName;
    box: ClientRect | null; 
}

interface IMoveData {
    card: ICardView | null;
    destinations: IMoveDestination[];
    mouseOffsetX: number;
    mouseOffsetY: number;
}

interface ITableData {
    modelView: IModelViewData;
    moving: IMoveData;
}

export default class TableView extends React.Component<{}, ITableData> {
    private modelView = new SolitaireModelView();
    private pileViews = React.createRef<PileViews>();

    private lastMouseX : number = 0;
    private lastMouseY : number = 0;

    private dragFrom: ClientRect | null = null;

    public componentDidMount() {
       this.update_state_no_moving();
    }

    public render(): JSX.Element {     
        if (this.state === null) {
            return ( <p/> );
        }
        return (
            <section>
                <div onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseLeave} className="Table">   
                    <PileViews ref={this.pileViews} deck={this.state.modelView.deck} hold={this.state.modelView.hold} turned={this.state.modelView.turned} moving={this.state.moving} score={this.state.modelView.score} onDeckClick={this.onDeckClick} onStartDrag={this.onStartDrag} />
                    <CardDragView card={this.state.moving.card} modelView={this.state.modelView} cardX={this.lastMouseX + this.state.moving.mouseOffsetX} cardY={this.lastMouseY + this.state.moving.mouseOffsetY}/>
                </div>
            </section>
        );
    }

    private onDeckClick = () => {
        if (this.modelView.next_card()) {
            this.update_state_no_moving();
        }
    }

    private move_destinations(card: ICardView): IMoveDestination[] {
        const destinationPiles = this.modelView.valid_move_to_destinations(card);
        const dests : IMoveDestination[] = [];
        for (const p of destinationPiles) {
            const holdRef = this.pileViews.current;
            if (holdRef !== null) {
                dests.push({pile: p, box: holdRef.box_for(p)});
            }            
        }
        return dests;
    }

    private onStartDrag = (c: ICardView, box: ClientRect) => {
        this.dragFrom = box;
        const offsetX = (box.left - this.lastMouseX);
        const offsetY = (box.top - this.lastMouseY);
        const dests = this.move_destinations(c);
        const data: ITableData = {
            modelView: this.state.modelView, 
            moving: {card: c, destinations: dests, mouseOffsetX: offsetX, mouseOffsetY: offsetY}
        };
        this.setState(data);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        this.lastMouseX = event.clientX + window.scrollX;
        this.lastMouseY = event.clientY + window.scrollY;
        if (this.state.moving.card !== null) {
            const data: ITableData = {
                modelView: this.state.modelView, 
                moving: {
                    card: this.state.moving.card, 
                    destinations: this.state.moving.destinations, 
                    mouseOffsetX: this.state.moving.mouseOffsetX, 
                    mouseOffsetY: this.state.moving.mouseOffsetY
                }
            };
            this.setState(data);

        }
    }
    
    private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;

        const card = this.state.moving.card;
        if (card === null) {
            this.reset_drag();

            return;
        }
        
        const winning = this.winning_pile();
        if (winning ) {
            
            this.modelView.move_card_to(card, winning );
            
        }
        this.reset_drag();
    }

    private winning_pile() : PileName | null{
        const dminX = this.lastMouseX + this.state.moving.mouseOffsetX;
        const dminY = this.lastMouseY + this.state.moving.mouseOffsetY;
        const dmaxX = dminX + cardWidthValue;
        const dmaxY = dminY + cardLengthValue;
        
        let highestCoverage = 0;
        let winningPile: PileName | null = null;

        for (const dest of this.state.moving.destinations) {
            
            const coverage = this.check_overlap(dest.box, dminX, dminY, dmaxX, dmaxY);
            if (coverage > highestCoverage) {
                winningPile = dest.pile;
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

        if (dminX > box.left + cardWidthValue || dmaxX < box.left || dminY > box.top + cardLengthValue || dmaxY < box.top) {
            return -1;
        }

        let left = dminX;
        let right = box.left + cardWidthValue;
        if (box.left > dminX) {
            left = box.left;
            right = dmaxX;
        }

        let top = dminY;
        let bottom = box.top + cardLengthValue;
        if (box.top > dminY) {
            top = box.top;
            bottom = dmaxY;
        }

        return(right-left) * (bottom-top);
    }

    private handleMouseLeave = () => {
        this.reset_drag();
    }

    private reset_drag() {
        if (this.state.moving.card === null) {
            return;
        }
        this.dragFrom = null;
        this.update_state_no_moving();
    }
    
    private update_state_no_moving() {
        const data: ITableData = {
            modelView: this.modelView.table_data(), 
            moving: {card: null, destinations: [], mouseOffsetX: 0, mouseOffsetY: 0}
        };

        this.setState(data);
    }
}