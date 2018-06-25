import CardCollection from './CardCollection'

export default class CardTable <Max extends  number>{

    private readonly collections: CardCollection[];

    constructor (numCollections : Max) {
        this.collections = [];
        for (let i = 0; i < numCollections; ++i) {
            this.collections.push(new CardCollection());
        }
    }

    public collection(index: Max): CardCollection {
        return this.collections[index];
    }


   
}