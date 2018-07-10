import ICardCommand from '../ICardCommand'
import ICardActionParameters from '../ICardActionParameters'

export default class FakeCardCommand implements ICardCommand {

    public shouldExecute = true;
    public shouldUndo = true;

    private v : number = 0;
    public can_execute(action: ICardActionParameters): boolean {
        
        return this.shouldExecute;
    }
    public execute(action: ICardActionParameters): boolean {
        if (this.shouldExecute === false) {
            return false;
        }
        ++this.v;
        return true;
    }
    public undo(action: ICardActionParameters): boolean {
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