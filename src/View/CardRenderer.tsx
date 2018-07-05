import * as React from 'react'
import {ICardView, IPileView} from '../ModelView/ModelViewData'
import {Suit} from '../Model/Cards/Card'
import {cardImages} from './CardImages'

const emptyCard = [
    require('../Asset/organic-tiles.png')
];
export const cardWidthValue = 120;
export const cardLengthValue = 160;
export const cardWidth = cardWidthValue + "px";
export const cardLength = " " + cardLengthValue + "px";
const cardBackgroundSize = (cardWidthValue + 4) + "px " + (cardLengthValue + 4) + "px";
const previewLength = " " + (cardLengthValue/5) +"px";

export function render_card(pile: IPileView, card : ICardView, mouseDown: (card: ICardView)=>void): JSX.Element {

    const f = () => { mouseDown(card); };

    let s = piled_style(card);

    if (card === pile.cards[pile.cards.length-1]) {
        s = front_style(card);
    } 

    return (       
        <tr>
            <section style={s} onMouseDown={f}/> 
        </tr>
    );
}



export function render_empty(cardRef: React.RefObject<HTMLElement>) {
    
    return (
        <section>
         <div className="PileDiv">
            <section style={empty_style()} ref={cardRef} />
         </div>
        </section>
    )
}

function card_style(img: any, length: string) {
     
    return {
        width: cardWidth,
        height: length,
        backgroundSize: cardBackgroundSize,
        backgroundPosition: "-2px -2px",
        backgroundImage: "url(" + img + ")",
        padding:"0",
        margin:"0",
        lineHeight:"0",
        borderColor:"black",
        borderSize:"0.1px",
        borderStyle:"ridge",
        borderWidth: "thin",
        backgroundOrigin:"content-box"
      };     
}

export function empty_style() {
    return card_style(emptyCard, cardLength);
}

export function piled_style(card : ICardView) {
   return card_style(card_image(card), previewLength);
}

export function front_style(card : ICardView) {
    return card_style(card_image(card), cardLength);
}

function card_image(card : ICardView) {
    if (card.turned === false) {
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
