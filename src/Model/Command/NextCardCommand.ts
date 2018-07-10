import CardCommand from '../Cards/CardCommand'
import SolitaireCollections from '../SolitaireCollections'
import CardCollection from '../Cards/CardCollection'
import IEmptyActionParameters from './IEmptyActionParameters'

export default class NextCardCommand extends CardCommand<IEmptyActionParameters> {

    private collections: SolitaireCollections;

    constructor(collections: SolitaireCollections) {
        super();
        this.collections = collections;
    }

    public on_can_execute(action: IEmptyActionParameters): boolean {
        return !(this.collections.deck().is_empty() && this.collections.turned().is_empty());
    }
    public on_execute(action: IEmptyActionParameters): boolean {
        const pile1 = this.collections.deck();
        const pile2 = this.collections.turned();
        return this.exchange(pile1, pile2);
    }
    public on_undo(action: IEmptyActionParameters): boolean {
        const pile1 = this.collections.turned();
        const pile2 = this.collections.deck();
        return this.exchange(pile1, pile2);
    }

    private exchange(pile1 : CardCollection, pile2 : CardCollection): boolean {
        if (pile1.is_empty() === false) {
            const card = pile1.remove();
            if (!card) { 
                return false;
            }
            card.turn();
            pile2.push(card);
        } else {
            if (pile2.is_empty()) {
                return false;
            }
            while (pile2.is_empty() === false) {
                const card = pile2.remove();
                if (!card) {
                    return false;
                }
                card.turn();
                pile1.push(card);
            }
        }
        return true;
    }
}