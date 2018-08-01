import * as React from 'react'

import {IFloatingCard} from '../../ViewModel/Cards/ViewModelData'
import FloatingCardView from './FloatingCardView'

interface IFloatingCardsViewProps{
     floatingCards: IFloatingCard[] | null;
     cardStyles: any;
}

export default class FloatingCardsView extends React.Component<IFloatingCardsViewProps, any>{
    
    public render(): JSX.Element { 
        if (this.props.floatingCards === null) {
            return <p/>
        }
        return (
            <section>
             {this.props.floatingCards.map( (card: IFloatingCard) => this.render_floating(card))}
            
            </section>
        );
    }

    private render_floating(fc: IFloatingCard) {
        return ( <FloatingCardView card={fc} cardStyles={this.props.cardStyles} /> );
    }

}