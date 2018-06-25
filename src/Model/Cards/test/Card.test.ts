import {Card, Suit, Face} from '../Card'

it('WHEN creating a new card, THEN it has no collection',() => {

    const card = new Card(Suit.clubs, Face.ace);
    expect(card.collection === undefined);
});

it('WHEN cards turned up and turned down THEN both can be turned', () => {
    const card = new Card(Suit.clubs, Face.ace);
    expect(card.is_turned_up() === false);
    card.turn();
    expect(card.is_turned_up());
    card.turn();
    expect(card.is_turned_up() === false);

    const card2 = new Card(Suit.clubs, Face.ace, true);
    expect(card2.is_turned_up());
    card2.turn();
    expect(card2.is_turned_up() === false);
  });
