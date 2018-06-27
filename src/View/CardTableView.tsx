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


    private piles : IHoldPileView[] = [];

    private dragging : IHoldPileView = {cards: []};
    private dragX = 0;
    private dragY = 0;
    private draggedFromPile : IHoldPileView | null = null;

    private readonly cardWidth = "120px";
    private readonly cardLength = " 160px";
    private readonly previewLength = " 30px";

    constructor(a: any, b: any) {
        super(a,b);
        const p0 : IHoldPileView = {
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
                }  
            ]
        }
    
       const p1 : IHoldPileView = {
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

        const p2 : IHoldPileView = {
            cards: [
                {
                    suit : Suit.hearts,
                    face : Face.three,
                    turnedUp : false
                }
            ]
        };
        this.piles.push(p0);
        this.piles.push(p1);
        this.piles.push(p2);
        this.piles.push({cards:[]});
    }
    public render(): JSX.Element {     
  
        return (
            <div onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseLeave} className="Table">   
                {this.dragX} - {this.dragY}   
                
                {this.piles.map(pile => this.render_pile(pile))}                 
                
                {this.render_drag()}     
                
            </div>
        );
    }

    private render_drag(): JSX.Element {
        if (this.dragging.cards.length === 0) {
            return (<p />);
        }
        return (
            <table className="DragTable" > 
              <section style={this.drag_style()} className="Dragging">

                {this.dragging.cards.map( card => this.render_card(this.dragging, card))}
              </section>
            </table>
        )
    }

    private render_pile(pile : IHoldPileView): JSX.Element{
        if (pile.cards.length === 0) {
            return (
                <section>
                 <div className="PileDiv">
                    <section style={this.empty_style()} />
                 </div>
                </section>
            )
        }
        return (
            <section>
             <div className="PileDiv">
              {pile.cards.map( card => this.render_card(pile, card))}
             </div>
            </section>
        )
    }

    private render_card(pile: IHoldPileView, card : ICardView): JSX.Element {

        let s = this.piled_style(card);

        if (card === pile.cards[pile.cards.length-1]) {
            s = this.front_style(card);
        } 

        const f = () => { this.handleMouseDown(card); };

        return (       
            <tr>
                <section style={s} onMouseDown={f}/> 
            </tr>
        );
    }

    private piled_style(card : ICardView) {
        const img = this.card_image(card);  
        return {
            width: this.cardWidth,
            height: this.previewLength,
            backgroundSize: this.cardWidth + this.cardLength,
            backgroundImage: "url(" + img + ")",
            padding:"0",
            margin:"0"
          };     
    }

    private front_style(card : ICardView) {
        const img = this.card_image(card);  
        return {
            width: this.cardWidth,
            height: this.cardLength,
            backgroundSize: this.cardWidth + this.cardLength,
            backgroundImage: "url(" + img + ")",
            padding:"0",
            margin:"0"
          };     
    }

    private empty_style() {
        return {
            width: this.cardWidth,
            height: this.cardLength,
            borderColor: "black",
            border: "solid"

        }
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
        let pile : IHoldPileView | null = null;

        for (const p of this.piles) {
           
            for (let i = 0; i < p.cards.length; ++i) {
                if (p.cards[i] === card) {
                    fromIndex = i;
                    pile = p;
                    break;
                }
            }
        }

       if (fromIndex === -1 || pile === null) {
           return;
       }

       this.dragging.cards = pile.cards.slice(fromIndex, pile.cards.length);
       this.draggedFromPile = pile;
       pile.cards.splice(fromIndex, pile.cards.length-fromIndex);

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
        this.reset_drag();
    }

    private handleMouseLeave = () => {
        this.reset_drag();
    }

    private reset_drag() {
        if (this.draggedFromPile === null) {
            return;
        }
        for (const card of this.dragging.cards) {
            this.draggedFromPile.cards.push(card);
        }
        this.dragging.cards = [];
        this.draggedFromPile = null;
        this.setState({});
    }
}