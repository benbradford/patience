import * as React from 'react'
import {ITableData, ICard, PileName} from '../ModelView/ViewData'
import ModelViewDataSync from '../ModelView/ModelViewDataSync'
import DeckView from './DeckView'
import HoldPileViews from './HoldPileViews'
import {front_style} from './Renderer'

interface IMoveData {
    card: ICard | null;
    destinations: PileName[];
    moveX: number;
    moveY: number;
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
        return (
            <section style={this.drag_style()} className="Dragging">
             <table>
                {this.render_moving_card(this.state.moving.card)}
             </table>
            </section>
        );
    }

    private drag_style() {
        const x = this.lastMouseX + this.state.moving.moveX;
        const y = this.lastMouseY + this.state.moving.moveY;
        return {
            left: x + "px",
            top: y + "px"
        };
    }

    private render_moving_card(card: ICard) {
        return ( <tr> <section style={front_style(card)} /> </tr> );
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
            moving: {card: c, destinations: dests, moveX: offsetX, moveY: offsetY}
        };

        this.setState(data);

    }

    private onPileClick = (c: ICard, offsetX: number, offsetY: number) => {
        const dests = this.modelView.valid_move_to_destinations(c);
        const data: IGameData = {
            table: this.state.table, 
            moving: {card: c, destinations: dests, moveX: offsetX, moveY: offsetY}
        };

        this.setState(data);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        if (this.state.moving.card !== null) {
            const data: IGameData = {
                table: this.state.table, 
                moving: {card: this.state.moving.card, destinations: this.state.moving.destinations, moveX: this.state.moving.moveX, moveY: this.state.moving.moveY}
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
            moving: {card: null, destinations: [], moveX: 0, moveY: 0}
        };

        this.setState(data);
    }
}