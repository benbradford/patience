import ICardCommand from './ICardCommand'
import ICardActionParameters from './ICardActionParameters'
import { ICardActionResult } from './ICardActionResult';

export default abstract class CardCommand<CardActionType extends ICardActionParameters> implements ICardCommand{

    public can_execute(action: ICardActionParameters): boolean {
        const concrete = action as CardActionType;
        if (concrete === null) {
            throw Error("incorrect params from this command");
        }
        return this.on_can_execute(concrete);
    }

    public execute(action: ICardActionParameters): ICardActionResult | null {
        const concrete = action as CardActionType;
        if (concrete === null) {
            throw Error("incorrect params from this command");
        }
        return this.on_execute(concrete);
    }
    
    public undo(action: ICardActionParameters): ICardActionResult | null {
        const concrete = action as CardActionType;
        if (concrete === null) {
            throw Error("incorrect params from this command");
        }
        return this.on_undo(concrete);
    }

    protected abstract on_can_execute(action: CardActionType): boolean;
    protected abstract on_execute(action: CardActionType): ICardActionResult | null;
    protected abstract on_undo(action: CardActionType): ICardActionResult | null;
}