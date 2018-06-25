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

export class Card {
    
    public readonly suit: Suit;
    public readonly face: Face;
    public readonly colour: Colour;
    public collection : CardCollection | undefined;
    private facingUp: boolean;
    
    constructor(suit: Suit, face: Face, facingUp : boolean = false) {
        this.suit = suit;
        this.face = face;
        this.facingUp = facingUp;
        this.collection = undefined;
        if (this.suit === Suit.hearts || this.suit === Suit.diamonds) {
            this.colour = Colour.red;
        } else {
            this.colour = Colour.black;
        }
    }

    public is_turned_up(): boolean {
        return this.facingUp;
    }

    public turn() {
        this.facingUp = !this.facingUp;
    }

    public validate(): boolean {
        if (this.collection === undefined) {
            return true;
        }
        return this.collection.contains(this) && this.collection.validate();
    }

}