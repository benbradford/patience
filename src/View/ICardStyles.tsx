import {ICardView} from '../ModelView/Cards/ModelViewData'

export default interface ICardStyles {
    empty(): any;
    piled(card : ICardView): any;
    front(card : ICardView): any;
}