import * as React from 'react'
import {ITableData, ICard} from '../ModelView/ViewData'
import ModelViewDataSync from '../ModelView/ModelViewDataSync'
import DeckView from './DeckView'
import HoldPileViews from './HoldPileViews'

interface IMoveData {
    cards: ICard[];
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
                
                </div>
            </section>
        );
    }

    private onDeckClick = () => {
        if (this.modelView.next_card()) {
            this.update_state_no_moving();
        }
    }

    private onTurnClick = (card: ICard) => {

        // :TODO: start drag
        // need to iterate through piles and see which actions are valid
        // then add those targets to the data
        
        const data: IGameData = {
            table: this.modelView.table_data(), 
            moving: {cards: [card]}
        };

        this.setState(data);
    }
    /*
      private render_dragged() {
        if (this.state.moving.cards.length ===0) {
            return ( <section /> );
        }

        return (
            <section style={this.drag_style()} className="Dragging">

                {render_card(this.state.moving.cards[0]))}
            </section>
        );
    } */

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        // this.dragX = event.clientX;
       // this.dragY = event.clientY;
        
    }
    
    private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
       // this.dragX = event.clientX;
       // this.dragY = event.clientY;
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
            moving: {cards: []}
        };

        this.setState(data);
    }
}