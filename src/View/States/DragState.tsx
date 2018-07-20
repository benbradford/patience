import CardsGameViewStateMachine from '../../ModelView/Cards/CardsGameViewStateMachine'
import CardsGameViewState from '../../ModelView/Cards/CardsGameViewState'
import CardBox from '../../ModelView/Cards/CardBox'
import {ICardView} from '../../ModelView/Cards/ModelViewData'
import FloatingCard from '../../ModelView/Cards/FloatingCard'
import FloatingCards from '../../ModelView/Cards/FloatingCards'
import SolitaireModelView from '../../ModelView/SolitaireModelView'
import MouseController from '../Cards/MouseController'
import DragToEvaluator from '../DragToEvaluator'
import StateFactory from './StateFactory'
import {IMoveDestination} from '../DragToEvaluator'

export default class DragState extends CardsGameViewState {

    private readonly floatingCard: FloatingCard;
    private readonly mouseOffsetX: number;
    private readonly mouseOffsetY: number;
    private readonly dragFrom: CardBox;
    private readonly dragToEvaluator: DragToEvaluator;
    private readonly stateFactory: StateFactory;
    private readonly modelView: SolitaireModelView;

    constructor(machine: CardsGameViewStateMachine,
                floatingCards: FloatingCards,
                modelView: SolitaireModelView,
                dragToEvaluator: DragToEvaluator,
                stateFactory: StateFactory,
                c: ICardView, box: CardBox) {

        super(machine);
        this.modelView = modelView;
        this.stateFactory = stateFactory;
        this.dragToEvaluator = dragToEvaluator;    
        this.mouseOffsetX = (box.left - MouseController.lastMouseX) - 14;
        this.mouseOffsetY= (box.top - MouseController.lastMouseY) - 8;
        this.dragFrom = box;
        this.floatingCard = new FloatingCard(c, this.dragged_card_offset_x(), this.dragged_card_offset_y(), 1, modelView.data_sync());
        floatingCards.add(this.floatingCard);

        this.dragToEvaluator.set_valid_destinations(c);      
    }

    public on_mouse_move(x: number, y: number): boolean { 
        this.floatingCard.set_position(
            this.dragged_card_offset_x(),
            this.dragged_card_offset_y()
        );
       
        return true;
    }

    public on_mouse_up(x: number, y: number): void {

        const card = this.floatingCard.current();
        if (card === null) {
            this.state_machine().move_to(this.stateFactory.make_idle_state());
            return;
        }
        
        const winning = this.dragToEvaluator.winning_pile(this.dragFrom, this.mouseOffsetX, this.mouseOffsetY);
        if (winning ) {          
            this.kick_off_animation_to_winning_pile(card, winning);
            return;
        } 
        this.cancel();
  
    }

    public on_mouse_leave() {
        this.cancel();
    }

    private kick_off_animation_to_winning_pile(card: ICardView, dest: IMoveDestination) {
        const anim = this.modelView.move_card_to(card, dest.pileIndex ); // have this return an animation action?
            if (dest.box && anim) {
                const xOffset = this.dragged_card_offset_x();
                const yOffset = this.dragged_card_offset_y();
                const state = this.stateFactory.make_anim_state(this.floatingCard, dest.box, anim.destPileIndex, xOffset, yOffset, false, 1 );
                this.state_machine().move_to(state);
                return;
            } 
    }

    private dragged_card_offset_x() {
        return MouseController.lastMouseX + this.mouseOffsetX + window.scrollX;
    }

    private dragged_card_offset_y() {
        return MouseController.lastMouseY + this.mouseOffsetY + window.scrollY
    }

    private cancel() {
        const card = this.floatingCard.current();
        if (card && this.dragFrom) {
            const x = this.dragged_card_offset_x();
            const y = this.dragged_card_offset_y();
           
            const state = this.stateFactory.make_anim_state(this.floatingCard, this.dragFrom, card.pileIndex, x, y, false, 1 );
            this.state_machine().move_to(state);
        } else {
            throw new Error("cannot cancel drag");
        }  
        
    }
}