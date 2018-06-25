import CardAction from './CardAction'

export default interface ICardCommand {

    can_execute(action: CardAction): boolean;
    execute(action: CardAction): boolean;
    undo(action: CardAction): boolean;
}