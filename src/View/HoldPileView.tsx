import * as React from 'react'
import './Cards.css'
import {ICard} from '../ModelView/ViewData'
import {piled_style, front_style, cardWidth, cardLength} from './Renderer'

export default class HoldPileView extends React.Component<any, any>{
    
    public render(): JSX.Element {     
        
        return (
            <div className="PileDiv">
              {this.props.pile.cards.map( (card: ICard) => this.render_card(card))}
             </div>

        );
    }

    private render_card(card: ICard) {

        if (this.props.pile.cards.length === 0) {
            const emptyStyle = {
                width: cardWidth,
                height: cardLength,
                borderColor: "black",
                border: "solid"
    
            };

            return (
                <section>
                 <div className="PileDiv">
                    <section style={emptyStyle} />
                 </div>
                </section>
            )
        }

        let s = piled_style(card);

        if (card === this.props.pile.cards[this.props.pile.cards.length-1]) {
            s = front_style(card);
        } 

        return (       
            <tr>
                <section style={s}/> 
            </tr>
        );
        
    }

}