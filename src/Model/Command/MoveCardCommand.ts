import CardCommand from '../Cards/CardCommand'
import SolitaireCollections from '../SolitaireCollections'
import {Face} from '../Cards/Card'
import IMoveCardActionParameters from './IMoveCardActionParameters'
import { Card } from '../Cards/Card';
import {ICardActionResult} from '../Cards/ICardActionResult'

export default class MoveCardCommand extends CardCommand<IMoveCardActionParameters> {

    private collections: SolitaireCollections;

    constructor(collections: SolitaireCollections) {
        super();
        this.collections = collections;
    }

    public on_can_execute(action: IMoveCardActionParameters): boolean {
        if (action.from.peek() !== action.card) {
            return false;
        }
        if (!action.card.is_turned_up()) {
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
            if (this.collections.is_score(action.to) && action.card.face !== Face.ace) {
                return false;
            }
        }
        else {
            if (this.collections.is_hold(action.to)) {
                if (dest.colour === action.card.colour) {
                    return false;
                }
                if (dest.face !== action.card.face+1) {
                    return false;
                }
            } else if (this.collections.is_score(action.to)) {
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

    public on_execute(action: IMoveCardActionParameters): ICardActionResult | null  {
        action.from.remove();
        action.to.push(action.card);
        const turnedCard = this.turn_card_if_appropriate(action);
       
        return {move:action, flip: turnedCard};
    }

    public on_undo(action: IMoveCardActionParameters): ICardActionResult | null  {
        action.to.remove();
        action.from.push(action.card);
        let turnedCard: Card | null = null;
        if (action.turnNextInFrom) {
            turnedCard = action.from.peek(1);
            if (turnedCard) {
                turnedCard.turn();
            }
        }
        return {move: {card: action.card, from: action.to, to: action.from}, flip:turnedCard};
    }

    private turn_card_if_appropriate(action: IMoveCardActionParameters): Card | null {
        if (action.from && this.collections.is_hold(action.from)) {
            const cardToTurn = action.from.peek();
            if (cardToTurn && cardToTurn.is_turned_up() === false) {
                action.turnNextInFrom = true;
                cardToTurn.turn();
                return cardToTurn;
            }
        }
        return null;
    }
}