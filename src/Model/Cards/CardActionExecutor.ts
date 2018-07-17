import CardAction from './CardAction'
import {ICardActionResult} from './ICardActionResult'

export default class CardActionExecutor {

    private executed: CardAction[] = [];
    private undone: CardAction[] = [];

    public attempt(action: CardAction): ICardActionResult | null {
        if (action.command.can_execute(action.params) === false) {
            return null;
        }
        
        const result = action.command.execute(action.params);
        
        if (result) {
            this.executed.push(action);
            this.clear_undone();
        }
        return result;
    }

    public can_redo() {
        return this.undone.length > 0;
    }

    public can_undo() {
        return this.executed.length > 0;
    }

    public undo(): ICardActionResult | null {
        if (this.can_undo() === false) {
            return null;
        }
        const action = this.executed.pop();
        if (!action) {
            return null;
        }
        this.undone.push(action);
        return action.command.undo(action.params);
    }

    public redo(): ICardActionResult | null {
        if (this.can_redo() === false) {
            return null;
        }
        const action = this.undone[this.undone.length-1];
        if (!action) {
            return null;
        }
        if (action.command.can_execute(action) === false) {
            return null;
        }
        const result = action.command.execute(action.params);
        if (result === null) {
            return null;
        }
        this.undone.pop();     
        this.executed.push(action);
        return result;
    }

    private clear_undone() {
        while (this.undone.length > 0) {
            this.undone.pop();
        }
    }
}