import CardCollection from './CardCollection'

export default class CardTable {

    private readonly collections: CardCollection[];

    constructor (numCollections : number) {
        this.collections = [];
        for (let i = 0; i < numCollections; ++i) {
            this.collections.push(new CardCollection());
        }
    }

    public collection(index: number): CardCollection {
        return this.collections[index];
    }

    public max(): number {
        return this.collections.length;
    }
   
}