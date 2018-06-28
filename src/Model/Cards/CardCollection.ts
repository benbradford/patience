import {Card, Suit, Face} from './Card'

export default class CardCollection {
    
    private cards : Card[] = [];

    public is_empty(): boolean {
        return this.cards.length === 0;
    }

    public remove(numFromTop : number = 0): Card | null{
        const index = this.cards.length-1-numFromTop;
        if (index < 0) {
            return null;
        }
        const card: Card = this.cards[index];
        this.cards.splice(index, 1);
        card.collection = undefined;
        return card;
    }

    public remove_card(card: Card): Card | null {
        for (let i = 0; i < this.cards.length; ++i) {
            if (this.cards[i] === card) {
                this.cards.splice(i, 1);
                card.collection = undefined;
                return card;
            }
        }
        return null;
    }

    public peek(numFromTop : number = 0): Card | null {
        const index = this.cards.length-1-numFromTop;
        if (index < 0) {
            return null;
        }
        return this.cards[index];
    }

    public contains(card : Card): boolean {
        for (const c of this.cards) {
            if (c === card) {
                return true;
            }
        }
        return false;
    }

    public find(suit: Suit, face: Face): Card | null {
        for (const c of this.cards) {
            if (c.suit === suit && c.face === face) {
                return c;
            }
        }
        return null;
    }

    public push(card : Card): Card | null {
        if (this.contains(card) || card.collection !== undefined) {
            return null;
        }
        this.cards.push(card);
        card.collection = this;
        return card;
    }

    public size() : number {
        return this.cards.length;
    }

    public validate() : boolean {
        for (const c of this.cards) {
            if (c.collection === undefined || c.collection !== this) {
                return false;
            }
        }
        return true;
    }

}