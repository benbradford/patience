
import CardAction from './Cards/CardAction'
import SolitaireCollections from './SolitaireCollections';
import ICardCommand from './Cards/ICardCommand';
import {Card} from './Cards/Card'
import CardCollection from './Cards/CardCollection'
import IMoveCardActionParameters from './Command/IMoveCardActionParameters'

interface INode {

    action: CardAction;
    numInDeckIfTurningFirst: number | null;
    isMove: boolean;
}

export default class SolitaireSolver {

    private nodes: INode[][] = [];
    private collection: SolitaireCollections;
    private winningSequence: INode[] = [];
    private moveCommand: ICardCommand;
    private moveManyCommand: ICardCommand;
    private nextCommand: ICardCommand;

    constructor(collection: SolitaireCollections, moveCommand: ICardCommand, moveManyCommand: ICardCommand, nextCommand: ICardCommand) {
        this.collection = collection;
        this.moveCommand = moveCommand;
        this.moveManyCommand = moveManyCommand;
        this.nextCommand = nextCommand;
    }

    public winning_sequence() {
        return this.winningSequence;
    }

    public solve(): boolean {
        if (this.gather_actions() === false) {
            return false;
        }
        
        while (this.nodes[this.nodes.length-1].length > 0) {
            const node = this.nodes[this.nodes.length-1].pop();
            if (node === undefined) {
                return false;
            }
            this.winningSequence.push(node);
            if (this.perform_action(node)) {
                return true;
            }
            this.winningSequence.pop();
        }

        return false;
    }

    private perform_action(node: INode) {
        let success = false;
        node.action.command.execute(node.action.params);
        if (this.collection.is_winning_state()) {
            success = true;
        } else {
            success = this.solve();
        }
        node.action.command.undo(node.action.params);
        return success;
    }

    private gather_actions(): boolean {
        this.nodes.push([]);
        this.try_move_from_hold_to_score_piles();
        this.try_move_from_turned_to_score_pile();
        this.try_move_from_hold_to_hold_pile();
        this.try_move_from_turned_to_hold_pile();
        this.try_next_card();
        return this.nodes[this.nodes.length-1].length > 0;
    }

    private try_move_from_hold_to_score_piles() {
        for (let h = 0; h < 7; ++h) {
            const hold = this.collection.hold(h);
            for (let c = 0; c < hold.size(); ++c) {
                const card = hold.peek(c);
                if (card) {
                    this.try_move_from_particular_hold_to_score_piles(hold, card, hold.peek(c) === hold.peek());
                }
            }
        }
    }

    private try_move_from_turned_to_score_pile() {
        const c = this.collection.turned().peek();
        if (c === null) {
            return;
        }
        for (let s = 0; s < 4; ++s) {
            this.add_action_if_can_execute(new CardAction(this.moveCommand, {card:c, from: this.collection.turned(), to: this.collection.score(s), turnNextInFrom: false} ));
        }
    }

    private try_move_from_hold_to_hold_pile() {
        for (let h = 0; h < 7; ++h) {
            const hold = this.collection.hold(h);
            for (let c = 0; c < hold.size(); ++c) {
                const card = hold.peek(c);
                if (card) {
                    this.try_move_from_particular_hold_to_other_hold_piles(h, card, hold.peek(c) === hold.peek());
                }
            }
        }
    }

    private try_move_from_turned_to_hold_pile() {
        const c = this.collection.turned().peek();
        if (c === null) {
            return;
        }
        for (let h = 0; h < 7; ++h) {
            const dest = this.collection.hold(h);
            this.add_action_if_can_execute(new CardAction(this.moveCommand, {card:c, from: this.collection.turned(), to: dest, turnNextInFrom: false} ));        
        }
    }

    private try_next_card() {
        if (this.nextCommand.can_execute({})) {
            if (this.is_duplicate_turn_action() === false) {
                let numInDeck: number | null = null;
                if (this.collection.turned().size() === 0 && this.collection.deck().size() > 0) {
                    numInDeck = this.collection.deck().size();
                }
                this.nodes[this.nodes.length-1].push({action: new CardAction(this.nextCommand, {}), numInDeckIfTurningFirst: numInDeck, isMove: false} );
            }
        }
    }

    private move_command(isMoveMany: boolean): ICardCommand {
        if (isMoveMany) {
            return this.moveManyCommand;
        }
        return this.moveCommand;
    }

    private try_move_from_particular_hold_to_score_piles(fromHold: CardCollection, c: Card, isMoveMany: boolean) {
        const command = this.move_command(isMoveMany);
        for (let s = 0; s < 4; ++s) {
            this.add_action_if_can_execute(new CardAction(command, {card:c, from: fromHold, to: this.collection.score(s), turnNextInFrom: false} ));
        }
    }

    private try_move_from_particular_hold_to_other_hold_piles(fromHoldIndex: number, c: Card, isMoveMany: boolean) {
        const command = this.move_command(isMoveMany);
        const fromHold = this.collection.hold(fromHoldIndex);
        for (let h = 0; h < 7; ++h) {
            if (h === fromHoldIndex) {
                continue;
            }
            const dest = this.collection.hold(h);
            this.add_action_if_can_execute(new CardAction(command, {card:c, from: fromHold, to: dest, turnNextInFrom: false} ));        
        }
    }

    private add_action_if_can_execute(a: CardAction) {
        if (this.is_duplicate_move_action(a)) {
            return;
        }
        if (a.command.can_execute(a.params)) {
            
            this.nodes[this.nodes.length-1].push({action: a, numInDeckIfTurningFirst: null, isMove:true} );
        }
    }

    private is_duplicate_move_action(action: CardAction) {
        const compareParams = action.params as IMoveCardActionParameters;
        if (compareParams === null) {
            return false;
        }
        for (const old of this.winningSequence) {
            if (typeof(action) === typeof(old.action)) {
                const params = old.action.params as IMoveCardActionParameters;
                
                if (params && old.isMove) {
                    if (params.card.suit === compareParams.card.suit &&
                        params.card.face === compareParams.card.face &&
                        params.from === compareParams.from &&
                        params.to === compareParams.to) {
                            return true;
                        }
                }
            }
        }
        return false;
    }

    private is_duplicate_turn_action() {
        const currentDeckSize = this.collection.deck().size();
        if (this.collection.turned().size() === 0 && currentDeckSize > 0) {
            for (const old of this.winningSequence) {
                if (old.isMove === false && old.numInDeckIfTurningFirst && old.numInDeckIfTurningFirst === currentDeckSize) {
                    return true;
                }
            }
        }
        return false;
    }
}