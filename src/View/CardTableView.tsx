import * as React from 'react'
import './Cards.css'
import {cardImages} from './CardImages'
import {Suit, Face} from '../Model/Cards/Card'

interface ICardView {
    suit : Suit;
    face : Face;
    turnedUp : boolean;
}

interface IHoldPileView {
    cards : ICardView[];
}

export default class CardTableView extends React.Component<{}, {}>{

    private pile : IHoldPileView;


    public render() {  
        this.pile = {
            cards: [
                {
                    suit : Suit.clubs,
                    face : Face.ace,
                    turnedUp : false
                },
                {
                    suit : Suit.clubs,
                    face : Face.king,
                    turnedUp : false,
                },
                {
                    suit : Suit.hearts,
                    face : Face.jack,
                    turnedUp : true,
                },
                {
                    suit : Suit.spades,
                    face : Face.ten,
                    turnedUp : true,
                },
                {
                    suit : Suit.diamonds,
                    face : Face.nine,
                    turnedUp : true,
                },
                {
                    suit : Suit.clubs,
                    face : Face.seven,
                    turnedUp : true,
                }
                
            ]
        }

        return (
            <p>
                
                {this.render_pile()}

            </p>
        );
    }

    private render_pile() : any {
        return (
            <table className="PileTable"> 
             {this.pile.cards.map( card => this.render_card(card))}</table>
        )
    }

    private render_card(card : ICardView) {
        if (card === this.pile.cards[this.pile.cards.length-1]) {
            return (       
                  <section style={this.front_style(card)}/>
            );
        } 
        return (
            <tr className="PileTR">
                <section style={this.piled_style(card)}/>
            </tr>
        );
    }

    private piled_style(card : ICardView) {
        const img = this.card_image(card);  
        return {
            width: "150px",
            height: "70px",
            backgroundSize: "150px 200px",
            backgroundImage: "url(" + img + ")",
            padding:"0",
            margin:"0"
          };     
    }

    private front_style(card : ICardView) {

        const img = this.card_image(card);  
        return {
            width: "150px",
            height: "200px",
            backgroundSize: "150px 200px",
            backgroundImage: "url(" + img + ")",
            padding:"0",
            margin:"0"
          };     
    }

    private card_image(card : ICardView) {
        if (card.turnedUp === false) {
            return cardImages[52];
        }
        let indexStart = 0;
        if (card.suit === Suit.spades) {
            indexStart = 13;
        } else if (card.suit === Suit.diamonds) {
            indexStart = 26;
        } else if (card.suit === Suit.hearts) {
            indexStart = 39;
        }
        return cardImages[indexStart + card.face];
    }
    
/*
    private handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        this.setState({
          x: event.clientX,
          y: event.clientY,
        });
      };
    */
}