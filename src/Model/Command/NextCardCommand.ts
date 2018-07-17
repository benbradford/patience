import CardCommand from '../Cards/CardCommand'
import SolitaireCollections from '../SolitaireCollections'
import CardCollection from '../Cards/CardCollection'
import IEmptyActionParameters from './IEmptyActionParameters'
import {ICardActionResult} from '../Cards/ICardActionResult'
import {Card} from '../Cards/Card'

export default class NextCardCommand extends CardCommand<IEmptyActionParameters> {

    private collections: SolitaireCollections;

    constructor(collections: SolitaireCollections) {
        super();
        this.collections = collections;
    }

    public on_can_execute(action: IEmptyActionParameters): boolean {
        return !(this.collections.deck().is_empty() && this.collections.turned().is_empty());
    }
    public on_execute(action: IEmptyActionParameters): ICardActionResult | null  {
        const pile1 = this.collections.deck();
        const pile2 = this.collections.turned();
        return this.exchange(pile1, pile2);
    }
    public on_undo(action: IEmptyActionParameters): ICardActionResult | null  {
        const pile1 = this.collections.turned();
        const pile2 = this.collections.deck();
        return this.exchange(pile1, pile2);
    }

    private exchange(pile1 : CardCollection, pile2 : CardCollection): ICardActionResult | null  {
        let turnedCard: Card | null = null;
        let f = pile1;
        let t = pile2;
        if (pile1.is_empty() === false) {
            const card = pile1.remove();
            if (!card) { 
                return null;
            }
            card.turn();
            pile2.push(card);
            turnedCard = card;
        } else {
            if (pile2.is_empty()) {
                return null;
            }
            f = pile2;
            t = pile1;
            while (pile2.is_empty() === false) {
                const card = pile2.remove();
                if (!card) {
                    return null;
                }
                card.turn();
                pile1.push(card);

                turnedCard = card;
            }
        }
        if (turnedCard === null) {
            return null;
        }
        return {move: {card: turnedCard, from: f, to: t}, flip: [turnedCard]};
    }
}