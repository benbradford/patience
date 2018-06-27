import {Suit, Face} from '../Model/Cards/Card'

export interface ICardViewData {
    suit : Suit;
    face : Face;
    turned : boolean;
    collection : string;
}
