import ViewModelDataSync from "./ViewModelDataSync";
import { ICardView } from "./ViewModelData";
import {Suit, Face} from '../../Model/Cards/Card'

export default class CardProxy {

    private dataSync: ViewModelDataSync;
    private suit: Suit = Suit.hearts;
    private face: Face = Face.ace;
    private hasCard: boolean = false;
   
    constructor (dataSync: ViewModelDataSync, card: ICardView | null = null) {
        this.dataSync = dataSync;
        if (card) {
            this.set(card);
        }
    }

    public reset() {
        this.hasCard = false;
    }

    public set(card: ICardView) {
        this.suit = card.suit;
        this.face = card.face;
        this.hasCard = true;
    }

    public current(): ICardView| null {
        if (this.hasCard === false) {
            return null;
        }
        return this.dataSync.find_view_card(this.suit, this.face);
    }

    public has_card() {
        return this.hasCard;
    }

    public card_suit() {
        return this.suit;
    }

    public card_face() {
        return this.face;
    }
}