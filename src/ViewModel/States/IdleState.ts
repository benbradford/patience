import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'
import CardsGameViewState from '../Cards/CardsGameViewState'
import CardBox from '../Cards/CardBox'
import {ICardView} from '../Cards/ViewModelData'
import StateFactory from './StateFactory'

export default class IdleState extends CardsGameViewState {

    private stateFactory: StateFactory;

    constructor(machine: CardsGameViewStateMachine, stateFactory: StateFactory) {
        super(machine);
        this.stateFactory = stateFactory;
    }

    public on_start_drag(c: ICardView, box: CardBox): void { 
        this.state_machine().move_to(this.stateFactory.make_drag_state(c, box));
    }
   
}