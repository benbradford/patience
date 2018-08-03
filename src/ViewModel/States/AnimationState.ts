
import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'
import CardsGameViewState from '../Cards/CardsGameViewState'
import StateFactory from './StateFactory'
import AnimationController from '../AnimationController'
import IFloatingCardHolder from '../Cards/IFloatingCardHolder'
import {IFloatingCard} from '../Cards/ViewModelData'
import CardBox from '../Cards/CardBox';

export default class AnimationState extends CardsGameViewState {

    private readonly holder: IFloatingCardHolder;
    private readonly stateFactory: StateFactory;
   
    constructor(machine: CardsGameViewStateMachine,
                stateFactory: StateFactory,
                holder: IFloatingCardHolder,
                animationController: AnimationController,
                card: IFloatingCard, 
                pileBox: CardBox, 
                pileIndex: number, 
                fromX: number, 
                fromY: number, 
                turn: boolean, 
                speed: number) {

        super(machine);
        this.stateFactory = stateFactory;
        this.holder = holder;
   
        animationController.start_animation(card, pileBox, pileIndex, fromX, fromY, turn, speed, this.onAnimEnd);
    }

    private onAnimEnd = () => {
        this.holder.dropCards();
        this.state_machine().move_to(this.stateFactory.make_idle_state());
    }
}