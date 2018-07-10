import ICardActionParameters from "../Cards/ICardActionParameters";
import {Card} from '../Cards/Card'
import CardCollection from '../Cards/CardCollection'

export default interface IMoveCardActionParameters extends ICardActionParameters {

    card: Card;
    from: CardCollection;
    to: CardCollection;
}