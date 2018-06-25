import CardCollection from './Cards/CardCollection'

export default class Table {

    private deck : CardCollection;
    private turnCardCollection : CardCollection = new CardCollection();
    private scoreCardCollection : CardCollection[] = new CardCollection[4];
    private holdCardCollection : CardCollection[] = new CardCollection[7];
    
    constructor(deck : CardCollection) {
        this.deck = deck;
        for (let i = 0; i < 4; ++i) {
            this.scoreCardCollection = new CardCollection[0];
        }
        for (let i = 0; i < 7; ++i) {
            this.holdCardCollection[i] = new CardCollection();
        }
    }

    public deck_collection(): CardCollection {
        return this.deck;
    }

    public turn_collection(): CardCollection {
        return this.turnCardCollection;
    }

    public score_collection(index : number): CardCollection | null {
        if (index < 0 || index >=4) {
            return null;
        }
        return this.scoreCardCollection[index];
    }

    public hold_collection(index : number): CardCollection | null {
        if (index < 0 || index >=7) {
            return null;
        }
        return this.holdCardCollection[index];
    }
}