import CardCommand from '../Cards/CardCommand'
import {Card, Face} from '../Cards/Card'
import SolitaireCollections from '../SolitaireCollections'
import IMoveCardActionParameters from './IMoveCardActionParameters'
import CardCollection from '../Cards/CardCollection';

export default class MoveManyCardsCommand extends CardCommand<IMoveCardActionParameters>  {

    private collections: SolitaireCollections;

    constructor(collections: SolitaireCollections) {
        super();
        this.collections = collections;
    }

    public on_can_execute(action: IMoveCardActionParameters): boolean {
        if (!action.from || !action.to || !action.card) {
            return false;
        }
        if (!(this.collections.is_hold(action.from) && this.collections.is_hold(action.to))) {
            return false;
        }
        if (action.from.contains(action.card) === false) {
            return false;
        }
        if (action.card.is_turned_up() === false) {
            return false;
        }
        if (action.from === action.to) {
            return false;
        }
        const dest = action.to.peek();
        if (!dest) {
            if (this.collections.is_hold(action.to) && action.card.face !== Face.king) {
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

    public on_execute(action: IMoveCardActionParameters): boolean {
        if (!action.from || !action.to || !action.card) {
            return false;
        }

        this.move_all(action.from, action.to, action.card);
        const cardToTurn = action.from.peek();
        if (cardToTurn && cardToTurn.is_turned_up() === false) {
            cardToTurn.turn();
            action.turnNextInFrom = true;
        }
        return true;
    }

    public on_undo(action: IMoveCardActionParameters): boolean {
        if (!action.from || !action.to || !action.card) {
            return false;
        }

        this.move_all(action.to, action.from, action.card);
        if (action.turnNextInFrom) {
            const card = action.from.peek(1);
            if (card) {
                card.turn();
            }
        }
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
            if (c === target) {
                break;
            }
        }

        for(let i = tmp.length-1; i > -1; --i) {
            to.push(tmp[i]);
        }

    }
}