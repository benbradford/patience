import ModelViewDataSync from "./Cards/ModelViewDataSync";
import { ICardView } from "./Cards/ModelViewData";
import {Suit, Face} from '../Model/Cards/Card'


export default class CardProxy {

    private dataSync: ModelViewDataSync;
    private suit: Suit = Suit.hearts;
    private face: Face = Face.ace;
    private hasCard: boolean = false;
   
    constructor (dataSync: ModelViewDataSync) {
        this.dataSync = dataSync;

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
}