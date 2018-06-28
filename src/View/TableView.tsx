import * as React from 'react'
import {ITableData} from '../ModelView/ViewData'
import ModelViewDataSync from '../ModelView/ModelViewDataSync'
import DeckView from './DeckView'

export default class TableView extends React.Component<{}, ITableData>{
    
    private modelView = new ModelViewDataSync();

    public componentDidMount() {

        this.setState(this.modelView.table_data());
    }

    public render(): JSX.Element {     
        if (this.state === null) {
            return (<p/>);
        }
        return (
            <p>
                <DeckView deck={this.state.deck} /> 
            </p>
        );
    }
}