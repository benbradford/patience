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

    private pile : IHoldPileView = {
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

    private dragging : IHoldPileView = {cards: []};
    private dragX = 0;
    private dragY = 0;

    public render() {         
        return (
            <div onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} className="Table">   
                {this.dragX} - {this.dragY}   
                {this.render_drag()}        
                {this.render_pile()}
            </div>
        );
    }

    private render_drag() {
        if (this.dragging.cards.length === 0) {
            return;
        }
        return (
            <table className="PileTable" > 
              <section style={this.drag_style()} className="Dragging">

                {this.dragging.cards.map( card => this.render_card(this.dragging, card))}
              </section>
            </table>
        )
    }

    private render_pile() : any {
        return (
            <table className="PileTable"> 
              {this.pile.cards.map( card => this.render_card(this.pile, card))}
            </table>
        )
    }

    private render_card(pile: IHoldPileView, card : ICardView) {

        let s = this.piled_style(card);

        if (card === pile.cards[pile.cards.length-1]) {
            s = this.front_style(card);
        } 

        const f = () => { this.handleMouseDown(card); };

        return (       
            <tr className="PileTR">
                <section style={s} onMouseDown={f}/> 
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

    private drag_style() {
        return {
            left: this.dragX + "px",
            top: this.dragY + "px"
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
    

    private handleMouseDown = (card : ICardView) => {
        let fromIndex = -1;
       for (let i = 0; i < this.pile.cards.length; ++i) {
           if (this.pile.cards[i] === card) {
                fromIndex = i;
                break;
           }
       }

       if (fromIndex === -1) {
           return;
       }

       this.dragging.cards = this.pile.cards.slice(fromIndex, this.pile.cards.length);
   
       this.pile.cards.splice(fromIndex, this.pile.cards.length-fromIndex);

       this.setState({});
    };

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        this.dragX = event.clientX;
        this.dragY = event.clientY;
        this.setState({});
    }
    
    private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        this.dragX = event.clientX;
        this.dragY = event.clientY;

        for (const card of this.dragging.cards) {
            this.pile.cards.push(card);
        }
        this.dragging.cards = [];

        this.setState({});
    }
}