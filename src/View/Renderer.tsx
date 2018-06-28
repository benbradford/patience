import * as React from 'react'
import {ICard, ICardPile} from '../ModelView/ViewData'
import {Suit} from '../Model/Cards/Card'
import {cardImages} from './CardImages'

export const cardWidth = "120px";
export const cardLength = " 160px";
const previewLength = " 30px";

export function render_card(pile: ICardPile, card : ICard, mouseDown: (card: ICard)=>void): JSX.Element {

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

export function piled_style(card : ICard) {
    const img = card_image(card);  
    return {
        width: cardWidth,
        height: previewLength,
        backgroundSize: cardWidth + cardLength,
        backgroundImage: "url(" + img + ")",
        padding:"0",
        margin:"0"
      };     
}

export function front_style(card : ICard) {
    const img = card_image(card);  
    return {
        width: cardWidth,
        height: cardLength,
        backgroundSize: cardWidth + cardLength,
        backgroundImage: "url(" + img + ")",
        padding:"0",
        margin:"0"
      };     
}

function card_image(card : ICard) {
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
