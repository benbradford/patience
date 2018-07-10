import ICardCommand from './ICardCommand'
import ICardActionParameters from './ICardActionParameters'

export default abstract class CardCommand<CardActionType extends ICardActionParameters> implements ICardCommand{

    public can_execute(action: ICardActionParameters): boolean {
        return this.on_can_execute(action as CardActionType);
    }

    public execute(action: ICardActionParameters): boolean {
        return this.on_execute(action as CardActionType);
    }
    
    public undo(action: ICardActionParameters): boolean {
        return this.on_undo(action as CardActionType);
    }

    protected abstract on_can_execute(action: CardActionType): boolean;
    protected abstract on_execute(action: CardActionType): boolean;
    protected abstract on_undo(action: CardActionType): boolean;
}