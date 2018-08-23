import CardBox from './CardBox'
import { ICardView } from './ViewModelData';

export type BoxForPile = (pileIndex: number) => CardBox | null;
export type BoxForCard = (card: ICardView) => CardBox;
export type StaticBox = (pileIndex: number, cardIndex: number) => CardBox;

export default class BoxFinder {

    public readonly boxForPile: BoxForPile;
    public readonly boxForCard: BoxForCard;
    public readonly staticBox: StaticBox;

    constructor(forPile: BoxForPile, forCard: BoxForCard, staticBox: StaticBox) {
        this.boxForPile = forPile;
        this.boxForCard = forCard;
        this.staticBox = staticBox;
    }
}