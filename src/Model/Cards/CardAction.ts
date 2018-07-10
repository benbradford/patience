
import ICardCommand from './ICardCommand'
import ICardActionParameters from './ICardActionParameters';

export default class CardAction {
    public readonly command: ICardCommand;
    public readonly params: ICardActionParameters;

    constructor(command: ICardCommand, params: ICardActionParameters) {
        this.command = command;
        this.params = params;
    }
}