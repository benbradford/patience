import { ICardView } from "./ModelViewData";
import {Suit, Face} from '../../Model/Cards/Card'
import FloatingCard from './FloatingCard'

export default class FloatingCards {

    private cards: FloatingCard[] = [];

    public add(card: FloatingCard) {
        if (this.exists(card)) {
            throw Error("card already exists");
        }
        this.cards.push(card);
    }

    public all(): FloatingCard[] {
        return this.cards;
    }

    public has_any(): boolean {
        return this.cards.length > 0;
    }

    public find(card: ICardView | undefined): FloatingCard | null {
        if (card === undefined) { 
            return null; 
        }
        for(const c of this.cards) {
            if (c.proxy().card_face() === card.face && c.proxy().card_suit() === card.suit) {
                return c;
            }
        }
        return null;
    }

    public exists(card: FloatingCard): boolean{
        for(const c of this.cards) {
            if (c.proxy().card_face() === card.proxy().card_face()  && c.proxy().card_suit() === card.proxy().card_suit() ) {
                return true;
            }
        }
        return false;
    }

    public remove_card_view(card: ICardView) {
        return this.remove(card.suit, card.face);
    }

    public remove_floating_card(card: FloatingCard) {
        return this.remove(card.proxy().card_suit(), card.proxy().card_face());
    }

    public remove(suit: Suit, face: Face) {
        for (let i = 0; i < this.cards.length; ++i) {
            if (this.cards[i].proxy().card_face() === face && this.cards[i].proxy().card_suit() === suit ) {
                this.cards.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}