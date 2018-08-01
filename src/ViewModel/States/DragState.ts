import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'
import CardsGameViewState from '../Cards/CardsGameViewState'
import CardBox from '../Cards/CardBox'
import {ICardView, IFloatingCard} from '../Cards/ViewModelData'
import SolitaireViewModel from '../../ViewModel/SolitaireViewModel'
import MouseController from '../Cards/MouseController'
import DragToEvaluator from '../Cards/DragToEvaluator'
import StateFactory from './StateFactory'
import {IMoveDestination} from '../Cards/DragToEvaluator'
import { floating_cards } from '../SolitaireCardCollectionsViewModel';

export default class DragState extends CardsGameViewState {

    private readonly mouseOffsetX: number;
    private readonly mouseOffsetY: number;
    private readonly dragFrom: CardBox;
    private readonly dragToEvaluator: DragToEvaluator;
    private readonly stateFactory: StateFactory;
    private readonly viewModel: SolitaireViewModel;

    constructor(machine: CardsGameViewStateMachine,
                viewModel: SolitaireViewModel,
                dragToEvaluator: DragToEvaluator,
                stateFactory: StateFactory,
                c: ICardView, box: CardBox) {

        super(machine);
        this.viewModel = viewModel;
        this.stateFactory = stateFactory;
        this.dragToEvaluator = dragToEvaluator;    
        this.mouseOffsetX = (box.left - MouseController.lastMouseX) - 14;
        this.mouseOffsetY= (box.top - MouseController.lastMouseY) - 8;
        this.dragFrom = new CardBox(box.left, box.right, box.bottom, box.top, box.width, box.height);
        this.viewModel.data_sync().pickupCard(c, box);

        this.dragToEvaluator.set_valid_destinations(c);      
    }

    public on_mouse_move(x: number, y: number): boolean { 
        const floating = floating_cards(this.viewModel.data_sync().data());
        if (floating.length === 0) {
            throw new Error("no floating card to drag");
            return false;
        }
        const box = floating[0].box;
        box.left = this.dragged_card_offset_x();
        box.top = this.dragged_card_offset_y();
        box.right = box.left + box.width;
        box.bottom = box.top + box.height;
        this.viewModel.update_state();
       
        return true;
    }

    public on_mouse_up(x: number, y: number): void {
        const card = this.floating_card();
        if (card === null) {
            throw new Error("no floating card to drag");
            this.state_machine().move_to(this.stateFactory.make_idle_state());
            return;
        }
        
        const winning = this.dragToEvaluator.winning_pile(this.dragFrom, this.mouseOffsetX, this.mouseOffsetY);
        if (winning ) {          
            this.kick_off_animation_to_winning_pile(winning);
            return;
        } 
        this.cancel();
  
    }

    public on_mouse_leave() {
        this.cancel();
    }

    private kick_off_animation_to_winning_pile(dest: IMoveDestination) {
        const anim = this.viewModel.move_card_to(this.floating_card().card, dest.pileIndex );
            if (dest.box && anim) {
                const xOffset = this.dragged_card_offset_x();
                const yOffset = this.dragged_card_offset_y();
                const state = this.stateFactory.make_anim_state(this.floating_card(), dest.box, anim.destPileIndex, xOffset, yOffset, false, 1 );
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
        const card = this.floating_card();
        if (card && this.dragFrom) {
            const x = this.dragged_card_offset_x();
            const y = this.dragged_card_offset_y();
           
            const state = this.stateFactory.make_anim_state(this.floating_card(), this.dragFrom, 0, x, y, false, 1 ); // :TODO: get pile to move back to?
            this.state_machine().move_to(state);
        } else {
            throw new Error("cannot cancel drag");
        }  
        
    }

    private floating_card(): IFloatingCard {
        const floating = floating_cards(this.viewModel.data_sync().data());
        const card = floating[0];
        return card;
    }
}