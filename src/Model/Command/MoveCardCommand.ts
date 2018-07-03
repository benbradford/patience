import ICardCommand from '../Cards/ICardCommand'
import CardAction from '../Cards/CardAction'
import SolitaireCollections from '../SolitaireCollections'
import {Face} from '../Cards/Card'

export default class MoveCardCommand implements ICardCommand {

    private collections: SolitaireCollections;

    constructor(collections: SolitaireCollections) {
        this.collections = collections;
    }

    public can_execute(action: CardAction): boolean {
        if (!action.collection1 || !action.collection2 || !action.card) {
            return false;
        }

        if (action.collection1.peek() !== action.card) {
            return false;
        }
        if (!action.card.is_turned_up()) {
            return false;
        }
        if (action.collection1 === action.collection2) {
            return false;
        }
        const dest = action.collection2.peek();

        if (!dest) {
            if (this.collections.is_hold(action.collection2) && action.card.face !== Face.king) {
                return false;
            }
            if (this.collections.is_score(action.collection2) && action.card.face !== Face.ace) {
                return false;
            }
        }
        else {
            if (this.collections.is_hold(action.collection2)) {
                if (dest.colour === action.card.colour) {
                    return false;
                }
                if (dest.face !== action.card.face+1) {
                    return false;
                }
            } else if (this.collections.is_score(action.collection2)) {
                if (dest.suit !== action.card.suit) {
                    return false;
                }
                if (dest.face !== action.card.face-1) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    public execute(action: CardAction): boolean {
        if (!action.collection1 || !action.collection2 || !action.card) {
            return false;
        }
        action.collection1.remove();
        action.collection2.push(action.card);
        this.turn_card_if_appropriate(action);
        return true;
    }

    public undo(action: CardAction): boolean {
        if (!action.collection1 || !action.collection2 || !action.card) {
            return false;
        }
        action.collection2.remove();
        action.collection1.push(action.card);
        this.turn_card_if_appropriate(action);
        return true;
    }

    private turn_card_if_appropriate(action: CardAction) {
        if (action.collection1 && this.collections.is_hold(action.collection1)) {
            const cardToTurn = action.collection1.peek();
            if (cardToTurn && cardToTurn.is_turned_up() === false) {
                cardToTurn.turn();
            }
        }
    }
}