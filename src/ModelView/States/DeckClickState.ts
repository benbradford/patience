import CardsGameViewState from "../Cards/CardsGameViewState";
import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'

import FloatingCard from '../Cards/FloatingCard'
import FloatingCards from '../Cards/FloatingCards'
import SolitaireModelView from '../../ModelView/SolitaireModelView'
import StateFactory from './StateFactory'
import {BoxFinder} from '../Cards/BoxFinder'


export default class DeckClickState extends CardsGameViewState {

    constructor(machine: CardsGameViewStateMachine, floatingCards: FloatingCards, modelView: SolitaireModelView, stateFactory: StateFactory, boxFinder: BoxFinder) {
        super(machine);
        const result = modelView.next_card();
            if (result) {
                if (result.destPileIndex > 0) {
                    const pileBox = boxFinder(1);
                    const fromBox = boxFinder(0);
                    if (pileBox && fromBox) {
                        const halfWidth = (pileBox.right-pileBox.left) / 2;
                        const x = fromBox.left + window.scrollX + halfWidth;
                        const y = fromBox.top + window.scrollY;
                        const floatingCard = new FloatingCard(result.card, x, y, 1, modelView.data_sync());
                        floatingCards.add(floatingCard);
                        const state = stateFactory.make_anim_state(floatingCard, pileBox, 1, x, y, true, 0.5);
                        machine.move_to(state);
                    }
                }
            }
    }
}