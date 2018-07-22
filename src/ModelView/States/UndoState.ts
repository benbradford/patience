import CardsGameViewState from "../Cards/CardsGameViewState";
import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'

import FloatingCard from '../Cards/FloatingCard'
import FloatingCards from '../Cards/FloatingCards'
import SolitaireModelView from '../../ModelView/SolitaireModelView'
import StateFactory from './StateFactory'
import {BoxFinder} from '../Cards/BoxFinder'


export default class UndoState extends CardsGameViewState {

    constructor(machine: CardsGameViewStateMachine, floatingCards: FloatingCards, modelView: SolitaireModelView, stateFactory: StateFactory, boxFinder: BoxFinder) {
        super(machine);
        const result = modelView.undo();
        if (result) {
            const boxFrom = boxFinder(result.startPileIndex);
            const boxTo = boxFinder(result.destPileIndex);
            if (boxFrom && boxTo) {
                const x = boxFrom.left + window.scrollX;
                const y = boxFrom.top + window.scrollY;
                const floatingCard = new FloatingCard(result.card, x, y, 1, modelView.data_sync());
                floatingCards.add(floatingCard);
                const state = stateFactory.make_anim_state(floatingCard, boxTo, result.destPileIndex, x, y, result.destPileIndex === 0, 1.0);     
                machine.move_to(state);
            }
        }
    }
}