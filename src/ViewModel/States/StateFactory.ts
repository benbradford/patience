import DragState from './DragState'
import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'
import {ICardView} from '../Cards/ViewModelData'
import SolitaireViewModel from '../SolitaireViewModel'
import DragToEvaluator from '../Cards/DragToEvaluator'
import IdleState from './IdleState'
import BoxFinder from '../Cards/BoxFinder'
export default class StateFactory {

    private machine: CardsGameViewStateMachine;
    private viewModel: SolitaireViewModel;
    private dragToEvaluator: DragToEvaluator;
    private boxFinder: BoxFinder;

    constructor(machine: CardsGameViewStateMachine,
                viewModel: SolitaireViewModel,
                dragToEvaluator: DragToEvaluator,
                boxFinder: BoxFinder) {

        this.machine = machine;
        this.viewModel = viewModel;
        this.dragToEvaluator = dragToEvaluator;   
        this.boxFinder = boxFinder;  
    }

    public make_drag_state(c: ICardView): DragState {
        return new DragState(this.machine, this.viewModel, this.dragToEvaluator, this, c, this.boxFinder);
    }

    public make_idle_state(): IdleState {
        return new IdleState(this.machine, this);
    }


}