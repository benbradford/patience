import MoveCardCommand from '../MoveCardCommand'
import {Card, Face, Suit} from '../../Cards/Card'
import SolitaireCollections from '../../SolitaireCollections';
import CardAction from '../../Cards/CardAction';

it('WHEN hold is empty, THEN can move king', () => {
    const collections = new SolitaireCollections();
    const card1 = new Card(Suit.clubs, Face.king, true);
   
    expect(collections.turned().push(card1)).toEqual(card1);
    
    const command = new MoveCardCommand(collections);
    expect(collections.hold(0));
    const hold = collections.hold(0);

    const action = new CardAction(command, card1, collections.turned(), hold);

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
    const action = new CardAction(command, card2, collections.turned(), hold);

    expect(command.can_execute(action)).toEqual(true);
    expect(command.execute(action)).toEqual(true);
    expect(hold.size()).toEqual(2);
    expect(collections.turned().is_empty()).toEqual(true);

    expect(command.undo(action)).toEqual(true);
    expect(hold.size()).toEqual(1);
    expect(collections.turned().size()).toEqual(1);
    expect(collections.turned().peek()).toEqual(card2);
});