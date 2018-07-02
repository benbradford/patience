import * as React from 'react'
import {ITableData, ICard, PileName} from '../ModelView/ViewData'
import ModelViewDataSync from '../ModelView/ModelViewDataSync'
import DeckView from './DeckView'
import HoldPileViews from './HoldPileViews'
import {front_style, piled_style} from './Renderer'
import {collect_all_cards_above} from '../ModelView/ViewData'

interface IMoveData {
    card: ICard | null;
    destinations: PileName[];
    mouseOffsetX: number;
    mouseOffsetY: number;
}

interface IGameData {
    table: ITableData;
    moving: IMoveData;
}

export default class TableView extends React.Component<{}, IGameData>{
    
    private modelView = new ModelViewDataSync();
    private lastMouseX = 0;
    private lastMouseY = 0;
    
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
                    <HoldPileViews hold={this.state.table.hold} moving={this.state.moving} onPileClick={this.onPileClick} />
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
                {cards.map( (card: ICard, i: number) => this.render_moving_card(card, i === cards.length-1))}
             </table>
            </section>
        );
    }

    private drag_style() {
        const x = this.lastMouseX + this.state.moving.mouseOffsetX;
        const y = this.lastMouseY + this.state.moving.mouseOffsetY;
        return {
            left: x + "px",
            top: y + "px"
        };
    }

    private render_moving_card(card: ICard, isTop: boolean) {
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

    private onTurnClick = (c: ICard, offsetX : number, offsetY: number) => {
        const dests = this.modelView.valid_move_to_destinations(c);
        const data: IGameData = {
            table: this.state.table, 
            moving: {card: c, destinations: dests, mouseOffsetX: offsetX, mouseOffsetY: offsetY}
        };

        this.setState(data);

    }

    private onPileClick = (c: ICard, offsetX: number, offsetY: number) => {
        const dests = this.modelView.valid_move_to_destinations(c);
        const data: IGameData = {
            table: this.state.table, 
            moving: {card: c, destinations: dests, mouseOffsetX: offsetX, mouseOffsetY: offsetY}
        };

        this.setState(data);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        if (this.state.moving.card !== null) {
            const data: IGameData = {
                table: this.state.table, 
                moving: {card: this.state.moving.card, destinations: this.state.moving.destinations, mouseOffsetX: this.state.moving.mouseOffsetX, mouseOffsetY: this.state.moving.mouseOffsetY}
            };
            this.setState(data);
        }
    }
    
    private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
       this.reset_drag();
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
}