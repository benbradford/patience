import * as React from 'react'
import {cardWidth, cardLength, front_style} from './Renderer'
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
                 <section style={front_style(this.props.deck.cards[this.props.deck.cards.length-1])} onMouseDown={this.deckClick} />
            </section>
        );
    }

    private render_turned_card() {
        if (this.props.turned === null) {
            return ( <p/> );
        }
        
        let indexToShow : number = 0;
        if (this.props.moving.cards.length > 0 && this.props.moving.cards[0] === this.props.turned.cards[this.props.turned.cards.length-1]) {
            ++indexToShow;
        }

        const emptyStyle = {
            width: cardWidth,
            height: cardLength,
            borderColor: "black",
            border: "solid"

        };

        if (indexToShow >= this.props.turned.cards.length) {

            return ( <section style={emptyStyle} /> );          
        }
   
        return (
           <section>
              <section style={front_style(this.props.turned.cards[this.props.turned.cards.length-1-indexToShow])} onMouseDown={this.turnClick} />
           </section>  
        );
    }

    private deckClick = (): void => {
        this.props.onDeckClick();
    }

    private turnClick = (): void => {
        if (this.props.turned.cards.length === 0) {
            this.props.onDeckClick();
            return;
        }
        this.props.onTurnClick(this.props.turned.cards[this.props.turned.cards.length-1]);
    }
    
}