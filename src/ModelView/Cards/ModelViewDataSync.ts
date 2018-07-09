import {IModelViewData, IPileView, ICardView} from './ModelViewData'
import CardCollection from '../../Model/Cards/CardCollection';
import CardTable from '../../Model/Cards/CardTable';
import {Card} from '../../Model/Cards/Card'

export default class ModelViewDataSync {
    private modelViewData: IModelViewData;
    private collections: CardTable;

    constructor(collections: CardTable) {
        this.collections = collections;
        this.sync_view_with_model();
    }

    public sync_view_with_model() {
        this.modelViewData = {
            piles: this.make_view_piles()
        };
    }

    public model_view_data(): IModelViewData {
        return this.modelViewData;
    }

    public model_pile(viewPileIndex: number): CardCollection {
        return this.collections.collection(viewPileIndex);
    }

    public view_pile(viewPileIndex: number): IPileView {
        return this.modelViewData.piles[viewPileIndex];
    }

    // :TODO: this function is in the wrong place - where should it go?
    public collect_all_cards_above(card: ICardView): ICardView[] {
        let fromIndex: number | undefined;
        const pile = this.view_pile(card.pileIndex);
        for (let i = 0; i < pile.cards.length; ++i) {
            if (pile.cards[i].suit === card.suit && pile.cards[i].face === card.face) {
                fromIndex = i;
                break;
            }
        }
    
        if (fromIndex === undefined) {
            throw Error("cannot get from index")
        }
    
        return pile.cards.slice(fromIndex, pile.cards.length);
    }

    public model_card(viewCard: ICardView): Card {
        const collection = this.collections.collection(viewCard.pileIndex);
        const card = collection.find(viewCard.suit, viewCard.face);
        if (card) {
            return card;
        }
        throw Error("cannot get model card from view card");
    }

    private make_view_piles(): IPileView[] {
        const piles: IPileView[] = [];
        for (let i = 0; i < this.collections.max(); ++i) {
            piles.push({cards: this.make_view_cards(i)});
        }
        return piles;
    }

    private make_view_cards(pile: number): ICardView[] {
        const cards: ICardView[] = [];
        const modelCardCollection: CardCollection = this.collections.collection(pile);
        for (let i = modelCardCollection.size()-1; i >= 0; --i) {
            const modelCard = modelCardCollection.peek(i);
            if (modelCard) {
                cards.push({
                    suit: modelCard.suit,
                    face: modelCard.face,
                    turned: modelCard.is_turned_up(),
                    pileIndex: pile
                });
            }
        }
        return cards;
    }
}