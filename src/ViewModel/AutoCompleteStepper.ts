/*import SolitaireCollections from '../Model/SolitaireCollections'
import MoveCardCommand from '../Model/Command/MoveCardCommand'
import {Suit, Face, Card} from '../Model/Cards/Card'
import MoveManyCardsCommand from '../Model/Command/MoveManyCardsCommand';
import CardCollection from '../Model/Cards/CardCollection';
import NextCardCommand from '../Model/Command/NextCardCommand';

export enum NextAutoStepCommand {
    move,
    moveMany,
    next
}

export interface IAutoCompleteParams{
    card: Card;
    from: CardCollection;
    to: CardCollection;
}

export interface IAutoCompleteStepData {
    actionParams: IAutoCompleteParams | null;
    commandType: NextAutoStepCommand;
}

export default class AutoCompleteStepper {

    private collections: SolitaireCollections;
    private mover: MoveCardCommand;
    private multiMover: MoveManyCardsCommand;
    private next: NextCardCommand;

    constructor(collections: SolitaireCollections) {
        this.collections = collections;
        this.mover = new MoveCardCommand(this.collections);
        this.multiMover = new MoveManyCardsCommand(this.collections);
    }
    
    public can_autocomplete(): boolean {
        if (this.are_all_score_piles_laid() === false || 
            this.are_all_cards_turned() === false || 
            this.are_all_score_piles_filled() === true) {
            return false;
        }
        return true;
    }

    public step(): IAutoCompleteStepData | null {
        const result = this.try_placing_on_score_from_hold() ||
            this.try_placing_on_score_from_turned() ||
            this.try_freeing_up_card_for_score_pile();      
        if (result) {
            return result;
        }
        if (this.next.can_execute({})) {
            return {actionParams: null, commandType: NextAutoStepCommand.next};
        }
        return null;
    }

    private are_all_score_piles_laid() {
        for (let s = 0; s < 4; ++s) {
            const score = this.collections.score(s);
            if (score.is_empty()) {
                return false;
            }
        }
        return true;
    }

    private are_all_score_piles_filled() {
        for (let s = 0; s < 4; ++s) {
            const score = this.collections.score(s);
            if (score.size() < 13) {
                return false;
            }
        }
        return true;
    }

    private are_all_cards_turned() {
        for (let h = 0; h < 7; ++h) {
            const hold = this.collections.hold(h);
            for (let i = 0; i < hold.size(); ++i) {
                const card = hold.peek(i);
                if (card && card.is_turned_up() === false) {
                    return false;
                }
            }
        }
        return true;
    }

    private try_freeing_up_card_for_score_pile(): IAutoCompleteStepData | null  {
        for (let i = 0; i < 4; ++i) {
            const scorePile = this.collections.score(i);
            const scoreCard = scorePile.peek();
            if (scoreCard === null || scorePile.is_empty() || scorePile.size() === 13) {
                continue;
            }
            
            const requiredSuit = scoreCard.suit;
            const requiredFace = scoreCard.face+1;
            const data = this.find_and_free_up_required_card(requiredSuit, requiredFace);
            if (data) {
                return data;
            }
        }
        return null;
    }

    private try_placing_on_score_from_hold(): IAutoCompleteStepData | null {
        for (let i = 0; i < 4; ++i) {
            const holdPileIndex = this.index_of_hold_if_can_place_to_score(i);
            
            if (holdPileIndex) {
                const p = this.collections.hold(holdPileIndex);
                const c = p.peek();
                if (c) {
                    const params = {card: c, from: p, to: this.collections.score(i)};
                    if (this.mover.can_execute(params)) {
                        return {actionParams: {card: params.card, from: params.from, to: params.to}, commandType: NextAutoStepCommand.move };
                    }  
                }    
            }
        }
        return null;
    }

    private try_placing_on_score_from_turned(): IAutoCompleteStepData | null {
        const turned = this.collections.turned();
        const turnedCard = turned.peek();
        if (turnedCard) {
            for (let s = 0; s < 4; ++s) {
                const score = this.collections.score(s);
                const testCard = score.peek();
                if (testCard && testCard.suit === turnedCard.suit && testCard.face === turnedCard.face+1) {
                    return {actionParams: {card: testCard, from: this.collections.turned(), to: this.collections.score(s)}, commandType: NextAutoStepCommand.move};
                }
            }
        }    
        return null;
    }

    private find_and_free_up_required_card(suit: Suit, face: Face): IAutoCompleteStepData | null {
        for (let i = 0; i < 7; ++i) {
            const holdPile = this.collections.hold(i);
            for (let indexOfFound = 0; indexOfFound < holdPile.size(); ++indexOfFound) {
                const card = holdPile.peek(indexOfFound);
                if (card && card.suit === suit && card.face === face) {
                    const cardToMove = holdPile.peek(indexOfFound+1);
                    if (cardToMove) {
                        const data = this.try_and_move_card_to_another_hold_pile(cardToMove, holdPile);
                        if (data) {
                            return data;
                        }
                    }
                } 
            }
        }
        return null;
    }

    private try_and_move_card_to_another_hold_pile(c: Card, fromPile: CardCollection): IAutoCompleteStepData | null {
        for (let i = 0; i < 7; ++i) {
            const toPile = this.collections.hold(i);
            const params = {card: c, from: fromPile, to: toPile};
            if (this.multiMover.can_execute(params)) {
                return {actionParams: params, commandType: NextAutoStepCommand.moveMany};         
            }
        }
        return null;
    }

    private index_of_hold_if_can_place_to_score(scoreIndex: number): number | null {
        const scorePile = this.collections.score(scoreIndex);
        const card = scorePile.peek();
        if (card === null) {
            return null;
        }
        for (let i = 0; i < 7; ++i) {
            const testCard = this.collections.hold(i).peek();
            if (testCard && testCard.suit === card.suit && testCard.face === card.face+1) {
                return i;
            }
        }
        return null;
    }

}*/