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

export interface IMoveData {
    cards: ICard[];
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

export function score_name(index: ScoreIndex): PileName{
    switch(index) {
        case 0: return "score0";
        case 1: return "score1";
        case 2: return "score2";
        case 3: return "score3";
    }
    throw Error("invalid score index");
}