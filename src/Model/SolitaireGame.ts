import Table from './Table'
import {Card} from './Cards/Card'

import CardManipulator from './CardManipulator'

export default class SolitaireGame {

    private table : Table;
    private readonly cards : Card[];

    constructor(table : Table, manipulator : CardManipulator) {
        this.table = table;
        this.cards = manipulator.deck_maker().make_full_deck();

        manipulator.card_shuffler().shuffle(this.cards);
        for (const card of this.cards) {
            this.table.deck_collection().push(card);
        }
    }
/*
    public turn_next(): Card  | null {
        const card = this.table.deck_collection().peek();
        if (card === null) {
            return null;
        }   
        return card.move_to(this.table.turn_collection()).turn();
    }

    public replace_deck_from_turn() {
        while (this.table.turn_collection().is_empty() === false) {
            const card = this.table.turn_collection().peek();
            if (card !== null) {
                card.move_to(this.table.deck_collection());
                card.turn();
            }
        }
    }

    public has_cards_in_deck(): boolean {
        return this.table.deck_collection().is_empty() === false;
    }

    private setUpTable(): boolean {
        const deck = this.table.deck_collection();
        deck.shuffle();

        for (let i = 0; i < 7; ++i) {
            const faceUpCard = this.table.deck_collection().remove();
            const holdCardCollection = this.table.hold_collection(i);
            if (faceUpCard === null || holdCardCollection === null)  {
                return false;
            }
            faceUpCard.turn();
            holdCardCollection.push(faceUpCard);
            for (let j=i+1; j < 7; ++j) {
                const card = deck.remove();
                if (card === null) {
                    return false;
                }
                holdCardCollection.push(card);
            }
        }

        return true;
    }
    */
}