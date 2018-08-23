import CardsGameViewStateMachine from '../Cards/CardsGameViewStateMachine'
import CardsGameViewState from '../Cards/CardsGameViewState'
import CardBox from '../Cards/CardBox'
import {ICardView, IFloatingCard} from '../Cards/ViewModelData'
import SolitaireViewModel from '../SolitaireViewModel'
import MouseController from '../Cards/MouseController'
import DragToEvaluator from '../Cards/DragToEvaluator'
import StateFactory from './StateFactory'
import { floating_cards } from '../SolitaireCardCollectionsViewModel';
import MultipleCardsSyncHelper from '../Cards/MultipleCardsSyncHelper'
import BoxFinder from '../Cards/BoxFinder';

export default class DragState extends CardsGameViewState {

    private readonly mouseOffsetX: number;
    private readonly mouseOffsetY: number;
    private readonly dragFrom: CardBox;
    private readonly dragToEvaluator: DragToEvaluator;
    private readonly stateFactory: StateFactory;
    private readonly viewModel: SolitaireViewModel;
    private cardSyncHelper: MultipleCardsSyncHelper;
  
    constructor(machine: CardsGameViewStateMachine,
                viewModel: SolitaireViewModel,
                dragToEvaluator: DragToEvaluator,
                stateFactory: StateFactory,
                c: ICardView, boxFinder: BoxFinder) {

        super(machine);
        this.viewModel = viewModel;
        this.stateFactory = stateFactory;
        this.dragToEvaluator = dragToEvaluator;    
      
        this.cardSyncHelper = new MultipleCardsSyncHelper(c, boxFinder, viewModel.data_sync());
        const floating: IFloatingCard[] = this.cardSyncHelper.floating_cards();
        this.viewModel.data_sync().pickupCards(floating);
        
        this.mouseOffsetX = (floating[0].box.left() - MouseController.lastMouseX) - 14;
        this.mouseOffsetY= (floating[0].box.top() - MouseController.lastMouseY) - 8;
        this.dragFrom = new CardBox(floating[0].box.left(), floating[0].box.top(), floating[0].box.width, floating[0].box.height);
       
        this.dragToEvaluator.set_valid_destinations(c);      
    }

    public on_mouse_move(x: number, y: number): boolean { 
        const floating = floating_cards(this.viewModel.data_sync().data());
        if (floating.length === 0) {
            throw new Error("no floating card to drag");
            return false;
        }
        
        const box = floating[0].box;
        box.set_position(this.dragged_card_offset_x(), this.dragged_card_offset_y());

        this.cardSyncHelper.update_positions();
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

        const floating = this.viewModel.data_sync().floating_cards();
        const winning = this.dragToEvaluator.winning_pile(this.dragFrom, this.mouseOffsetX, this.mouseOffsetY);
        this.viewModel.data_sync().dropCards();
        if (winning ) {          
            this.viewModel.move_card_to(card.card, winning.pileIndex );    
        } 
        this.cancel(floating);
    }

    public on_mouse_leave() {
        const floating = this.viewModel.data_sync().floating_cards();
        this.viewModel.data_sync().dropCards();
        
        this.cancel(floating);
    }

    private dragged_card_offset_x() {
        return MouseController.lastMouseX + this.mouseOffsetX + window.scrollX;
    }

    private dragged_card_offset_y() {
        return MouseController.lastMouseY + this.mouseOffsetY + window.scrollY
    }

    private cancel(floating: IFloatingCard[]) {
        
        this.viewModel.update_animations(floating);
        const state = this.stateFactory.make_idle_state();
        this.state_machine().move_to(state);

    }

    private floating_card(): IFloatingCard {
        const floating = floating_cards(this.viewModel.data_sync().data());
        const card = floating[0];
        return card;
    }
}