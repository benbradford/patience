import {Suit, Face, Turned} from '../Model/Cards/Card'

interface ICardViewData {
    suit : Suit;
    face : Face;
    turned : Turned;
}

interface IViewData {
    cards : ICardViewData;
}