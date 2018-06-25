import CardCollection from './CardCollection'

export default class CardTable {

    private readonly collections: CardCollection[];

    constructor (numCollections : number) {
        this.collections = [];
        for (let i = 0; i < numCollections; ++i) {
            this.collections.push(new CardCollection());
        }
    }

    public collection(index: number): CardCollection | null {
        if (this.has_collection(index) === false) {
            return null;
        }
        return this.collections[index];
    }

    public has_collection(index : number): boolean {
        return index < this.collections.length;
    }
   
}