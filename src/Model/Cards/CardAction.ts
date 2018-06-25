import {Card} from './Card'
import CardCollection from './CardCollection'
import ICardCommand from './ICardCommand'

export default class CardAction {
    public card: Card | undefined;
    public collection1: CardCollection | undefined;
    public collection2: CardCollection | undefined;
    public command: ICardCommand;

    constructor(command: ICardCommand, card: Card | undefined = undefined, collection1: CardCollection | undefined = undefined, collection2: CardCollection | undefined = undefined) {
        this.command = command;
        this.card = card;
        this.collection1 = collection1;
        this.collection2 = collection2;
    }
}