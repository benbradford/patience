import ICardActionParameters from './ICardActionParameters'
import { ICardActionResult } from './ICardActionResult';

export default interface ICardCommand {

    can_execute(action: ICardActionParameters): boolean;
    execute(action: ICardActionParameters): ICardActionResult | null;
    undo(action: ICardActionParameters): ICardActionResult | null;
}