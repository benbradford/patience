
import {Card} from './Cards/Card'
import SolitaireCollections from './SolitaireCollections'
import CardInitialiser from './CardInitialiser'
import CardCollection from './Cards/CardCollection';
import MoveCardCommand from './Command/MoveCardCommand'
import MoveManyCardsCommand from './Command/MoveManyCardsCommand'
import NextCardCommand from './Command/NextCardCommand'
import CardAction from '../Model/Cards/CardAction';
import CardActionExecutor from '../Model/Cards/CardActionExecutor';
import {ICardActionResult} from '../Model/Cards/ICardActionResult'

export default class SolitaireGame {

    private cards: Card[];
    
    private moveCard: MoveCardCommand;
    private nextCard: NextCardCommand;
    private moveMany: MoveManyCardsCommand;

    private cardExecutor: CardActionExecutor;
    private cardCollections: SolitaireCollections;

    constructor(collections: SolitaireCollections, initialiser: CardInitialiser, moveCard: MoveCardCommand, nextCard: NextCardCommand, moveMany: MoveManyCardsCommand) {
        this.cards = initialiser.deck_maker().make_full_deck();
        this.cardCollections = collections;
        initialiser.card_shuffler().shuffle(this.cards);
        
        for (const card of this.cards) {
            collections.deck().push(card);
        }

        this.moveCard = moveCard;
        this.nextCard = nextCard;
        this.moveMany = moveMany;
        this.cardExecutor = new CardActionExecutor();
    }

    public move(c: Card, t: CardCollection): ICardActionResult | null {
        return this.cardExecutor.attempt(new CardAction(this.moveCard, {card: c, from: c.collection, to: t, turnNextInFrom: false}));
    }

    public next(): ICardActionResult | null {
        return this.cardExecutor.attempt(new CardAction(this.nextCard, {}));
    }

    public move_many(c: Card, t: CardCollection): ICardActionResult | null {
        return this.cardExecutor.attempt(new CardAction(this.moveMany, {card: c, from: c.collection, to: t, turnNextInFrom: false}));
    }

    public card_executor() : CardActionExecutor {
        return this.cardExecutor;
    }

    public can_undo(): boolean {
        return this.cardExecutor.can_undo();
    }

    public undo(): ICardActionResult | null {
        return this.cardExecutor.undo();
    }

    public collections() {
        return this.cardCollections;
    }

    public can_move_card_to(c: Card, d: CardCollection): boolean {
        return this.moveCard.can_execute({card: c, from: c.collection, to: d});
    }

    public can_move_many_cards_to(c: Card, d: CardCollection): boolean {
        return this.moveMany.can_execute({card: c, from: c.collection, to: d});
    }   

    public lay_out_table() {
        for (let i = 0; i < 7; ++i) {
            const faceUpCard = this.cardCollections.deck().remove();
            const holdCardCollection = this.cardCollections.hold(i);
            if (faceUpCard === null || holdCardCollection === null)  {
                return;
            }  
            if (i === 0) {
                faceUpCard.turn();
            } 
            holdCardCollection.push(faceUpCard);
            for (let j=i-1; j >=0; --j) {

                const card = this.cardCollections.deck().remove();
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