import CardCollection from './CardCollection'

export enum Suit {
    hearts,
    spades,
    clubs,
    diamonds
}

export enum Colour {
    red,
    black
}

export enum Face {
    ace, two, three, four, five, six, seven, eight, nine, ten, jack, queen, king
}

export enum Turned {
    up,
    down,
}
export class Card {
    
    public readonly suit: Suit;
    public readonly face: Face;
    public collection : CardCollection | undefined;
    private turned: Turned;
    
    constructor(suit: Suit, face: Face, turned: Turned) {
        this.suit = suit;
        this.face = face;
        this.turned = turned;
        this.collection = undefined;
    }

    public is_turned_up(): boolean {
        return this.turned === Turned.up;
    }

    public turn(): Card {
        if (this.is_turned_up()) {
            this.turned = Turned.down;
        } else {
            this.turned = Turned.up;
        }
        return this;
    }

    public colour(): Colour {
        if (this.suit === Suit.hearts || this.suit === Suit.diamonds) {
            return Colour.red;
        }
        return Colour.black;
    }

    public validate(): boolean {
        if (this.collection === undefined) {
            return true;
        }
        return this.collection.contains(this) && this.collection.validate();
    }

}