import CardsGameViewState from "../Cards/CardsGameViewState";
import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'
import SolitaireViewModel from '../SolitaireViewModel'
import StateFactory from './StateFactory'
import BoxFinder from '../Cards/BoxFinder'
import IFloatingCardHolder from '../Cards/IFloatingCardHolder'

export default class DeckClickState extends CardsGameViewState {

    constructor(machine: CardsGameViewStateMachine, floatingCardHolder: IFloatingCardHolder, viewModel: SolitaireViewModel, stateFactory: StateFactory, boxFinder: BoxFinder) {
        super(machine);
        const result = viewModel.next_card();
            if (result) {
                if (result.destPileIndex > 0) {
                    const pileBox = boxFinder.boxForPile(1);
                    const fromBox = boxFinder.boxForPile(0);
                    if (pileBox && fromBox) {
                        const halfWidth = (pileBox.right()-pileBox.left()) / 2;
                        const x = fromBox.left() + window.scrollX + halfWidth;
                        const y = fromBox.top() + window.scrollY;
                        const floatingCard = floatingCardHolder.pickupCard(result.card, fromBox);
                        const state = stateFactory.make_anim_state(floatingCard, pileBox, 1, x, y, true, 0.5);
                        machine.move_to(state);
                    }
                }
            }
    }
}