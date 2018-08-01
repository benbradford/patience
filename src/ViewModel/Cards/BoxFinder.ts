import CardBox from './CardBox'
import { ICardView } from './ViewModelData';

export type BoxForPile = (pileIndex: number) => CardBox | null;
export type BoxForCard = (card: ICardView) => CardBox;

export default class BoxFinder {

    public readonly boxForPile: BoxForPile;
    public readonly boxForCard: BoxForCard;

    constructor(forPile: BoxForPile, forCard: BoxForCard) {
        this.boxForPile = forPile;
        this.boxForCard = forCard;
    }
}