import * as React from 'react'
import './Cards.css'

export default class DeckView extends React.Component<any, any>{
    
    public render(): JSX.Element {     
        
        return (
            <section>
                <div className="PileDiv">
                    {this.render_turned_card()}
                </div>
                <div className="PileDiv">
                    {this.render_deck()}    
                </div>
            </section>
        );
    }

    private render_deck() {
        if (this.props.deck === null) {
            return ( <p/> );
        }
        if (this.props.deck.cards.length === 0) {
            return ( <section style={this.props.cardStyles.empty()} ref={this.props.deckRef} onMouseDown={this.deckClick}/> );  
        }
        return (
            
            <section style={this.props.cardStyles.front(this.props.deck.cards[this.props.deck.cards.length-1])} ref={this.props.deckRef} onMouseDown={this.deckClick} />
            
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

        if (indexToShow >= this.props.turned.cards.length) {

            return ( <section style={this.props.cardStyles.empty()} ref={this.props.turnedRef} /> );          
        }
   
        return (
           <section>
              <section ref={this.props.turnedRef} style={this.props.cardStyles.front(this.props.turned.cards[this.props.turned.cards.length-1-indexToShow])} onMouseDown={this.turnClick} />
           </section>  
        );
    }

    private deckClick = (): void => {
        this.props.onDeckClick();
    }

    private turnClick = (): void => {
        if (this.props.moving.card !== null || this.props.turned.cards.length === 0) {
            return;
        }
      
        if (this.props.turnedRef.current === null) {
            return;
        }
        const box = this.props.turnedRef.current.getBoundingClientRect();

        this.props.onTurnClick(this.props.turned.cards[this.props.turned.cards.length-1], box);
    }
    
}