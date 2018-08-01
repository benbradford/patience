import {IViewModelData, ICardView, IFloatingCard, ICardCollectionViewData} from './ViewModelData'
import CardCollection from '../../Model/Cards/CardCollection';
import CardTable from '../../Model/Cards/CardTable';
import {Card, Suit, Face} from '../../Model/Cards/Card'
import CardBox from './CardBox'
import IViewModelDataHolder from './IViewModelDataHolder'
import IFloatingCardHolder from './IFloatingCardHolder'

export default class ViewModelDataSync implements IViewModelDataHolder, IFloatingCardHolder {
    private viewModelData: IViewModelData;
    private collections: CardTable;
    private floating: IFloatingCard[] = [];

    constructor(collections: CardTable) {
        this.collections = collections;
        this.sync_view_with_model();
    }

    public data(): Readonly<IViewModelData> {
        return this.viewModelData;
    }

    public sync_view_with_model() {
        this.viewModelData = {
            piles: this.make_view_piles(),
            floating: this.floating
        };
    }

    public pickupCard(c: ICardView, b: CardBox): IFloatingCard {
        this.floating = [{card: c, box: b}];
        this.sync_view_with_model();
        return this.floating[0];
    }

    public pickupCards(cards: IFloatingCard[]): void {
        this.floating = cards;
        this.sync_view_with_model();
    }

    public dropCards(): void {
        this.floating = [];
        this.sync_view_with_model();
    }

    public model_card(viewCard: ICardView): Card {
        const collection = this.collections.collection(viewCard.pileIndex);
        const card = collection.find(viewCard.suit, viewCard.face);
        if (card) {
            return card;
        }
        throw Error("cannot get model card from view card");
    }

    public view_card(card: Card, pileIndex: number): ICardView {
        
        const collection = this.viewModelData.piles[pileIndex];
        for (const c of collection.cards) {
            if (c.suit === card.suit && c.face === card.face) {
                return c;
            }
        }
        
        throw Error("cannot get view card");    
    }

    public find_view_card(suit: Suit, face: Face) {
        for (const p of this.viewModelData.piles) {
            for (const c of p.cards) {
                if (c.suit === suit && c.face === face) {
                    return c;
                }
            }
        }
        return null;
    }

    public pile_index(pile: CardCollection): number {
        for (let i = 0; i < this.collections.max(); ++i) {
            if (pile === this.collections.collection(i)) {
                return i;
            }
        }
        throw Error("cannot find pile");
    }

    public model_pile(viewPileIndex: number): CardCollection {
        return this.collections.collection(viewPileIndex);
    }

    public view_pile(viewPileIndex: number): ICardCollectionViewData {
        return this.viewModelData.piles[viewPileIndex];
    }

    public floats(suit: Suit, face: Face) {
        for (const c of this.floating) {
            if (c.card.suit === suit && c.card.face === face) {
                return true;
            }
        }
        return false;
    }

    public floating_card(suit: Suit, face: Face) {
        for (const c of this.floating) {
            if (c.card.suit === suit && c.card.face === face) {
                return c;
            }
        }
        throw new Error("no floating card");
    }

    private make_view_piles(): ICardCollectionViewData[] {
        const piles: ICardCollectionViewData[] = [];
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
                if (this.floats(modelCard.suit, modelCard.face)) {
                    break;
                }
                const viewCard = {
                    suit: modelCard.suit,
                    face: modelCard.face,
                    turned: modelCard.is_turned_up(),
                    pileIndex: pile
                };
                cards.push(viewCard);
            }
        }
        return cards;
    }
}