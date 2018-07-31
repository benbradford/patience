import {IViewModelData, ICardView, IPileView} from './Cards/ViewModelData'
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
import IAnimationAction from './IAnimationAction'
import FloatingCards from './Cards/FloatingCards'
import CardsGameViewStateMachine from './Cards/CardsGameViewStateMachine'
import CardTickManager from './Cards/CardTickManager'
import AnimationController from './AnimationController'
import StateFactory from './States/StateFactory'
import DragToEvaluator from './Cards/DragToEvaluator';
import ICardStyles from './Cards/ICardStyles'
import CardBox from './Cards/CardBox'
import SolitaireViewInterface from './SolitaireViewInterface'

export default class SolitaireViewModel extends SolitaireViewInterface{
    
    private game: SolitaireGame;
    private dataSync: ViewModelDataSync;
    private stateChangeListener: (data: IViewModelData)=> void | null;
    private floatingCards = new FloatingCards();
    private animationController: AnimationController;
    private stateMachine = new CardsGameViewStateMachine();
    private stateFactory: StateFactory;
    private tickManager = new CardTickManager();

    constructor (cardStyles: ICardStyles, boxFor: (pileIndex: number) => CardBox | null ) {
        super();
        const collections = new SolitaireCollections();

        this.game = new SolitaireGame(
            collections, 
            new CardInitialiser(new DeckMaker(), new CardShuffler()),
            new MoveCardCommand(collections),
            new NextCardCommand(collections),
            new MoveManyCardsCommand(collections));

        this.animationController = new AnimationController(this, cardStyles);
        this.tickManager.add(this.animationController);
        const drag = new DragToEvaluator(cardStyles, boxFor, this);
        this.stateFactory = new StateFactory(this.stateMachine, this.floatingCards, this,drag, this.animationController, boxFor);
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
        return this.can_undo() && this.floatingCards.has_any() === false;
    }

    public floating_cards() {
        return this.floatingCards;
    }

    public deck(): Readonly<IPileView> {
        return this.dataSync.view_pile(0);
    }

    public turned(): Readonly<IPileView> {
        return this.dataSync.view_pile(1);
    }

    public hold(): Readonly<IPileView[]> {
        const piles: IPileView[]= [];
        for (let i = 2; i < 9; ++i) {
            piles.push(this.dataSync.view_pile(i));
        }
        return piles;
    }

    public score(): Readonly<IPileView[]> {
        const piles: IPileView[]= [];
        for (let i = 10; i <= 13; ++i) {
            piles.push(this.dataSync.view_pile(i));
        }
        return piles;
    }

    public can_undo(): boolean {
        return this.game.can_undo();
    }

    public undo() {
        this.stateMachine.move_to(this.stateFactory.make_undo_state());
    }

    public on_mouse_leave() {
        this.stateMachine.current().on_mouse_leave();
    }

    public click_deck() {
        if (this.floatingCards.has_any() === false) {
            this.stateMachine.move_to(this.stateFactory.make_deck_click_state());
        }
    }

    public on_start_drag (c: ICardView, box: CardBox) {
         this.stateMachine.current().on_start_drag(c, box);
    }

    public on_mouse_move(x: number, y: number) {

        this.stateMachine.current().on_mouse_move(x, y);
    }
    
    public on_mouse_up(x: number, y: number) {
       this.stateMachine.current().on_mouse_up(x, y);
    }

        // :TODO: be nice to not have to expose this
    public data_sync() : ViewModelDataSync {
        return this.dataSync;
    }

    // All of these below belong somewhere else
    public perform_undo() {
        const result = this.game.undo();
        if (result) {
            this.update_state();
            return this.to_animation_action(result);
        }
        return null;
    }

    public update_state() {
        // :TODO: make this non-public
        this.dataSync.sync_view_with_model();
        if (this.stateChangeListener ) {
            this.stateChangeListener(this.table_data());
        }
    }

    // :TODO: move this
    public valid_move_to_destinations(card: ICardView): number[] {
        const modelCard = this.dataSync.model_card(card);
        const destinations: number[] = [];
        for (let i = 0; i < this.dataSync.model_view_data().piles.length; ++i) {
            if (this.is_valid_move_to(modelCard, this.game.collections().table.collection(i))) {
                destinations.push(i);
            }
        }
        return destinations;
    }

    public move_card_to(card: ICardView, destIndex: number): IAnimationAction | null {
        const modelCard = this.dataSync.model_pile(card.pileIndex).find(card.suit, card.face);
        if (modelCard === null) {
            return null;
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
            return this.to_animation_action(moved);
        }
        return null;
    }

    public next_card(): IAnimationAction | null {
        const result = this.game.next();
        if (result) {
            this.update_state();
            return this.to_animation_action(result);
        }
        return null;
    }

    public table_data(): IViewModelData {
        return  this.dataSync.model_view_data();
    }

    private to_animation_action(result: ICardActionResult): IAnimationAction {
        
        const destIndex = this.dataSync.pile_index(result.move.to);
        const startIndex = this.dataSync.pile_index(result.move.from);
        return {
            card: this.dataSync.view_card(result.move.card, destIndex),
            startPileIndex: startIndex,
            destPileIndex: destIndex,
            turn: result.flip !== null
        };
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