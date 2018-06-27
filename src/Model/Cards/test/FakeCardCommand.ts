import ICardCommand from '../ICardCommand'
import CardAction from '../CardAction'

export default class FakeCardCommand implements ICardCommand {

    public shouldExecute = true;
    public shouldUndo = true;

    private v : number = 0;
    public can_execute(action: CardAction): boolean {
        
        return this.shouldExecute;
    }
    public execute(action: CardAction): boolean {
        if (this.shouldExecute === false) {
            return false;
        }
        ++this.v;
        return true;
    }
    public undo(action: CardAction): boolean {
        if (this.shouldUndo === false) {
            return false;
        }
        --this.v;
        return true;
    }

    public value() { 
        return this.v;
    }
}