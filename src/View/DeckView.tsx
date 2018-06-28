import * as React from 'react'
import {render_card} from './Renderer'
import './Cards.css'

export default class DeckView extends React.Component<any, any>{
    
    public render(): JSX.Element {     
        
        return (
            <section>
            <div className="PileDiv">
                {this.render_turned_card()}
            </div>
            <div className="PileDiv">
                {this.render_deck_card()}
            </div>
            </section>
        );
    }

    private render_deck_card() {
        if (this.props.deck === null) {
            return ( <p/> );
        }
        return (
            <section>
               {render_card(this.props.deck, this.props.deck.cards[this.props.deck.cards.length-1], this.deckClick)}
            </section>
        );
    }

    private render_turned_card() {
        if (this.props.turned === null) {
            return ( <p/> );
        }
       
        return (
           <section>
              {render_card(this.props.turned, this.props.turned.cards[this.props.turned.cards.length-1], this.turnClick)}
           </section>  
        );
    }

    private deckClick = (): void => {
        this.props.onDeckClick();
    }

    private turnClick = (): void => {
        this.props.onDeckClick();
    }
    
}