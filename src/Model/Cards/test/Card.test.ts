import {Card, Suit, Face, Turned} from '../Card'

it('WHEN creating a new card, THEN it has no collection',() => {

    const card = new Card(Suit.clubs, Face.ace, Turned.down);
    expect(card.collection === undefined);
});

it('WHEN cards turned up and turned down THEN both can be turned', () => {
    const card = new Card(Suit.clubs, Face.ace, Turned.down);
    expect(card.is_turned_up() === false);
    card.turn();
    expect(card.is_turned_up());
    card.turn();
    expect(card.is_turned_up() === false);

    const card2 = new Card(Suit.clubs, Face.ace, Turned.up);
    expect(card2.is_turned_up());
    card2.turn();
    expect(card2.is_turned_up() === false);
  });
