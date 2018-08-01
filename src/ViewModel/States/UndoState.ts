import CardsGameViewState from "../Cards/CardsGameViewState";
import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'
import SolitaireViewModel from '../../ViewModel/SolitaireViewModel'
import StateFactory from './StateFactory'
import {BoxFinder} from '../Cards/BoxFinder'
import IFloatingCardHolder from "../Cards/IFloatingCardHolder";


export default class UndoState extends CardsGameViewState {

    constructor(machine: CardsGameViewStateMachine, floatingCardHolder: IFloatingCardHolder, viewModel: SolitaireViewModel, stateFactory: StateFactory, boxFinder: BoxFinder) {
        super(machine);
        const result = viewModel.perform_undo();
        if (result) {
            const boxFrom = boxFinder(result.startPileIndex);
            const boxTo = boxFinder(result.destPileIndex);
            if (boxFrom && boxTo) {
                const x = boxFrom.left + window.scrollX;
                const y = boxFrom.top + window.scrollY;
                const floatingCard = floatingCardHolder.pickupCard(result.card, boxFrom);

                const state = stateFactory.make_anim_state(floatingCard, boxTo, result.destPileIndex, x, y, result.destPileIndex === 0, 1.0);     
                machine.move_to(state);
            }
        }
    }
}