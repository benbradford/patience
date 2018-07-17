import {Card} from './Card'
import CardCollection from './CardCollection'

export interface ICardMovementActionResult {
    card: Card;
    from: CardCollection;
    to: CardCollection;
}

export interface ICardActionResult {
    flip: Card[];
    move: ICardMovementActionResult;
}