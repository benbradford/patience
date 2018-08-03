import {IFloatingCard, ICardView} from './ViewModelData'
import ViewModelDataSync from './ViewModelDataSync'
import BoxFinder from './BoxFinder';

interface IOffsets {
    x: number;
    y: number;
}

export default class MultipleCardsSyncHelper {
    
    private offsets: Readonly<IOffsets[]> = [{x:0, y:0}];
    private cards: IFloatingCard[] = [];

    constructor(originalCard: ICardView, boxFinder: BoxFinder, viewModel: ViewModelDataSync) {
        const pile = viewModel.view_pile(originalCard.pileIndex);
        let foundCard = false;
        for (const c of pile.cards) {
            if (foundCard || (c.face === originalCard.face && c.suit === originalCard.suit)) {
                const b = boxFinder.boxForCard(c);
                this.cards.push({card: c, box: b});
                foundCard = true;
            }
        }
        this.create_offsets();
    }

    public floating_cards() {
        return this.cards;
    }

    public update_positions() {
        for (let i = 1; i < this.cards.length; ++i) {
            this.cards[i].box.set_position(this.cards[0].box.left() + this.offsets[i].x, this.cards[0].box.top() + this.offsets[i].y);
        }
    }

    private create_offsets() {
        for (let i = 1; i < this.cards.length; ++i) {
            this.offsets.push({x: this.cards[i].box.left() - this.cards[0].box.left(), y: this.cards[i].box.top() - this.cards[0].box.top()});
        }
    }
}