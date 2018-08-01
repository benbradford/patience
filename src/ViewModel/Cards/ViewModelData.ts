import {Suit, Face} from '../../Model/Cards/Card'
import CardBox from './CardBox'

export interface ICardView {
    suit: Suit;
    face: Face;
    turned: boolean;
    pileIndex: number;
}

export interface ICardCollectionViewData {
    cards: ICardView[];
}

export interface IFloatingCard {
    card: ICardView;
    box: CardBox;
}

export interface IViewModelData {
    piles: ICardCollectionViewData[];
    floating: IFloatingCard[];
}

