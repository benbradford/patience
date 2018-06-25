import ICardCommand from '../Cards/ICardCommand'
import {Card, Face} from '../Cards/Card'
import CardAction from '../Cards/CardAction'
import SolitaireCollections from '../SolitaireCollections'
import CardCollection from 'src/Model/Cards/CardCollection';

export default class MoveManyCardsCommand implements ICardCommand {

    private collections: SolitaireCollections;

    constructor(collections: SolitaireCollections) {
        this.collections = collections;
    }

    public can_execute(action: CardAction): boolean {
        if (!action.collection1 || !action.collection2 || !action.card) {
            return false;
        }
        if (this.collections.is_score(action.collection1) || this.collections.is_score(action.collection2)) {
            return false;
        }
        if (action.collection1.contains(action.card) == false) {
            return false;
        }
        if (action.card.is_turned_up() == false) {
            return false;
        }
        const dest = action.collection2.peek();
        if (!dest) {
            if (this.collections.is_hold(action.collection2) && action.card.face != Face.king) {
                return false;
            }
        } else {
            if (dest.colour === action.card.colour) {
                return false;
            }
            if (dest.face !== action.card.face+1) {
                return false;
            }
        }
        return true;
    }

    public execute(action: CardAction): boolean {
        if (!action.collection1 || !action.collection2 || !action.card) {
            return false;
        }

        this.move_all(action.collection1, action.collection2, action.card);
        return true;
    }

    public undo(action: CardAction): boolean {
        if (!action.collection1 || !action.collection2 || !action.card) {
            return false;
        }

        this.move_all(action.collection2, action.collection1, action.card);
        return true;
    }

    private move_all(from : CardCollection, to: CardCollection, target: Card) {
        const tmp : Card[] = [];
        while (from.is_empty() === false) {
            const c = from.remove();
            if (!c) {
                throw Error("cannot pop in moveMany");
            }
            tmp.push(c);
            if (c == target) {
                break;
            }
        }

        for(let i = tmp.length-1; i > -1; --i) {
            to.push(tmp[i]);
        }

    }
}