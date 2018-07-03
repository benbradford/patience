import {Suit, Face} from '../Model/Cards/Card'
import {HoldIndex, ScoreIndex} from '../Model/SolitaireCollections'

export type PileName = "deck" | "turned" | "hold0" | "hold1" | "hold2" | "hold3" | "hold4" | "hold5" | "hold6" | "score0" | "score1" | "score2" | "score3";

export interface ICard {
    suit: Suit;
    face: Face;
    turned: boolean;
    pileName: PileName;
}

export interface ICardPile {
    cards : ICard[];
}

export interface ITableData {
    deck: ICardPile;
    turned: ICardPile;
    score: ICardPile[];
    hold: ICardPile[]; 
}

export function hold_name(index: HoldIndex): PileName {
    switch(index) {
        case 0: return "hold0";
        case 1: return "hold1";
        case 2: return "hold2";
        case 3: return "hold3";
        case 4: return "hold4";
        case 5: return "hold5";
        case 6: return "hold6";
    }
    throw Error("invalid hold index");
}

export function score_name(index: ScoreIndex): PileName {
    switch(index) {
        case 0: return "score0";
        case 1: return "score1";
        case 2: return "score2";
        case 3: return "score3";
    }
    throw Error("invalid score index");
}

export function hold_index_from_pilename(name: PileName): HoldIndex | null {
    switch (name) {
        case "hold0": return 0; 
        case "hold1": return 1; 
        case "hold2": return 2;
        case "hold3": return 3;
        case "hold4": return 4;
        case "hold5": return 5;
        case "hold6": return 6;
    }
    return null;
}

function view_pile_from_view_card(card: ICard, tableData: ITableData): ICardPile {
    switch (card.pileName) {
        case "deck": return tableData.deck;
        case "turned": return tableData.turned;
        case "hold0": return tableData.hold[0];
        case "hold1": return tableData.hold[1];
        case "hold2": return tableData.hold[2];
        case "hold3": return tableData.hold[3];
        case "hold4": return tableData.hold[4];
        case "hold5": return tableData.hold[5];
        case "hold6": return tableData.hold[6];
        case "score0": return tableData.score[0];
        case "score1": return tableData.score[1];
        case "score2": return tableData.score[2];
        case "score3": return tableData.score[3];
    }
    throw Error("now view pile for view card");
}

export function collect_all_cards_above(card: ICard, tableData: ITableData): ICard[] {

    const pile = view_pile_from_view_card(card, tableData);
    
    let fromIndex: number | undefined;
    for (let i = 0; i < pile.cards.length; ++i) {
        if (pile.cards[i] === card) {
            fromIndex = i;
            break;
        }
    }

    if (fromIndex === undefined) {
        throw Error("undefined fromIndex");
    }

    return pile.cards.slice(fromIndex, pile.cards.length);
}