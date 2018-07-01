import * as React from 'react'
import {ITableData, ICard, PileName} from '../ModelView/ViewData'
import ModelViewDataSync from '../ModelView/ModelViewDataSync'
import DeckView from './DeckView'
import HoldPileViews from './HoldPileViews'
import {front_style} from './Renderer'

interface IMoveData {
    cards: ICard[];
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
                    <HoldPileViews hold={this.state.table.hold} />
                    {this.render_moving()}
                </div>
            </section>
        );
    }

    private render_moving() {
        if (this.state.moving.cards === null) {
            return ( <p/> );
        }
        return (
            <section style={this.drag_style()} className="Dragging">
             <table>
                {this.state.moving.cards.map( card => this.render_moving_card(card))}
             </table>
            </section>
        );
    }

    private drag_style() {
        return {
            left: this.state.moving.moveX + "px",
            top: this.state.moving.moveY + "px"
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

    private onTurnClick = (card: ICard) => {
        // :TODO: move in x and y and offset
        const dests = this.modelView.valid_move_to_destinations(card);
        const data: IGameData = {
            table: this.state.table, 
            moving: {cards: [card], destinations: dests, moveX: this.state.moving.moveX, moveY: this.state.moving.moveY}
        };

        this.setState(data);
        /*if (data.length > 0) {
            this.modelView.move_card_to(card, data[0]);
        }*/
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (this.state.moving.cards !== null) {
            const data: IGameData = {
                table: this.state.table, 
                moving: {cards: this.state.moving.cards, destinations: this.state.moving.destinations, moveX: event.clientX, moveY: event.clientY}
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
        if (this.state.moving.cards.length === 0) {
            return;
        }
        this.update_state_no_moving();
    }
    
    private update_state_no_moving() {
        const data: IGameData = {
            table: this.modelView.table_data(), 
            moving: {cards: [], destinations: [], moveX: 0, moveY: 0}
        };

        this.setState(data);
    }

}