import ICardActionParameters from './ICardActionParameters'

export default interface ICardCommand {

    can_execute(action: ICardActionParameters): boolean;
    execute(action: ICardActionParameters): boolean;
    undo(action: ICardActionParameters): boolean;
}