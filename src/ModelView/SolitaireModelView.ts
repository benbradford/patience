import {model_collection_from_pile_name, model_card_from_view_card, all_hold_indices, all_score_indices, view_pile_from_model_pile} from './ModelViewConversion'
import {IModelViewData, ICardView, PileName} from './ModelViewData'
import SolitaireCollections from '../Model/SolitaireCollections'
import CardInitialiser from '../Model/CardInitialiser'
import CardCollection from '../Model/Cards/CardCollection';
import MoveCardCommand from '../Model/Command/MoveCardCommand'
import MoveManyCardsCommand from '../Model/Command/MoveManyCardsCommand'
import NextCardCommand from '../Model/Command/NextCardCommand'
import DeckMaker from '../Model/Cards/DeckMaker';
import CardShuffler from '../Model/Cards/CardShuffler';
import SolitaireGame from '../Model/SolitaireGame';
import CardAction from '../Model/Cards/CardAction';
import {Card} from '../Model/Cards/Card'
import ModelViewDataSync from './ModelViewDataSync'

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
        this.dataSync = new ModelViewDataSync(this.collections);
    }

    public valid_move_to_destinations(card: ICardView): PileName[] {
            const modelCard = model_card_from_view_card(card, this.collections);
            const destinations: PileName[] = [];
            for (const i of all_hold_indices()) {
                const dest = this.get_pile_if_valid_move_to(modelCard, this.collections.hold(i));
                if (dest !== null) {
                    destinations.push(dest);
                }
            }

            for (const i of all_score_indices()) {
                const dest = this.get_pile_if_valid_move_to(modelCard, this.collections.score(i));
                if (dest !== null) {
                    destinations.push(dest);
                }
            }
            return destinations;
    }

    public move_card_to(card: ICardView, dest: PileName): boolean {
        const modelCard = model_collection_from_pile_name(card.pileName, this.collections).find(card.suit, card.face);
        if (modelCard === null) {
            return false;
        }
        const toPile = model_collection_from_pile_name(dest, this.collections);

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

    private get_pile_if_valid_move_to(modelCard: Card, collection: CardCollection): PileName | null {
            
            let canMove = false;
            if (modelCard.collection && modelCard.collection.peek() === modelCard) {
                canMove = this.can_move_card_to(modelCard, collection);
            } else {
                canMove = this.can_move_many_cards_to(modelCard, collection);
            }
            if (canMove) {
                return view_pile_from_model_pile(collection, this.collections);     
            }
            return null;
    }

    private can_move_card_to(card: Card, dest: CardCollection): boolean {      
        return this.moveCardCommand.can_execute(new CardAction(this.moveCardCommand, card, card.collection, dest));
    }

    private can_move_many_cards_to(card: Card, dest: CardCollection): boolean {
        return this.moveManyCardsCommand.can_execute(new CardAction(this.moveCardCommand, card, card.collection, dest));
    }

    private lay_out_table(): void {
        for (const i of all_hold_indices()) {
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