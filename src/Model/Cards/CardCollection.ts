import {Card, Suit, Face} from './Card'

export default class CardCollection {
    
    public readonly min: number;
    public readonly max: number;
    private cards : Card[] = [];
    
    constructor(min: number = 0, max:number = Number.MAX_SAFE_INTEGER) {
        this.min = min;
        this.max = max;
    }
    public is_empty(): boolean {
        return this.cards.length === 0;
    }

    public remove(numFromTop : number = 0): Card | null {
        if (this.size() === this.min) {
            return null;
        }
        const index = this.cards.length-1-numFromTop;
        if (index < this.min) {
            return null;
        }
        const card: Card = this.cards[index];
        this.cards.splice(index, 1);
        card.collection = undefined;
        return card;
    }

    public remove_card(card: Card): Card | null {
        if (this.size() === this.min) {
            return null;
        }
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
        if (this.contains(card) || card.collection !== undefined || this.size()+1 === this.max) {
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
        if (this.size() < this.min) {
            return false;
        }
        if (this.size() >= this.max) {
            return false;
        }
        for (const c of this.cards) {
            if (c.collection === undefined || c.collection !== this) {
                return false;
            }
        }
        return true;
    }

}