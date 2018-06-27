/* import {ICardViewData} from './ViewData'
import ICardOwner from '../Model/Cards/ICardOwner'

export default class ModelViewDataSync {

    private cardModel : ICardOwner;
    private oldData : ICardViewData[];

    constructor (cardModel : ICardOwner) {
        this.cardModel = cardModel;
        
        const cards : ICardViewData[] = [];

        for (let i = 0; i < cardModel.cards.length; ++i) {
            cards.push({
                suit : cardModel.cards[i].suit,
                face : cardModel.cards[i].face,
                turned: cardModel.cards[i].is_turned_up(),
                collection: "deck"
            });
        }
        this.oldData = cards;
    }

}*/