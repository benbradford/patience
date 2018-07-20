import CardsGameViewStateMachine from '../../ModelView/Cards/CardsGameViewStateMachine'
import CardsGameViewState from '../../ModelView/Cards/CardsGameViewState'
import CardBox from '../../ModelView/Cards/CardBox'
import {ICardView} from '../../ModelView/Cards/ModelViewData'
import DragState from './DragState'
import StateFactory from './StateFactory'

export default class IdleState extends CardsGameViewState {

    private stateFactory: StateFactory;

    constructor(machine: CardsGameViewStateMachine, stateFactory: StateFactory) {
        super(machine);
        this.stateFactory = stateFactory;
    }

    /* tslint:disable:no-empty */
    public on_start_drag(c: ICardView, box: CardBox): void { 
        this.state_machine().move_to(this.stateFactory.make_drag_state(c, box));
    }
   
}