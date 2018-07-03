import {IModelViewData, IPileView, ICardView, PileName, score_name, hold_name} from './ViewData'
import SolitaireCollections from '../Model/SolitaireCollections'
import {ScoreIndex} from '../Model/SolitaireCollections'
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
import {model_collection_from_pile_name, model_card_from_view_card, all_hold_indices, all_score_indices, view_pile_from_model_pile} from './ModelViewConversion'

export default class ModelViewDataSync {

    private modelViewData: IModelViewData;
    private collections = new SolitaireCollections();
    private game: SolitaireGame;
    private moveCardCommand = new MoveCardCommand(this.collections);
    private nextCardCommand = new NextCardCommand(this.collections);
    private moveManyCardsCommand = new MoveManyCardsCommand(this.collections);

    constructor () {
        this.game = new SolitaireGame(
            this.collections, 
            new CardInitialiser(new DeckMaker(), new CardShuffler()),
            this.moveCardCommand,
            this.nextCardCommand,
            this.moveManyCardsCommand);

        this.lay_out_table();
        this.sync_view_with_model();
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
       if (this.game.move(modelCard, toPile)) {
           this.sync_view_with_model();
           return true;
       }
       return false;
   }

   public next_card(): boolean {
       if (this.game.next()) {
           this.sync_view_with_model();
           return true;
       }
       return false;
   }
   
   public table_data(): IModelViewData {
       return this.modelViewData;
   }

   private get_pile_if_valid_move_to(modelCard: Card, collection: CardCollection): PileName | null{
    if (this.can_move_card_to(modelCard, collection)) {
        return view_pile_from_model_pile(collection, this.collections);     
    }
    return null;
   }

   private can_move_card_to(card: Card, dest: CardCollection): boolean {     
       
        return this.moveCardCommand.can_execute(new CardAction(this.moveCardCommand, card, card.collection, dest));
    }

    private sync_view_with_model() {
        this.modelViewData = {
            deck: this.make_view_pile_from_model_pile(this.collections.deck(), "deck"),
            turned: this.make_view_pile_from_model_pile(this.collections.turned(), "turned"),
            score: this.make_score_view_piles_from_model_piles(),
            hold: this.make_hold_view_piles_from_model_piles()
        };
    }

    private make_score_view_piles_from_model_piles(): IPileView[] {
        const viewPiles: IPileView[] = [];
        const valid : ScoreIndex[] = [0, 1, 2, 3];
        for (const i of valid) {
            viewPiles.push(this.make_view_pile_from_model_pile(this.collections.score(i), score_name(i)));
        }
        return viewPiles;
    }

    private make_hold_view_piles_from_model_piles(): IPileView[] {
        const viewPiles: IPileView[] = [];
        for (const i of all_hold_indices()) {
            viewPiles.push(this.make_view_pile_from_model_pile(this.collections.hold(i), hold_name(i)));
        }
        if (viewPiles.length !==7) {
            throw Error("incorrect number of piles");
        }
        return viewPiles;
    }

    private make_view_pile_from_model_pile(collection: CardCollection, nameOfPile: PileName): IPileView {  
        const viewCards : ICardView[] = [];

        for (let i = collection.size()-1; i >= 0; --i) {
            const modelCard = collection.peek(i);

            if (modelCard === null) {
                continue;
            }
            viewCards.push({
                suit: modelCard.suit,
                face: modelCard.face,
                turned: modelCard.is_turned_up(),
                pileName: nameOfPile
            });
        }
        return {cards : viewCards};
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