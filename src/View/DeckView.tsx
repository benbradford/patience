import * as React from 'react'
import {cardWidth, cardLength, front_style} from  './CardRenderer'
import './Cards.css'

export default class DeckView extends React.Component<any, any>{
    
    private turnedRef = React.createRef<HTMLElement>();

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
            
                 <section style={front_style(this.props.deck.cards[this.props.deck.cards.length-1])} onMouseDown={this.deckClick} />
            
        );
    }

    private render_turned_card() {
        if (this.props.turned === null) {
            return ( <p/> );
        }
        
        let indexToShow : number = 0;
        if (this.props.moving.card === this.props.turned.cards[this.props.turned.cards.length-1]) {
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
              <section ref={this.turnedRef} style={front_style(this.props.turned.cards[this.props.turned.cards.length-1-indexToShow])} onMouseDown={this.turnClick} />
           </section>  
        );
    }

    private deckClick = (): void => {
        this.props.onDeckClick();
    }

    private turnClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (this.props.moving.card !== null) {
            return;
        }
        if (this.props.turned.cards.length === 0) {
            return;
        }
        if (this.turnedRef.current === null) {
            return;
        }
        const box = this.turnedRef.current.getBoundingClientRect();
        const offsetX = (box.left - event.clientX);
        const offsetY = (box.top - event.clientY);

        this.props.onTurnClick(this.props.turned.cards[this.props.turned.cards.length-1], offsetX, offsetY);
    }
    
}