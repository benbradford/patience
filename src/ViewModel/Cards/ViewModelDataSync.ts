import {IViewModelData, ICardView, IFloatingCard, ICardCollectionViewData, IAnimationRequest} from './ViewModelData'
import CardCollection from '../../Model/Cards/CardCollection';
import CardTable from '../../Model/Cards/CardTable';
import {Card, Suit, Face} from '../../Model/Cards/Card'
import CardBox from './CardBox'
import IViewModelDataHolder from './IViewModelDataHolder'
import IFloatingCardHolder from './IFloatingCardHolder'
import BoxFinder from './BoxFinder'

export default class ViewModelDataSync implements IViewModelDataHolder, IFloatingCardHolder {
    private viewModelData: IViewModelData;
    private lastViewModelData: IViewModelData;
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
        this.lastViewModelData = this.viewModelData;
        this.viewModelData = {
            piles: this.make_view_piles(),
            floating: this.floating,
            animationRequests: []
        };
    }

    public sync_view_with_animation_requests(boxFinder: BoxFinder, floating: IFloatingCard[]) {
       
        // look for differences and then create animation requests from it
        const requests: IAnimationRequest[] = [];
        for (let pileIndex = 0; pileIndex < this.lastViewModelData.piles.length; ++pileIndex) {
            const numInLast = this.lastViewModelData.piles[pileIndex].cards.length;
            const numInCurr = this.viewModelData.piles[pileIndex].cards.length;
            if (numInCurr > numInLast) {
                // need to remove all cards in curr that were not in last - and make anims out of them
                for (let cardIndex = numInLast; cardIndex < numInCurr; ++cardIndex) {

                    // find where it came from - was it in floating or in another pile?
                    // checking floating piles first - if not there, then use static_box_finder to get its original position
                    // use static_box_finder to get its destination
                    
                    const c = this.viewModelData.piles[pileIndex].cards[cardIndex];
                    const f = this.box_for_from_card(floating, boxFinder, c);
                    const t = boxFinder.staticBox(pileIndex, cardIndex);
                    requests.push( {card: c, from: f, to: t} );
                }

                // finally: trim off the extra cards
                this.viewModelData.piles[pileIndex].cards = this.lastViewModelData.piles[pileIndex].cards;
            }
        }
        this.viewModelData.animationRequests = requests;
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
    }

    public floating_cards() {
        return this.floating;
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

    private box_for_from_card(floating: IFloatingCard[], boxFinder: BoxFinder, card: ICardView): CardBox {
        for (const f of floating) {
            if (f.card.face === card.face && f.card.suit === card.suit) {
                return f.box;
            }
        }

        for (let pileIndex = 0; pileIndex < this.lastViewModelData.piles.length; ++pileIndex) {
            const numInLast = this.lastViewModelData.piles[pileIndex].cards.length;
            for (let cardIndex = 0; cardIndex < numInLast; ++cardIndex) {
                const candidate = this.lastViewModelData.piles[pileIndex].cards[cardIndex];
                if (candidate.face === card.face && candidate.suit === card.suit) {
                    return boxFinder.staticBox(pileIndex, cardIndex);
                }
            }

        }
        throw new Error("cannot find card in last");
    }
}