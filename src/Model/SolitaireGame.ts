
import {Card} from './Cards/Card'
import SolitaireCollections from './SolitaireCollections'
import CardInitialiser from './CardInitialiser'
import CardCollection from './Cards/CardCollection';
import MoveCardCommand from './Command/MoveCardCommand'
import MoveManyCardsCommand from './Command/MoveManyCardsCommand'
import NextCardCommand from './Command/NextCardCommand'
import CardAction from '../Model/Cards/CardAction';
import CardActionExecutor from '../Model/Cards/CardActionExecutor';

export default class SolitaireGame {

    private cards: Card[];
    
    private moveCard: MoveCardCommand;
    private nextCard: NextCardCommand;
    private moveMany: MoveManyCardsCommand;

    private cardExecutor: CardActionExecutor;

    constructor(collections: SolitaireCollections, initialiser: CardInitialiser, moveCard: MoveCardCommand, nextCard: NextCardCommand, moveMany: MoveManyCardsCommand) {
        this.cards = initialiser.deck_maker().make_full_deck();
        initialiser.card_shuffler().shuffle(this.cards);
        
        for (const card of this.cards) {
            collections.deck().push(card);
        }

        this.moveCard = moveCard;
        this.nextCard = nextCard;
        this.moveMany = moveMany;
        this.cardExecutor = new CardActionExecutor();
    }

    public move(card: Card, to: CardCollection): boolean {
        return this.cardExecutor.attempt(new CardAction(this.moveCard, card, card.collection, to));
    }

    public next() : boolean {
        return this.cardExecutor.attempt(new CardAction(this.nextCard));
    }

    public move_many(card: Card, to: CardCollection): boolean {
        return this.cardExecutor.attempt(new CardAction(this.moveMany, card, card.collection, to));
    }

    public card_executor() : CardActionExecutor {
        return this.cardExecutor;
    }

}