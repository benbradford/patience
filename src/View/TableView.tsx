import * as React from 'react'
import {ITableData, IMoveData} from '../ModelView/ViewData'
import ModelViewDataSync from '../ModelView/ModelViewDataSync'
import DeckView from './DeckView'

interface IGameData {
    table: ITableData;
    moving: IMoveData;
}

export default class TableView extends React.Component<{}, IGameData>{
    
    private modelView = new ModelViewDataSync();

    public componentDidMount() {
        const data: IGameData = {
            table: this.modelView.table_data(), 
            moving: {cards: []}
        };

        this.setState(data);
    }

    public render(): JSX.Element {     
        if (this.state === null) {
            return (<p/>);
        }
        return (
            <p>
                <DeckView deck={this.state.table.deck} turned={this.state.table.turned} moving={this.state.moving} onDeckClick={this.onDeckClick} /> 
            </p>
        );
    }

    private onDeckClick = () => {
        if (this.modelView.next_card()) {
            const data: IGameData = {
                table: this.modelView.table_data(), 
                moving: {cards: []}
            };

            this.setState(data);
        }
    }
}