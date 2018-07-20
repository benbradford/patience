import * as React from 'react'

import ModelViewDataSync from '../../ModelView/Cards/ModelViewDataSync'
import FloatingCards from '../../ModelView/Cards/FloatingCards'
import FloatingCard from '../..//ModelView/Cards/FloatingCard';
import FloatingCardView from './FloatingCardView'

interface IFloatingCardsViewProps{
     floatingCards : FloatingCards;
     cardStyles: any;
     modelViewDataSync: ModelViewDataSync;
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
        return ( <FloatingCardView card={fc} cardStyles={this.props.cardStyles} modelViewDataSync={this.props.modelViewDataSync} /> );
    }

}