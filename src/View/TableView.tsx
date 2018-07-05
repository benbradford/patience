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

    private onStartDrag = (c: ICardView, offsetX : number, offsetY: number) => {
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
            if (dest.box === null) {
                continue;
            }

            if (dminX > dest.box.left + cardWidthValue || dmaxX < dest.box.left || dminY > dest.box.top + cardLengthValue || dmaxY < dest.box.top) {
                continue;
            }

            let left = dminX;
            let right = dest.box.left + cardWidthValue;
            if (dest.box.left > dminX) {
                left = dest.box.left;
                right = dmaxX;
            }

            let top = dminY;
            let bottom = dest.box.top + cardLengthValue;
            if (dest.box.top > dminY) {
                top = dest.box.top;
                bottom = dmaxY;
            }

            const coverage = (right-left) * (bottom-top);
            if (coverage > highestCoverage) {
                winningPile = dest.pile;
                highestCoverage = coverage;
            }
        }
        return winningPile;
    }

    private handleMouseLeave = () => {
        this.reset_drag();
    }

    private reset_drag() {
        if (this.state.moving.card === null) {
            return;
        }
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