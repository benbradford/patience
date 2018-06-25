import {Suit, Face, Turned, Card} from './Card'

export default class DeckMaker {

    public make_full_deck(): Card[] {
        const cards : Card[] = [];
        cards.push(new Card(Suit.hearts, Face.ace, Turned.down));
        cards.push(new Card(Suit.hearts, Face.two, Turned.down));
        cards.push(new Card(Suit.hearts, Face.three, Turned.down));
        cards.push(new Card(Suit.hearts, Face.four, Turned.down));
        cards.push(new Card(Suit.hearts, Face.five, Turned.down));
        cards.push(new Card(Suit.hearts, Face.six, Turned.down));
        cards.push(new Card(Suit.hearts, Face.seven, Turned.down));
        cards.push(new Card(Suit.hearts, Face.eight, Turned.down));
        cards.push(new Card(Suit.hearts, Face.nine, Turned.down));
        cards.push(new Card(Suit.hearts, Face.ten, Turned.down));
        cards.push(new Card(Suit.hearts, Face.jack, Turned.down));
        cards.push(new Card(Suit.hearts, Face.queen, Turned.down));
        cards.push(new Card(Suit.hearts, Face.king, Turned.down));
        cards.push(new Card(Suit.spades, Face.ace, Turned.down));
        cards.push(new Card(Suit.spades, Face.two, Turned.down));
        cards.push(new Card(Suit.spades, Face.three, Turned.down));
        cards.push(new Card(Suit.spades, Face.four, Turned.down));
        cards.push(new Card(Suit.spades, Face.five, Turned.down));
        cards.push(new Card(Suit.spades, Face.six, Turned.down));
        cards.push(new Card(Suit.spades, Face.seven, Turned.down));
        cards.push(new Card(Suit.spades, Face.eight, Turned.down));
        cards.push(new Card(Suit.spades, Face.nine, Turned.down));
        cards.push(new Card(Suit.spades, Face.ten, Turned.down));
        cards.push(new Card(Suit.spades, Face.jack, Turned.down));
        cards.push(new Card(Suit.spades, Face.queen, Turned.down));
        cards.push(new Card(Suit.spades, Face.king, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.ace, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.two, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.three, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.four, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.five, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.six, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.seven, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.eight, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.nine, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.ten, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.jack, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.queen, Turned.down));
        cards.push(new Card(Suit.diamonds, Face.king, Turned.down));
        cards.push(new Card(Suit.clubs, Face.ace, Turned.down));
        cards.push(new Card(Suit.clubs, Face.two, Turned.down));
        cards.push(new Card(Suit.clubs, Face.three, Turned.down));
        cards.push(new Card(Suit.clubs, Face.four, Turned.down));
        cards.push(new Card(Suit.clubs, Face.five, Turned.down));
        cards.push(new Card(Suit.clubs, Face.six, Turned.down));
        cards.push(new Card(Suit.clubs, Face.seven, Turned.down));
        cards.push(new Card(Suit.clubs, Face.eight, Turned.down));
        cards.push(new Card(Suit.clubs, Face.nine, Turned.down));
        cards.push(new Card(Suit.clubs, Face.ten, Turned.down));
        cards.push(new Card(Suit.clubs, Face.jack, Turned.down));
        cards.push(new Card(Suit.clubs, Face.queen, Turned.down));
        cards.push(new Card(Suit.clubs, Face.king, Turned.down));
        return cards;
    }
}