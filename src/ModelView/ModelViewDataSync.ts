import {IModelViewData, IPileView, ICardView, PileName, score_name, hold_name} from './ModelViewData'
import SolitaireCollections from '../Model/SolitaireCollections'
import {ScoreIndex} from '../Model/SolitaireCollections'
import CardCollection from '../Model/Cards/CardCollection';
import {all_hold_indices} from './ModelViewConversion'

export default class ModelViewDataSync {

    private modelViewData: IModelViewData;
    private collections : SolitaireCollections;

    constructor(collections: SolitaireCollections) {
        this.collections = collections;
    }

    public sync_view_with_model() {
        this.modelViewData = {
            deck: this.make_view_pile_from_model_pile(this.collections.deck(), "deck"),
            turned: this.make_view_pile_from_model_pile(this.collections.turned(), "turned"),
            score: this.make_score_view_piles_from_model_piles(),
            hold: this.make_hold_view_piles_from_model_piles()
        };
    }

    public model_view_data(): IModelViewData {
        return this.modelViewData;
    }

    private make_score_view_piles_from_model_piles(): IPileView[] {
        const viewPiles: IPileView[] = [];
        const valid : ScoreIndex[] = [0, 1, 2, 3];
        for (const i of valid) {
            viewPiles.push(this.make_view_pile_from_model_pile(this.collections.score(i), score_name(i)));
        }
        return viewPiles;
    }

    private make_hold_view_piles_from_model_piles(): IPileView[] {
        const viewPiles: IPileView[] = [];
        for (const i of all_hold_indices()) {
            viewPiles.push(this.make_view_pile_from_model_pile(this.collections.hold(i), hold_name(i)));
        }
        if (viewPiles.length !==7) {
            throw Error("incorrect number of piles");
        }
        return viewPiles;
    }

    private make_view_pile_from_model_pile(collection: CardCollection, nameOfPile: PileName): IPileView {  
        const viewCards : ICardView[] = [];

        for (let i = collection.size()-1; i >= 0; --i) {
            const modelCard = collection.peek(i);

            if (modelCard === null) {
                continue;
            }
            viewCards.push({
                suit: modelCard.suit,
                face: modelCard.face,
                turned: modelCard.is_turned_up(),
                pileName: nameOfPile
            });
        }
        return {cards : viewCards};
    }

    
}