import CardAction from './CardAction'

export default class CardActionExecutor {

    private executed: CardAction[] = [];
    private undone: CardAction[] = [];

    public attempt(action: CardAction) : boolean {
        if (action.command.can_execute(action) === false) {
            return false;
        }
        
        const result = action.command.execute(action);
        
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

    public undo(): boolean {
        if (this.can_undo() === false) {
            return false;
        }
        const action = this.executed.pop();
        if (!action) {
            return false;
        }
        this.undone.push(action);
        return action.command.undo(action);
    }

    public redo(): boolean {
        if (this.can_redo() === false) {
            return false;
        }
        const action = this.undone[this.undone.length-1];
        if (!action) {
            return false;
        }
        if (action.command.can_execute(action) === false) {
            return false;
        }
        const result = action.command.execute(action);
        if (result === false) {
            return false;
        }
        this.undone.pop();     
        this.executed.push(action);
        return true;
    }

    private clear_undone() {
        while (this.undone.length > 0) {
            this.undone.pop();
        }
    }
}