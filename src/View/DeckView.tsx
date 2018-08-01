import * as React from 'react'
import './Cards.css'
import ICardStyles from '../ViewModel/Cards/ICardStyles'
import {ICardView, ICardCollectionViewData} from '../ViewModel/Cards/ViewModelData'

interface IDeckProps {
    cardStyles: ICardStyles;
    deckRef: any;
    turnedRef: any;
    key: any;
    turned: ICardCollectionViewData;
    deck: ICardCollectionViewData;
    hasFloatingCards: boolean;
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
        const deck = this.props.deck;
        if (deck.cards.length === 0) {
            return ( <section style={this.props.cardStyles.empty()} ref={this.props.deckRef} onMouseDown={this.deckClick}/> );  
        }
        return (
            <section style={this.props.cardStyles.front(deck.cards[deck.cards.length-1])} ref={this.props.deckRef} onMouseDown={this.deckClick} />     
        );
    }

    private render_turned_card() {
        const turned = this.props.turned;
 
        if (turned.cards.length === 0) {
            return ( <section style={this.props.cardStyles.empty()} ref={this.props.turnedRef} /> );          
        }
   
        return (
           <section>
              <section ref={this.props.turnedRef} style={this.props.cardStyles.front(turned.cards[turned.cards.length-1])} onMouseDown={this.turnClick} />
           </section>  
        );
    }

    private deckClick = (): void => {
        this.props.onDeckClick();
    }

    private turnClick = (): void => {
        const turned = this.props.turned;

        if (this.props.hasFloatingCards || turned.cards.length === 0) {
            return;
        }
      
        if (this.props.turnedRef.current === null) {
            return;
        }
        const box = this.props.turnedRef.current.getBoundingClientRect();

        this.props.onStartDrag(turned.cards[turned.cards.length-1], box);
    }
    
}