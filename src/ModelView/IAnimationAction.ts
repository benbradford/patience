import { ICardView, IPileView } from "./Cards/ModelViewData";

export default interface IAnimationAction {
    card: ICardView;
    destPile: IPileView;
    destPileIndex: number;
    turn: boolean;
}