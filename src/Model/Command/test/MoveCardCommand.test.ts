import MoveCardCommand from '../MoveCardCommand'
import {Card, Face, Suit} from '../../Cards/Card'
import SolitaireCollections from '../../SolitaireCollections';

it('WHEN card is turned down, THEN cannot move', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.king, false);
   
    expect(collections.turned().push(card1)).toEqual(card1);
    
    const command = new MoveCardCommand(collections);
    expect(collections.hold(0));
    const hold = collections.hold(0);

    const action = {card: card1, from: collections.turned(), to: hold};
    expect(command.can_execute(action)).toBeFalsy();
});

it('WHEN hold is empty, THEN can move king', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.king, true);
   
    expect(collections.turned().push(card1)).toEqual(card1);
    
    const command = new MoveCardCommand(collections);
    expect(collections.hold(0));
    const hold = collections.hold(0);

    const action =  {card: card1, from: collections.turned(), to: hold};

    expect(card1.face).toEqual(Face.king);
    expect(command.can_execute(action)).toEqual(true);
    expect(command.execute(action)).toEqual(true);
    expect(hold.is_empty()).toEqual(false);
    expect(hold.peek()).toEqual(card1);
    expect(collections.turned().is_empty()).toEqual(true);

    expect(command.undo(action)).toEqual(true);
    expect(collections.turned().is_empty() === false);
    expect(hold.is_empty() === false);
    expect(hold.peek() === card1);
});

it('WHEN moving card that is not on top, THEN do not move ', () => {
    const collections = new SolitaireCollections();
    const king = new Card(Suit.clubs, Face.king, true);
    const ace = new Card(Suit.clubs, Face.ace, true);

    collections.turned().push(ace);
    collections.turned().push(king);

    const command = new MoveCardCommand(collections);
    const score = collections.score(3);

    const aceAction = {card: ace, from: collections.turned(), to: score};
    expect(command.can_execute(aceAction)).toBeFalsy();
});

it('WHEN score is empty, THEN can only move ace', () => {
    const collections = new SolitaireCollections();
    const king = new Card(Suit.clubs, Face.king, true);
    const ace = new Card(Suit.clubs, Face.ace, true);

    collections.turned().push(king);
    collections.turned().push(ace);
    
    const command = new MoveCardCommand(collections);
    const score = collections.score(1);

    const kingAction = {card: king, from: collections.turned(), to: score};
    const aceAction = {card: ace, from: collections.turned(), to: score};

    expect(command.can_execute(aceAction)).toBeTruthy();
    expect(command.execute(aceAction)).toBeTruthy();
    expect(command.undo(aceAction)).toBeTruthy();
    expect(score.is_empty()).toBeTruthy();
    expect(collections.turned().peek()).toEqual(ace);

    collections.turned().remove();
    expect(command.can_execute(kingAction)).toBeFalsy();
    expect(score.is_empty()).toBeTruthy();
    expect(collections.turned().peek()).toEqual(king);
});

it('GIVEN hold with card, WHEN turned top has a card which can be laid, THEN will lay', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.king, true);
    const card2 = new Card(Suit.hearts, Face.queen, true);
    collections.turned().push(card2);
    const hold = collections.hold(0);
    hold.push(card1);
    expect(collections.is_hold(hold)).toBeTruthy();
    
    expect(card1.collection).toEqual(hold);
    expect(card2.collection).toEqual(collections.turned());

    const command = new MoveCardCommand(collections);
    const action = {card: card2, from: collections.turned(), to: hold};

    expect(command.can_execute(action)).toEqual(true);
    expect(command.execute(action)).toEqual(true);
    expect(hold.size()).toEqual(2);
    expect(collections.turned().is_empty()).toEqual(true);

    expect(command.undo(action)).toEqual(true);
    expect(hold.size()).toEqual(1);
    expect(collections.turned().size()).toEqual(1);
    expect(collections.turned().peek()).toEqual(card2);
});

it('GIVEN hold with card, WHEN turned top has a card which can not be laid, THEN will not lay', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.king, true);
    const card2 = new Card(Suit.hearts, Face.jack, true);
    collections.turned().push(card2);
    const hold = collections.hold(0);
    hold.push(card1);
    expect(collections.is_hold(hold)).toBeTruthy();
    
    expect(card1.collection).toEqual(hold);
    expect(card2.collection).toEqual(collections.turned());

    const command = new MoveCardCommand(collections);
    const action = {card: card2, from: collections.turned(), to: hold};

    expect(command.can_execute(action)).toBeFalsy();
});

it('GIVEN score pile with an ace WHEN adding a two of a different suit THEN cannot execute ', () => {
    const collections = new SolitaireCollections();
    const two = new Card(Suit.clubs, Face.two, true);
    const ace = new Card(Suit.clubs, Face.ace, true);
    const twoDifferent = new Card(Suit.spades, Face.three, true);

    const command = new MoveCardCommand(collections);
    const score = collections.score(3);

    collections.turned().push(ace);

    const aceAction = {card: ace, from: collections.turned(), to: score};
    const twoAction =  {card: two, from: collections.turned(), to: score};
    const twoDifferentAction = {card: twoDifferent, from: collections.turned(), to: score};

    expect(command.can_execute(aceAction)).toBeTruthy();
    command.execute(aceAction);

    collections.turned().push(two);
    expect(command.can_execute(twoAction)).toBeTruthy();
    command.execute(twoAction);
    expect(score.peek()).toEqual(two);
    score.remove();

    expect(score.peek()).toEqual(ace);

    expect(command.can_execute(twoDifferentAction)).toBeFalsy();
});