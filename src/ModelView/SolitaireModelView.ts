import {IModelViewData, ICardView, IPileView} from './Cards/ModelViewData'
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
import ModelViewDataSync from './Cards/ModelViewDataSync'
import SolitaireSolver from '../Model/SolitaireSolver'
import {ICardActionResult} from '../Model/Cards/ICardActionResult'
import IAnimationAction from './IAnimationAction'
// import AutoCompleteStepper from './AutoCompleteStepper';

export default class SolitaireModelView {
    private collections = new SolitaireCollections();
    private game: SolitaireGame;
    private moveCardCommand = new MoveCardCommand(this.collections);
    private nextCardCommand = new NextCardCommand(this.collections);
    private moveManyCardsCommand = new MoveManyCardsCommand(this.collections);
    // private autoCompleteStepper= new AutoCompleteStepper(this.collections);
    private dataSync: ModelViewDataSync;

    constructor () {
        this.game = new SolitaireGame(
            this.collections, 
            new CardInitialiser(new DeckMaker(), new CardShuffler()),
            this.moveCardCommand,
            this.nextCardCommand,
            this.moveManyCardsCommand);

        this.lay_out_table();
        this.dataSync = new ModelViewDataSync(this.collections.table);
    }

    // :TODO: be nice to not have to expose this
    public data_sync() : ModelViewDataSync {
        return this.dataSync;
    }

    public deck(): IPileView {
        return this.dataSync.view_pile(0);
    }

    public turned(): IPileView {
        return this.dataSync.view_pile(1);
    }

    public hold(): IPileView[] {
        const piles: IPileView[]= [];
        for (let i = 2; i < 9; ++i) {
            piles.push(this.dataSync.view_pile(i));
        }
        return piles;
    }

    public score(): IPileView[] {
        const piles: IPileView[]= [];
        for (let i = 10; i <= 13; ++i) {
            piles.push(this.dataSync.view_pile(i));
        }
        return piles;
    }

    public can_undo(): boolean {
        return this.game.can_undo();
    }

    public undo(): IAnimationAction | null {
        const result = this.game.undo();
        if (result) {
            this.dataSync.sync_view_with_model();
            return this.to_animation_action(result);
        }
        return null;
    }

    public valid_move_to_destinations(card: ICardView): number[] {
        const modelCard = this.dataSync.model_card(card);
        const destinations: number[] = [];
        for (let i = 0; i < this.dataSync.model_view_data().piles.length; ++i) {
            if (this.is_valid_move_to(modelCard, this.collections.table.collection(i))) {
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
            this.dataSync.sync_view_with_model();
            return this.to_animation_action(moved);
        }
        return null;
    }

    public next_card(): IAnimationAction | null {
        const result = this.game.next();
        if (result) {
            this.dataSync.sync_view_with_model();
            return this.to_animation_action(result);
        }
        return null;
    }
/*
    public auto_complete_step(): boolean {
        return this.autoCompleteStepper.can_autocomplete();
    }
    */
    public table_data(): IModelViewData {
        return  this.dataSync.model_view_data();
    }

    private to_animation_action(result: ICardActionResult): IAnimationAction {
        
        const destIndex = this.dataSync.pile_index(result.move.to);
        const startIndex = this.dataSync.pile_index(result.move.from);
        return {
            card: this.dataSync.view_card(result.move.card, destIndex),
            startPileIndex: startIndex,
            destPileIndex: destIndex,
            turn: result.flip.length > 0
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
         return this.moveCardCommand.can_execute({card: c, from: c.collection, to: d});
    }

    private can_move_many_cards_to(c: Card, d: CardCollection): boolean {
        return this.moveManyCardsCommand.can_execute({card: c, from: c.collection, to: d});
    }

    private lay_out_table(): void {
        for (let i = 0; i < 7; ++i) {
            const faceUpCard = this.collections.deck().remove();
            const holdCardCollection = this.collections.hold(i);
            if (faceUpCard === null || holdCardCollection === null)  {
                return;
            }  
            if (i === 0) {
                faceUpCard.turn();
            } 
            holdCardCollection.push(faceUpCard);
            for (let j=i-1; j >=0; --j) {

                const card = this.collections.deck().remove();
                if (card === null) {
                       return;
                }
                if (j === 0) {
                    card.turn();
                }
                holdCardCollection.push(card);
            }
        }

        const solver = new SolitaireSolver(this.collections,this.moveCardCommand, this.moveCardCommand, this.nextCardCommand);
        solver.solve();
        if (solver.winning_sequence().length > 0) {
            throw Error("solved!");
        }
    }
}