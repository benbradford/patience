import ICardCommand from '../Cards/ICardCommand'
import CardAction from '../Cards/CardAction'
import SolitaireCollections from '../SolitaireCollections'
import {Card} from '../Cards/Card'
import {CardCollection} from '../Cards/CardCollection'

export default class NextCardCommand implements ICardCommand {

    private collections: SolitaireCollections;

    constructor(collections: SolitaireCollections) {
        this.collections = collections;
    }

    public can_execute(action: CardAction): boolean {
        if (this.collections.deck().is_empty() && this.collections.turned().is_empty()) {
            return false;
        }
        return true;
    }
    public execute(action: CardAction): boolean {
        const pile1 = this.collections.deck();
        const pile2 = this.collections.turned();
        return NextCardCommand.exchange(pile1, pile2);
    }
    public undo(action: CardAction): boolean {
        const pile1 = this.collections.turned();
        const pile2 = this.collections.deck();
        return NextCardCommand.exchange(pile1, pile2);
    }

    private static exchange(pile1 : CardCollection, pile2 : CardCollection): boolean {
        if (pile1.is_empty() == false) {
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