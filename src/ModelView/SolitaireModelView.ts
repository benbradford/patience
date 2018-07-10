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

export default class SolitaireModelView {
    private collections = new SolitaireCollections();
    private game: SolitaireGame;
    private moveCardCommand = new MoveCardCommand(this.collections);
    private nextCardCommand = new NextCardCommand(this.collections);
    private moveManyCardsCommand = new MoveManyCardsCommand(this.collections);
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

    public move_card_to(card: ICardView, destIndex: number): boolean {
        const modelCard = this.dataSync.model_pile(card.pileIndex).find(card.suit, card.face);
        if (modelCard === null) {
            return false;
        }
        const toPile = this.dataSync.model_pile(destIndex);

        let moved = false;

        if (modelCard.collection && modelCard.collection.peek() === modelCard) {
            moved = this.game.move(modelCard, toPile);
        } else {
            moved = this.game.move_many(modelCard, toPile);
        }
        if (moved) {
            this.dataSync.sync_view_with_model();
            return true;
        }
        return false;
    }

    public view_card(card: ICardView, pileIndex: number): ICardView {
        
        let pile: IPileView | null = null;
        if (pileIndex === 0) {
            pile = this.deck();
        } else if (pileIndex === 1) {
            pile = this.turned();
        } else if (pileIndex < 9) {
            pile = this.hold()[pileIndex-2];
        } else if (pileIndex < 14) {
            pile = this.score()[pileIndex - 10];
        }
        if (pile) {
            for (const c of pile.cards) {
                if (c.suit === card.suit && c.face === card.face) {
                    return c;
                }
            }
        }
        throw Error("cannot get view card");
        
    }

    public next_card(): boolean {
        if (this.game.next()) {
                this.dataSync.sync_view_with_model();
            return true;
        }
        return false;
    }
    
    public table_data(): IModelViewData {
        return  this.dataSync.model_view_data();
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
    }
}