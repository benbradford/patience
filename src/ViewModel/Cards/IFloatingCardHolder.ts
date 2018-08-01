
import {ICardView, IFloatingCard} from './ViewModelData'
import CardBox from './CardBox'

export default interface IFloatingCardHolder {
    pickupCard: (c: ICardView, b: CardBox) => IFloatingCard;
    pickupCards: (cards: IFloatingCard[]) => void ;
    dropCards: () => void;
}