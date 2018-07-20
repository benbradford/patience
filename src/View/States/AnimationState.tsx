
import CardsGameViewStateMachine from '../../ModelView/Cards/CardsGameViewStateMachine'
import CardsGameViewState from '../../ModelView/Cards/CardsGameViewState'
import FloatingCard from '../../ModelView/Cards/FloatingCard'
import FloatingCards from '../../ModelView/Cards/FloatingCards'
import StateFactory from './StateFactory'
import AnimationController from '../AnimationController'

export default class AnimationState extends CardsGameViewState {

    private readonly card: FloatingCard;
    private readonly floatingCards: FloatingCards;
    private readonly stateFactory: StateFactory;
   
    constructor(machine: CardsGameViewStateMachine,
                stateFactory: StateFactory,
                floatingCards: FloatingCards,
                animationController: AnimationController,
                card: FloatingCard, pileBox: ClientRect, pileIndex: number, fromX: number, fromY: number, turn: boolean, speed: number) {

        super(machine);
        this.stateFactory = stateFactory;
        this.floatingCards = floatingCards;
        this.card = card;
        
        animationController.start_animation(card, pileBox, pileIndex, fromX, fromY, turn, speed, this.onAnimEnd);
    }

    private onAnimEnd = () => {
        this.floatingCards.remove_floating_card(this.card);
        this.state_machine().move_to(this.stateFactory.make_idle_state());
    }
}