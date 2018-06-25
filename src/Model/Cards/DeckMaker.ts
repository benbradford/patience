import {Suit, Face, Card} from './Card'

export default class DeckMaker {

    public make_full_deck(): Card[] {
        const cards : Card[] = [];
        cards.push(new Card(Suit.hearts, Face.ace));
        cards.push(new Card(Suit.hearts, Face.two));
        cards.push(new Card(Suit.hearts, Face.three));
        cards.push(new Card(Suit.hearts, Face.four));
        cards.push(new Card(Suit.hearts, Face.five));
        cards.push(new Card(Suit.hearts, Face.six));
        cards.push(new Card(Suit.hearts, Face.seven));
        cards.push(new Card(Suit.hearts, Face.eight));
        cards.push(new Card(Suit.hearts, Face.nine));
        cards.push(new Card(Suit.hearts, Face.ten));
        cards.push(new Card(Suit.hearts, Face.jack));
        cards.push(new Card(Suit.hearts, Face.queen));
        cards.push(new Card(Suit.hearts, Face.king));
        cards.push(new Card(Suit.spades, Face.ace));
        cards.push(new Card(Suit.spades, Face.two));
        cards.push(new Card(Suit.spades, Face.three));
        cards.push(new Card(Suit.spades, Face.four));
        cards.push(new Card(Suit.spades, Face.five));
        cards.push(new Card(Suit.spades, Face.six));
        cards.push(new Card(Suit.spades, Face.seven));
        cards.push(new Card(Suit.spades, Face.eight));
        cards.push(new Card(Suit.spades, Face.nine));
        cards.push(new Card(Suit.spades, Face.ten));
        cards.push(new Card(Suit.spades, Face.jack));
        cards.push(new Card(Suit.spades, Face.queen));
        cards.push(new Card(Suit.spades, Face.king));
        cards.push(new Card(Suit.diamonds, Face.ace));
        cards.push(new Card(Suit.diamonds, Face.two));
        cards.push(new Card(Suit.diamonds, Face.three));
        cards.push(new Card(Suit.diamonds, Face.four));
        cards.push(new Card(Suit.diamonds, Face.five));
        cards.push(new Card(Suit.diamonds, Face.six));
        cards.push(new Card(Suit.diamonds, Face.seven));
        cards.push(new Card(Suit.diamonds, Face.eight));
        cards.push(new Card(Suit.diamonds, Face.nine));
        cards.push(new Card(Suit.diamonds, Face.ten));
        cards.push(new Card(Suit.diamonds, Face.jack));
        cards.push(new Card(Suit.diamonds, Face.queen));
        cards.push(new Card(Suit.diamonds, Face.king));
        cards.push(new Card(Suit.clubs, Face.ace));
        cards.push(new Card(Suit.clubs, Face.two));
        cards.push(new Card(Suit.clubs, Face.three));
        cards.push(new Card(Suit.clubs, Face.four));
        cards.push(new Card(Suit.clubs, Face.five));
        cards.push(new Card(Suit.clubs, Face.six));
        cards.push(new Card(Suit.clubs, Face.seven));
        cards.push(new Card(Suit.clubs, Face.eight));
        cards.push(new Card(Suit.clubs, Face.nine));
        cards.push(new Card(Suit.clubs, Face.ten));
        cards.push(new Card(Suit.clubs, Face.jack));
        cards.push(new Card(Suit.clubs, Face.queen));
        cards.push(new Card(Suit.clubs, Face.king));
        return cards;
    }
}