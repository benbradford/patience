import { ICardView } from "./Cards/ModelViewData";

export default interface IAnimationAction {
    card: ICardView;
    startPileIndex: number;
    destPileIndex: number;
    turn: boolean;
}