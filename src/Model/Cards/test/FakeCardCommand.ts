import ICardCommand from '../ICardCommand'
import ICardActionParameters from '../ICardActionParameters'
import {ICardActionResult} from '../ICardActionResult'
import CardCollection from '../CardCollection';
import {Card, Face, Suit} from '../Card'

export default class FakeCardCommand implements ICardCommand {

    public shouldExecute = true;
    public shouldUndo = true;

    private v : number = 0;
    public can_execute(action: ICardActionParameters): boolean {
        
        return this.shouldExecute;
    }
    public execute(action: ICardActionParameters): ICardActionResult | null {
        if (this.shouldExecute === false) {
            return null;
        }
        ++this.v;
        return {move: this.dummy_move(), flip: null};
    }
    public undo(action: ICardActionParameters): ICardActionResult | null {
        if (this.shouldUndo === false) {
            return null;
        }
        --this.v;
        return {move: this.dummy_move(), flip: null};
    }

    public value() { 
        return this.v;
    }

    private dummy_move() {
        return {card: new Card(Suit.hearts, Face.ace), from: new CardCollection(), to: new CardCollection()};
    }
}