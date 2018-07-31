import * as React from 'react'

import ViewModelDataSync from '../../ViewModel/Cards/ViewModelDataSync'
import FloatingCards from '../../ViewModel/Cards/FloatingCards'
import FloatingCard from '../..//ViewModel/Cards/FloatingCard';
import FloatingCardView from './FloatingCardView'

interface IFloatingCardsViewProps{
     floatingCards: FloatingCards;
     cardStyles: any;
     viewModelDataSync: ViewModelDataSync;
}

export default class FloatingCardsView extends React.Component<IFloatingCardsViewProps, any>{
    
    public render(): JSX.Element { 
        return (
            <section>
             {this.props.floatingCards.all().map( (card: FloatingCard) => this.render_floating(card))}
            
            </section>
        );
    }

    private render_floating(fc: FloatingCard) {
        return ( <FloatingCardView card={fc} cardStyles={this.props.cardStyles} viewModelDataSync={this.props.viewModelDataSync} /> );
    }

}