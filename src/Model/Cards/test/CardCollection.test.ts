import {Card, Suit, Face, Turned} from '../Card'
import CardCollection from '../CardCollection'

function make_arbitrary_card() : Card {
    return new Card(Suit.clubs, Face.ace, Turned.down);
}

function make_cards_and_add_to_collection(num : number, collection : CardCollection) : Card[] {
    const card : Card[] = [];
    for (let i = 0; i < num; ++i) {
        card.push(make_arbitrary_card());
        collection.push(card[i]);
    }
    return card;
}

it('WHEN empty construction of collection THEN collection is empty', () => {
    const collection = new CardCollection();
    expect(collection.is_empty());
});

it ('GIVEN empty collection, WHEN attemping to remove THEN null returned', () => {
    const collection = new CardCollection();
    expect(collection.remove(0) == null);

    const card = make_arbitrary_card();

    expect(collection.remove_card(card)).toEqual(null);
});

it('GIVEN empty collection, WHEN adding a card THEN card has new collection set', () =>{
    const collection = new CardCollection();
    const card = make_arbitrary_card();
    collection.push(card);
    expect(collection.contains(card));
    expect(card.collection).toEqual(collection);
    expect(card.validate());
    expect(collection.validate());
});

it ('WHEN adding a card to a collection, THEN card collection is set', () =>{
    const collection = new CardCollection();
    const card = make_arbitrary_card();
    collection.push(card);
    expect(card.collection).toEqual(collection);
});

it ('GIVEN collection with card, WHEN attempting to add to another collection, THEN null returned', () => {
    const collection1 = new CardCollection();
    const collection2 = new CardCollection();
    const card = make_arbitrary_card();
    collection1.push(card);

    expect(collection2.push(card)).toEqual(null);
    expect(collection2.contains(card)).toEqual(false);
    expect(collection1.contains(card));
});

it ('GIVEN empty collection, WHEN pushing and removing from top THEN peek always returns top', () => {
    const collection = new CardCollection();
    const card1 = make_arbitrary_card();
    const card2 = make_arbitrary_card();
    const card3 = make_arbitrary_card();

    const validate = () =>  {
        expect(collection.validate());
        expect(card1.validate());
        expect(card2.validate());
        expect(card3.validate());
    };

    validate();

    collection.push(card1);
    expect(collection.peek()).toEqual(card1);
    collection.push(card2);
    expect(collection.peek()).toEqual(card2);
    collection.push(card3);
    expect(collection.peek()).toEqual(card3);

    validate();

    expect(collection.peek()).toEqual(card3);
    collection.remove();
    expect(collection.peek()).toEqual(card2);
    collection.remove();
    expect(collection.peek()).toEqual(card1);

    validate();
    
    collection.push(card2);
    expect(collection.peek()).toEqual(card2);
    collection.push(card3);
    expect(collection.peek()).toEqual(card3);
    collection.remove();
    collection.remove();
    collection.remove();
    expect(collection.is_empty());
    
    validate();
});

it('GIVEN collection filled with cards, WHEN peeking from top, THEN returns correct card', () => {
    const collection = new CardCollection();
    const cards = make_cards_and_add_to_collection(20, collection);
    for (let k = 20; k > -1; --k) {
        expect(collection.size() === k);
        expect(collection.peek(k) === null);
        for (let i = 0; i < k; ++i) {
            expect(collection.peek(i) === cards[k-1-i]);
        }
        collection.remove(0);
    }
});

it ('GIVEN collection with cards, WHEN attempting to remove card that does not exist THEN return null', () => {
    const collection = new CardCollection();
    const cards = make_cards_and_add_to_collection(10, collection);
    
    expect(collection.remove_card(cards[5]));
    expect(cards[5].collection === undefined);
    expect(collection.remove_card(cards[5]) === null);

    for (let i = 0; i < 4; ++i) {
        expect(collection.peek() === cards[9-i]);
        expect(collection.remove_card(cards[9-i]));
    }

    expect(collection.validate());

    for (let i = 5; i < 10; ++i) {
        collection.push(cards[i]);
    }

    for (let i = 9; i >-1; --i) {
        collection.remove_card(cards[i]);
        expect(cards[i].validate());
    }

    expect(collection.validate());
});