import {ICardView} from '../ModelView/Cards/ModelViewData'

export default interface ICardStyles {
    readonly cardWidthValue : number;
    readonly cardLengthValue : number;
    readonly previewSize: number;
    
    empty(): any;
    piled(card : ICardView): any;
    front(card : ICardView): any;
}