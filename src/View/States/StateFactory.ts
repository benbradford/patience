import DragState from './DragState'
import CardsGameViewStateMachine from '../../ModelView/Cards/CardsGameViewStateMachine'
import CardBox from '../../ModelView/Cards/CardBox'
import {ICardView} from '../../ModelView/Cards/ModelViewData'
import FloatingCards from '../../ModelView/Cards/FloatingCards'
import SolitaireModelView from '../../ModelView/SolitaireModelView'
import DragToEvaluator from '../DragToEvaluator'
import IdleState from './IdleState'
import AnimationController from '../AnimationController'

export default class StateFactory {

    private machine: CardsGameViewStateMachine;
    private floatingCards: FloatingCards;
    private modelView: SolitaireModelView;
    private dragToEvaluator: DragToEvaluator;
    private animationController: AnimationController;

    constructor(machine: CardsGameViewStateMachine,
                floatingCards: FloatingCards,
                modelView: SolitaireModelView,
                dragToEvaluator: DragToEvaluator,
                animationController: AnimationController) {

        this.machine = machine;
        this.floatingCards = floatingCards;
        this.modelView = modelView;
        this.dragToEvaluator = dragToEvaluator;   
        this.animationController = animationController;        
    }

    public make_drag_state(c: ICardView, box: CardBox): DragState {
        return new DragState(this.machine, this.floatingCards, this.modelView, this.dragToEvaluator, this, c, box);
    }

    public make_idle_state(): IdleState {
        return new IdleState(this.machine, this);
    }

    public make_anim_state(): AnimationState(card: FloatingCard, box: ClientRect, pileIndex: number, fromX: number, fromY: number, turn: boolean, speed: number) {
        return new AnimationState(this.machine, this, this.floatingCards, this.animationController, card, box, pileIndex, fromX, fromY, turn, speed);
    }
}