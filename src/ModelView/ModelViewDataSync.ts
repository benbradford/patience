import {ITableData, ICardPile, ICard, PileName, score_name, hold_name} from './ViewData'
import SolitaireCollections from '../Model/SolitaireCollections'
import {ScoreIndex, HoldIndex} from '../Model/SolitaireCollections'
import CardInitialiser from '../Model/CardInitialiser'
import CardCollection from '../Model/Cards/CardCollection';
import MoveCardCommand from '../Model/Command/MoveCardCommand'
import MoveManyCardsCommand from '../Model/Command/MoveManyCardsCommand'
import NextCardCommand from '../Model/Command/NextCardCommand'
import DeckMaker from '../Model/Cards/DeckMaker';
import CardShuffler from '../Model/Cards/CardShuffler';
import SolitaireGame from '../Model/SolitaireGame';
import CardAction from 'src/Model/Cards/CardAction';

export default class ModelViewDataSync {

    private tableData: ITableData;
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
        this.sync_view_with_model();
    }

    public can_move_card_to(card: ICard, dest: PileName): boolean {     
        const modelCard = this.model_collection_from_pile_name(card.pileName).find(card.suit, card.face);
        if (modelCard === null) {
            return false;
        }
        const toPile = this.model_collection_from_pile_name(dest);
        return this.moveCardCommand.can_execute(new CardAction(this.moveCardCommand, modelCard, toPile));
   }

   public move_card_to(card: ICard, dest: PileName): boolean {
       const modelCard = this.model_collection_from_pile_name(card.pileName).find(card.suit, card.face);
       if (modelCard === null) {
           return false;
       }
       const toPile = this.model_collection_from_pile_name(dest);
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
   
   public table_data(): ITableData {
       return this.tableData;
   }

    private sync_view_with_model() {
        this.tableData = {
            deck: this.make_view_pile_from_model_pile(this.collections.deck(), "deck"),
            turned: this.make_view_pile_from_model_pile(this.collections.turned(), "turned"),
            score: this.make_score_view_piles_from_model_piles(),
            hold: this.make_hold_view_piles_from_model_piles()
        };
    }

    private make_score_view_piles_from_model_piles(): ICardPile[] {
        const viewPiles: ICardPile[] = [];
        const valid : ScoreIndex[] = [0, 1, 2, 3];
        for (const i of valid) {
            viewPiles.push(this.make_view_pile_from_model_pile(this.collections.score(i), score_name(i)));
        }
        return viewPiles;
    }

    private make_hold_view_piles_from_model_piles(): ICardPile[] {
        const viewPiles: ICardPile[] = [];
        const valid : HoldIndex[] = [0, 1, 2, 3];
        for (const i of valid) {
            viewPiles.push(this.make_view_pile_from_model_pile(this.collections.hold(i), hold_name(i)));
        }
        return viewPiles;
    }

    private make_view_pile_from_model_pile(collection: CardCollection, nameOfPile: PileName): ICardPile {  
        const viewCards : ICard[] = [];

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

    private model_collection_from_pile_name(name: PileName): CardCollection {
        if (name === "deck") {
            return this.collections.deck();
        }
        if (name === "turned") {
            return this.collections.deck();
        }
        if (name === "hold0") {
            return this.collections.hold(0);
        }
        if (name === "hold1") {
            return this.collections.hold(1);
        }
        if (name === "hold2") {
            return this.collections.hold(2);
        }
        if (name === "hold3") {
            return this.collections.hold(3);
        }
        if (name === "hold4") {
            return this.collections.hold(4);
        }
        if (name === "hold5") {
            return this.collections.hold(5);
        }
        if (name === "hold6") {
            return this.collections.hold(6);
        }
        if (name === "score0") {
            return this.collections.score(0);
        }
        if (name === "score1") {
            return this.collections.score(0);
        }
        if (name === "score2") {
            return this.collections.score(0);
        }
        if (name === "score3") {
            return this.collections.score(0);
        }
        throw Error("invalid pile name");
    }
}