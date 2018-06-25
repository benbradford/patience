import CardTable from './Cards/CardTable'
import CardCollection from './Cards/CardCollection'

enum SolitairePiles {
    Deck = 0,
    Turned,
    Hold0,
    Hold1,
    Hold2,
    Hold3,
    Hold4,
    Hold5,
    Hold6,
    Hold7,
    Score0,
    Score1,
    Score2,
    Score3,

    Max
}

export default class SolitaireCollections {

    private table: CardTable = new CardTable(SolitairePiles.Max);

    public deck(): CardCollection {
        let collection = this.table.collection(this.deck_index());
        if (!collection) {
            throw Error("no deck");
        }
        return collection;
    }

    public turned(): CardCollection {
        let collection = this.table.collection(this.turned_index());
        if (!collection) {
            throw Error("no turned");
        }
        return collection;
    }

    public hold(index: number): CardCollection | null {
        const adjustedIndex = this.hold_index(index);
        if (!adjustedIndex) {
            return null;
        }
        return this.table.collection(adjustedIndex);
    }

    public score(index: number): CardCollection | null {
        const adjustedIndex = this.score_index(index);
        if (!adjustedIndex) {
            return null;
        }
        return this.table.collection(adjustedIndex);
    }

    public is_hold(collection: CardCollection): boolean {
        const minHold = this.hold_index(0);
        const maxHold = this.hold_index(7);
        if (!minHold || !maxHold) {
            throw Error("invalid hold");
        }
        for (let i = minHold; i && i  < maxHold; ++i) {
            if (collection === this.hold(i)) {
                return true;
            }
        }
        return false;
    }

    public is_score(collection: CardCollection): boolean {
        const minScore = this.score_index(0);
        const maxScore = this.score_index(4);
        if (!minScore || !maxScore) {
            throw Error("invalid score");
        }
        for (let i = minScore; i && i  < maxScore; ++i) {
            if (collection === this.score(i)) {
                return true;
            }
        }
        return false;
    }

    private deck_index(): number {
        return SolitairePiles.Deck;
    }

    private turned_index(): number {
        return SolitairePiles.Turned;
    }

    private hold_index(index: number): number | null {
        if (index >= 7) {
            return null;
        }
        return SolitairePiles.Hold0 + index;
    }

    private score_index(index: number): number | null {
        if (index >= 4) {
            return null;
        }
        return SolitairePiles.Score0 + index;
    }
}
