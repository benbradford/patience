import * as React from 'react'
import {ITableData, ICard, PileName} from '../ModelView/ViewData'
import ModelViewDataSync from '../ModelView/ModelViewDataSync'
import DeckView from './DeckView'
import HoldPileViews from './HoldPileViews'
import {front_style, piled_style, cardWidthValue, cardLengthValue} from './Renderer'
import {collect_all_cards_above} from '../ModelView/ViewData'
import Mouse from './Mouse'

interface IMoveDestination {
    pile: PileName;
    box: ClientRect | null; 
}

interface IMoveData {
    card: ICard | null;
    destinations: IMoveDestination[];
    mouseOffsetX: number;
    mouseOffsetY: number;
}

interface IGameData {
    table: ITableData;
    moving: IMoveData;
}

export default class TableView extends React.Component<{}, IGameData>{
    
    private modelView = new ModelViewDataSync();
    private holdPileViews = React.createRef<HoldPileViews>();

    public componentDidMount() {
       this.update_state_no_moving();
    }

    public render(): JSX.Element {     
        if (this.state === null) {
            return (<p/>);
        }
        return (
            <section>
                <div onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseLeave} className="Table"> 
                    
                    <DeckView deck={this.state.table.deck} turned={this.state.table.turned} moving={this.state.moving} onDeckClick={this.onDeckClick} onTurnClick={this.onTurnClick} /> 
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    <HoldPileViews ref={this.holdPileViews} hold={this.state.table.hold} moving={this.state.moving} onPileClick={this.onPileClick} />
                    {this.render_moving()}
                </div>
            </section>
        );
    }

    private render_moving() {
        if (this.state.moving.card === null) {
            return ( <p/> );
        }

        const cards = collect_all_cards_above(this.state.moving.card, this.state.table);
        
        return (
            <section style={this.drag_style()} className="Dragging">
             <table>
                {cards.map( (card: ICard, i: number) => this.render_moving_card(card, i === 0,  i === cards.length-1))}
             </table>
            </section>
        );
    }

    private drag_style() {
        const x = Mouse.lastMouseX + this.state.moving.mouseOffsetX;
        const y = Mouse.lastMouseY + this.state.moving.mouseOffsetY;
        return {
            left: x + "px",
            top: y + "px"
        };
    }

    private render_moving_card(card: ICard, isTarget: boolean, isTop: boolean) {

        if (isTop) {
            return ( <tr> <section style={front_style(card)} /> </tr> );
        }
        return ( <tr> <section style={piled_style(card)} /> </tr> );
    }

    private onDeckClick = () => {
        if (this.modelView.next_card()) {
            this.update_state_no_moving();
        }
    }

    private move_destinations(card: ICard): IMoveDestination[] {
        const destinationPiles = this.modelView.valid_move_to_destinations(card);
        const dests : IMoveDestination[] = [];
        for (const p of destinationPiles) {
            const holdRef = this.holdPileViews.current;
            if (holdRef !== null) {
                dests.push({pile: p, box: holdRef.box_for(p)});
            }            
        }
        return dests;
    }

    private onTurnClick = (c: ICard, offsetX : number, offsetY: number) => {
        const dests = this.move_destinations(c);
        const data: IGameData = {
            table: this.state.table, 
            moving: {card: c, destinations: dests, mouseOffsetX: offsetX, mouseOffsetY: offsetY}
        };
        this.setState(data);
    }

    private onPileClick = (c: ICard, offsetX: number, offsetY: number) => {
        const dests = this.move_destinations(c);
        const data: IGameData = {
            table: this.state.table, 
            moving: {card: c, destinations: dests, mouseOffsetX: offsetX, mouseOffsetY: offsetY}
        };
        this.setState(data);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        Mouse.lastMouseX = event.clientX;
        Mouse.lastMouseY = event.clientY;
        if (this.state.moving.card !== null) {
            const data: IGameData = {
                table: this.state.table, 
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

        Mouse.lastMouseX = event.clientX;
        Mouse.lastMouseY = event.clientY;
        
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
        const dminX = Mouse.lastMouseX + this.state.moving.mouseOffsetX;
        const dminY = Mouse.lastMouseY + this.state.moving.mouseOffsetY;
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
        const data: IGameData = {
            table: this.modelView.table_data(), 
            moving: {card: null, destinations: [], mouseOffsetX: 0, mouseOffsetY: 0}
        };

        this.setState(data);
    }
/*
    private set_pile_can_be_laid_to(card: ICard, rect: ClientRect) {
         if (this.state.moving.destinations.findIndex(p=>p.pile===card.pileName) >=0 ) {
            return;
        }
        
        const minX = Mouse.lastMouseX + this.state.moving.mouseOffsetX;
        const minY = Mouse.lastMouseY + this.state.moving.mouseOffsetY;
        const maxX = minX + cardWithValue;
        const maxY = minY + cardLengthValue;
        if (rect.left > maxX || rect.left+cardWithValue < minX ||
            rect.top > maxY || rect.top+cardLengthValue < minY) {
                return;
            }
        this.currentTargets.push(card.pileName);
    }
    */
}