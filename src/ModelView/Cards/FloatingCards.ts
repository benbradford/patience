import CardProxy from './CardProxy'
import { ICardView } from "./ModelViewData";
import ModelViewDataSync from "./ModelViewDataSync";
import {Suit, Face} from '../../Model/Cards/Card'

export default class FloatingCards {

    private cards: CardProxy[] = [];
    private dataSync: ModelViewDataSync;

    constructor(dataSync: ModelViewDataSync) {
        this.dataSync = dataSync;
    }

    public add(card: ICardView): CardProxy {
        if (this.find(card)) {
            throw Error("card already exists");
        }
        const proxy = new CardProxy(this.dataSync);
        proxy.set(card);
        return proxy;
    }

    public find(card: ICardView): CardProxy | null {
        for(const c of this.cards) {
            if (c.card_face() === card.face && c.card_suit() === card.suit) {
                return c;
            }
        }
        return null;
    }

    public remove_card_view(card: ICardView) {
        return this.remove(card.suit, card.face);
    }

    public remove_card_proxy(card: CardProxy) {
        return this.remove(card.card_suit(), card.card_face());
    }

    public remove(suit: Suit, face: Face) {
        for (let i = 0; i < this.cards.length; ++i) {
            if (this.cards[i].card_face() === face && this.cards[i].card_suit() === suit ) {
                this.cards.splice(i, 1);
                return true;
            }
        }
        return false;
    }
}