import DragState from './DragState'
import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'
import CardBox from '../Cards/CardBox'
import {ICardView} from '../Cards/ViewModelData'
import FloatingCards from '../Cards/FloatingCards'
import SolitaireViewModel from '../../ViewModel/SolitaireViewModel'
import DragToEvaluator from '../Cards/DragToEvaluator'
import IdleState from './IdleState'
import AnimationState from './AnimationState'
import AnimationController from '../AnimationController'
import FloatingCard from '../../ViewModel/Cards/FloatingCard'
import {BoxFinder} from '../Cards/BoxFinder'
import UndoState from './UndoState'
import DeckClickState from './DeckClickState'

export default class StateFactory {

    private machine: CardsGameViewStateMachine;
    private floatingCards: FloatingCards;
    private viewModel: SolitaireViewModel;
    private dragToEvaluator: DragToEvaluator;
    private animationController: AnimationController;
    private boxFinder: BoxFinder;

    constructor(machine: CardsGameViewStateMachine,
                floatingCards: FloatingCards,
                viewModel: SolitaireViewModel,
                dragToEvaluator: DragToEvaluator,
                animationController: AnimationController,
                boxFinder: BoxFinder) {

        this.machine = machine;
        this.floatingCards = floatingCards;
        this.viewModel = viewModel;
        this.dragToEvaluator = dragToEvaluator;   
        this.animationController = animationController;      
        this.boxFinder = boxFinder;  
    }

    public make_drag_state(c: ICardView, box: CardBox): DragState {
        return new DragState(this.machine, this.floatingCards, this.viewModel, this.dragToEvaluator, this, c, box);
    }

    public make_idle_state(): IdleState {
        return new IdleState(this.machine, this);
    }

    public make_anim_state(card: FloatingCard, box: ClientRect, pileIndex: number, fromX: number, fromY: number, turn: boolean, speed: number) {
        return new AnimationState(this.machine, this, this.floatingCards, this.animationController, card, box, pileIndex, fromX, fromY, turn, speed);
    }

    public make_undo_state() {
        return new UndoState(this.machine, this.floatingCards, this.viewModel, this, this.boxFinder);
    }

    public make_deck_click_state() {
        return new DeckClickState(this.machine, this.floatingCards, this.viewModel, this, this.boxFinder);
    }
}