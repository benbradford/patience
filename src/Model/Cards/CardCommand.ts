import ICardCommand from './ICardCommand'
import ICardActionParameters from './ICardActionParameters'

export default abstract class CardCommand<CardActionType extends ICardActionParameters> implements ICardCommand{

    public can_execute(action: ICardActionParameters): boolean {
        const concrete = action as CardActionType;
        if (concrete === null) {
            return false;
        }
        return this.on_can_execute(concrete);
    }

    public execute(action: ICardActionParameters): boolean {
        const concrete = action as CardActionType;
        if (concrete === null) {
            return false;
        }
        return this.on_execute(concrete);
    }
    
    public undo(action: ICardActionParameters): boolean {
        const concrete = action as CardActionType;
        if (concrete === null) {
            return false;
        }
        return this.on_undo(concrete);
    }

    protected abstract on_can_execute(action: CardActionType): boolean;
    protected abstract on_execute(action: CardActionType): boolean;
    protected abstract on_undo(action: CardActionType): boolean;
}