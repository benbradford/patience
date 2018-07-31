import CardsGameViewState from "../Cards/CardsGameViewState";
import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'

import FloatingCard from '../Cards/FloatingCard'
import FloatingCards from '../Cards/FloatingCards'
import SolitaireViewModel from '../../ViewModel/SolitaireViewModel'
import StateFactory from './StateFactory'
import {BoxFinder} from '../Cards/BoxFinder'


export default class UndoState extends CardsGameViewState {

    constructor(machine: CardsGameViewStateMachine, floatingCards: FloatingCards, viewModel: SolitaireViewModel, stateFactory: StateFactory, boxFinder: BoxFinder) {
        super(machine);
        const result = viewModel.undo();
        if (result) {
            const boxFrom = boxFinder(result.startPileIndex);
            const boxTo = boxFinder(result.destPileIndex);
            if (boxFrom && boxTo) {
                const x = boxFrom.left + window.scrollX;
                const y = boxFrom.top + window.scrollY;
                const floatingCard = new FloatingCard(result.card, x, y, 1, viewModel.data_sync());
                floatingCards.add(floatingCard);
                const state = stateFactory.make_anim_state(floatingCard, boxTo, result.destPileIndex, x, y, result.destPileIndex === 0, 1.0);     
                machine.move_to(state);
            }
        }
    }
}