import NextCardCommand from '../NextCardCommand'
import {Card, Face, Suit, Turned} from '../../Cards/Card'
import SolitaireCollections from '../../SolitaireCollections';
import CardAction from '../../Cards/CardAction';
import CardCollection from '../../Cards/CardCollection';

function has_top_card_turned_down(collection: CardCollection) {
    expect(collection.is_empty() == false);
    const card = collection.peek();
    expect(card);
    if (!card) {
        return;
    }
    expect(!card.is_turned_up());
}

function has_top_card_turned_up(collection: CardCollection) {
    expect(collection.is_empty() == false);
    const card = collection.peek();
    expect(card);
    if (!card) {
        return;
    }
    expect(card.is_turned_up());
}

function has_top_card_equal_to(collection: CardCollection, card: Card) {
    expect(collection.is_empty() == false);
    const p = collection.peek();
    expect(p);
    if (!p) {
        return;
    }
    expect(p).toEqual(card);
}

it('WHEN deck is empty THEN cannot turn', () => {
    const collections = new SolitaireCollections();
    const command = new NextCardCommand(collections);
    const action = new CardAction(command);
    expect(!command.can_execute(action));
    expect(!command.execute(action));
    expect(!command.undo(action));
});

it('WHEN desk has cards, THEN can turn forever', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.ace, Turned.down);
    const card2 = new Card(Suit.clubs, Face.two, Turned.down);
    const card3 = new Card(Suit.clubs, Face.three, Turned.down);

    collections.deck().push(card1);
    collections.deck().push(card2);
    collections.deck().push(card3);

    const command = new NextCardCommand(collections);
    const action = new CardAction(command);

    for (let i = 0; i < 10; ++i) {
        expect(command.can_execute(action));
        expect(command.execute(action));
    }
});

it('GIVEN deck has no cards WHEN turned does have cards, THEN can turn forever', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.ace, Turned.down);
    const card2 = new Card(Suit.clubs, Face.two, Turned.down);
    const card3 = new Card(Suit.clubs, Face.three, Turned.down);

    collections.turned().push(card1);
    collections.turned().push(card2);
    collections.turned().push(card3);

    const command = new NextCardCommand(collections);
    const action = new CardAction(command);

    for (let i = 0; i < 10; ++i) {
        expect(command.can_execute(action));
        expect(command.execute(action));
    }
});

it('WHEN desk has cards, THEN can undo forever', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.ace, Turned.down);
    const card2 = new Card(Suit.clubs, Face.two, Turned.down);
    const card3 = new Card(Suit.clubs, Face.three, Turned.down);

    collections.deck().push(card1);
    collections.deck().push(card2);
    collections.deck().push(card3);

    const command = new NextCardCommand(collections);
    const action = new CardAction(command);

    for (let i = 0; i < 10; ++i) {
        expect(command.can_execute(action));
        expect(command.undo(action));
    }
});

it('GIVEN deck has no cards WHEN turned does have cards, THEN can undo forever', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.ace, Turned.down);
    const card2 = new Card(Suit.clubs, Face.two, Turned.down);
    const card3 = new Card(Suit.clubs, Face.three, Turned.down);

    collections.turned().push(card1);
    collections.turned().push(card2);
    collections.turned().push(card3);

    const command = new NextCardCommand(collections);
    const action = new CardAction(command);

    for (let i = 0; i < 10; ++i) {
        expect(command.can_execute(action));
        expect(command.undo(action));
    }
});

it('WHEN desk has cards, THEN can undo and execute randomly forever', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.ace, Turned.down);
    const card2 = new Card(Suit.clubs, Face.two, Turned.down);
    const card3 = new Card(Suit.clubs, Face.three, Turned.down);

    collections.deck().push(card1);
    collections.deck().push(card2);
    collections.deck().push(card3);

    const command = new NextCardCommand(collections);
    const action = new CardAction(command);

    for (let i = 0; i < 10; ++i) {
        expect(command.can_execute(action));
        if (Math.floor(Math.random() * 2) === 1) {
            expect(command.execute(action));
        } else {
            expect(command.undo(action));
        }
    }
});

it('WHEN using deck with 1 card THEN can turn to turned deck and undo again',() => {

    const collections = new SolitaireCollections();
    collections.deck().push(new Card(Suit.clubs, Face.ace, Turned.down));

    const command = new NextCardCommand(collections);
    const action = new CardAction(command);
    expect(command.can_execute(action));
    expect(command.execute(action));
    
    expect(collections.turned().peek())
    has_top_card_turned_up(collections.turned());

    expect(command.undo(action));
    expect(collections.turned().is_empty());
    expect(collections.deck().is_empty() == false);
});


it('WHEN using deck with 3 cards THEN can turn to turned deck and undo again',() => {

    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.ace, Turned.down);
    const card2 = new Card(Suit.clubs, Face.two, Turned.down);
    const card3 = new Card(Suit.clubs, Face.three, Turned.down);

    collections.deck().push(card1);
    collections.deck().push(card2);
    collections.deck().push(card3);

    const command = new NextCardCommand(collections);
    const action = new CardAction(command);
    expect(command.can_execute(action));
    expect(command.execute(action));
    
    expect(collections.turned().peek())
    has_top_card_turned_up(collections.turned());
    has_top_card_turned_down(collections.deck());

    expect(command.can_execute(action));
    expect(command.execute(action));
    
    expect(collections.turned().peek())
    has_top_card_turned_up(collections.turned());
    has_top_card_turned_down(collections.deck());

    expect(command.can_execute(action));
    expect(command.execute(action));
    
    expect(collections.turned().peek())
    expect(collections.deck().is_empty());

    has_top_card_equal_to(collections.turned(), card1);
    expect(command.undo(action));

    has_top_card_equal_to(collections.turned(), card2);
    expect(command.undo(action));

    has_top_card_equal_to(collections.turned(), card3);
});
