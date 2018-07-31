import {Suit, Face} from '../../Model/Cards/Card'

export interface ICardView {
    suit: Suit;
    face: Face;
    turned: boolean;
    pileIndex: number;
}

export interface IPileView {
    cards : ICardView[];
}

export interface IViewModelData {
    piles: IPileView [];
}
