import { ICardView } from "./Cards/ViewModelData";

export default interface IAnimationAction {
    card: ICardView;
    startPileIndex: number;
    destPileIndex: number;
    turn: boolean;
}