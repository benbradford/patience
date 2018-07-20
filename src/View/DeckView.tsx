import * as React from 'react'
import './Cards.css'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import FloatingCards from '../ModelView/Cards/FloatingCards'
import ICardStyles from './ICardStyles';
import {ICardView} from '../ModelView/Cards/ModelViewData'

interface IDeckProps {
    cardStyles: ICardStyles;
    deckRef: any;
    turnedRef: any;
    key: any;
    modelView: SolitaireModelView;
    floatingCards: FloatingCards;
    onDeckClick: () => void;
    onStartDrag: (c: ICardView, box: ClientRect) => void;
}

export default class DeckView extends React.Component<IDeckProps, any>{
    
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

        const deck = this.props.modelView.deck();
        if (deck.cards.length === 0) {
            return ( <section style={this.props.cardStyles.empty()} ref={this.props.deckRef} onMouseDown={this.deckClick}/> );  
        }
        return (
            
            <section style={this.props.cardStyles.front(deck.cards[deck.cards.length-1])} ref={this.props.deckRef} onMouseDown={this.deckClick} />
            
        );
    }

    private render_turned_card() {
        const turned = this.props.modelView.turned();

        let indexToShow : number = 0;
        if (this.props.floatingCards.find(turned.cards[turned.cards.length-1])) {
            ++indexToShow;
        }

        if (indexToShow >= turned.cards.length) {

            return ( <section style={this.props.cardStyles.empty()} ref={this.props.turnedRef} /> );          
        }
   
        return (
           <section>
              <section ref={this.props.turnedRef} style={this.props.cardStyles.front(turned.cards[turned.cards.length-1-indexToShow])} onMouseDown={this.turnClick} />
           </section>  
        );
    }

    private deckClick = (): void => {
        this.props.onDeckClick();
    }

    private turnClick = (): void => {
        const turned = this.props.modelView.turned();

        if (this.props.floatingCards.has_any() || turned.cards.length === 0) {
            return;
        }
      
        if (this.props.turnedRef.current === null) {
            return;
        }
        const box = this.props.turnedRef.current.getBoundingClientRect();

        this.props.onStartDrag(turned.cards[turned.cards.length-1], box);
    }
    
}