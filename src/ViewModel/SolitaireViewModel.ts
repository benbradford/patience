import {IViewModelData, ICardView, IFloatingCard} from './Cards/ViewModelData'
import SolitaireCollections from '../Model/SolitaireCollections'
import CardInitialiser from '../Model/CardInitialiser'
import CardCollection from '../Model/Cards/CardCollection';
import MoveCardCommand from '../Model/Command/MoveCardCommand'
import MoveManyCardsCommand from '../Model/Command/MoveManyCardsCommand'
import NextCardCommand from '../Model/Command/NextCardCommand'
import DeckMaker from '../Model/Cards/DeckMaker';
import CardShuffler from '../Model/Cards/CardShuffler';
import SolitaireGame from '../Model/SolitaireGame';
import {Card} from '../Model/Cards/Card'
import ViewModelDataSync from './Cards/ViewModelDataSync'
import {ICardActionResult} from '../Model/Cards/ICardActionResult'
import CardsGameViewStateMachine from './Cards/CardsGameViewStateMachine'
import CardTickManager from './Cards/CardTickManager'
import StateFactory from './States/StateFactory'
import DragToEvaluator from './Cards/DragToEvaluator';
import ICardStyles from './Cards/ICardStyles'
import CardBox from './Cards/CardBox'
import SolitaireViewInterface from './SolitaireViewInterface'
import { floating_cards} from './SolitaireCardCollectionsViewModel'
import BoxFinder from './Cards/BoxFinder';

export default class SolitaireViewModel extends SolitaireViewInterface{
    
    private game: SolitaireGame;
    private dataSync: ViewModelDataSync;
    private stateChangeListener: (data: IViewModelData)=> void | null;
    private stateMachine = new CardsGameViewStateMachine();
    private stateFactory: StateFactory;
    private tickManager = new CardTickManager();
    private boxFinder: BoxFinder;

    constructor (cardStyles: ICardStyles, boxFinder: BoxFinder ) {
        super();
        const collections = new SolitaireCollections();
        this.boxFinder = boxFinder;
        this.game = new SolitaireGame(
            collections, 
            new CardInitialiser(new DeckMaker(), new CardShuffler()),
            new MoveCardCommand(collections),
            new NextCardCommand(collections),
            new MoveManyCardsCommand(collections));

        const drag = new DragToEvaluator(cardStyles, boxFinder, this);
        this.stateFactory = new StateFactory(this.stateMachine, this, drag, boxFinder);
        this.stateMachine.move_to(this.stateFactory.make_idle_state());
        this.dataSync = new ViewModelDataSync(this.game.collections().table);
    }

    public register_state_change_listener( listener: (data: IViewModelData) => void) {
        this.stateChangeListener = listener;
    }

    public initialise_table() {
        this.game.lay_out_table();
        this.update_state();
    }

    public tick() {
        this.tickManager.tick();
    }

    public should_enable_undo_button() {
        return this.can_undo() && floating_cards(this.dataSync.data()).length === 0;
    }

    public can_undo(): boolean {
        return this.game.can_undo();
    }

    public on_mouse_leave() {
        this.stateMachine.current().on_mouse_leave();
    }

    public click_deck() {
        if (this.dataSync.data().floating.length === 0) {
            this.next_card();
            this.update_animations([]);
        }
    }

    public on_start_drag (c: ICardView, box: CardBox) {
        this.stateMachine.current().on_start_drag(c, box);
        this.update_state();
    }

    public on_mouse_move(x: number, y: number) {

        this.stateMachine.current().on_mouse_move(x, y);
    }
    
    public on_mouse_up(x: number, y: number) {
       this.stateMachine.current().on_mouse_up(x, y);
    }

    public undo() {
        
        const result = this.game.undo();
        if (result) {
            this.update_state();
        }
    }

        // :TODO: be nice to not have to expose this
    public data_sync() : ViewModelDataSync {
        return this.dataSync;
    }

    // All of these below belong somewhere else


    public update_state(): void {
        // :TODO: make this non-public
        this.dataSync.sync_view_with_model();
        if (this.stateChangeListener ) {
            this.stateChangeListener(this.table_data());
        }
    }

    public update_animations(floating: IFloatingCard[]) {
        this.dataSync.sync_view_with_animation_requests(this.boxFinder, floating);
        if (this.stateChangeListener ) {
            this.stateChangeListener(this.table_data());
        }
    }

    // :TODO: move this
    public valid_move_to_destinations(card: ICardView): number[] {
        const modelCard = this.dataSync.model_card(card);
        const destinations: number[] = [];
        for (let i = 0; i < this.dataSync.data().piles.length; ++i) {
            if (this.is_valid_move_to(modelCard, this.game.collections().table.collection(i))) {
                destinations.push(i);
            }
        }
        return destinations;
    }

    public move_card_to(card: ICardView, destIndex: number){
        const modelCard = this.dataSync.model_pile(card.pileIndex).find(card.suit, card.face);
        if (modelCard === null) {
            return;
        }
        const toPile = this.dataSync.model_pile(destIndex);

        let moved : ICardActionResult | null= null;

        if (modelCard.collection && modelCard.collection.peek() === modelCard) {
            moved = this.game.move(modelCard, toPile);
        } else {
            moved = this.game.move_many(modelCard, toPile);
        }
        if (moved) {
            this.update_state();
        }
    }

    public next_card() {
        const result = this.game.next();
        if (result) {
            this.update_state();
        }
    }

    public table_data(): IViewModelData {
        return  this.dataSync.data();
    }

    private is_valid_move_to(modelCard: Card, collection: CardCollection): boolean{ 
        if (modelCard.collection && modelCard.collection.peek() === modelCard) {
            return this.can_move_card_to(modelCard, collection);
        } else {
            return this.can_move_many_cards_to(modelCard, collection);
        }        
    }

    private can_move_card_to(c: Card, d: CardCollection): boolean {
         return this.game.can_move_card_to(c, d);
    }

    private can_move_many_cards_to(c: Card, d: CardCollection): boolean {
        return this.game.can_move_many_cards_to(c, d);
    }

}