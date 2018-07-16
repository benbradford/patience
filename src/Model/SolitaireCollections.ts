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

    public table: CardTable = new CardTable(SolitairePiles.Max);

    public deck(): CardCollection {
        const collection = this.table.collection(SolitairePiles.Deck as number);
        return collection;
    }

    public turned(): CardCollection {
        const collection = this.table.collection(SolitairePiles.Turned as number);
        return collection;
    }

    public hold(index: number): CardCollection {
        const adjustedIndex = SolitairePiles.Hold0 + index; 
        const collection = this.table.collection(adjustedIndex);
        return collection;
    }

    public score(index: number): CardCollection {
        const adjustedIndex = SolitairePiles.Score0 + index;
        const collection = this.table.collection(adjustedIndex);
        return collection;
    }

    public is_hold(collection: CardCollection): boolean {
        const valid : number[] = [0, 1, 2, 3, 4, 5, 6, 7];
        for (const i of valid) {
            if (collection === this.hold(i)) {
                return true;
            }
        }
        return false;
    }

    public is_score(collection: CardCollection): boolean {
        const valid : number[] = [0, 1, 2, 3];
        for (const i of valid) {
            if (collection === this.score(i)) {
                return true;
            }
        }
        return false;
    }

    public is_winning_state() {
        return this.deck().is_empty() && this.turned().is_empty() &&
            this.hold(0).is_empty() && this.hold(1).is_empty() && this.hold(2).is_empty() &&
            this.hold(3).is_empty() && this.hold(4).is_empty() && this.hold(5).is_empty() && this.hold(6).is_empty() &&
            this.score(0).size() === 13 && this.score(1).size() === 13 && this.score(2).size() === 13 && this.score(3).size() === 13;
    }
}
