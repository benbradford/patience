import SolitaireCollections from "../Model/SolitaireCollections";
import {PileName, ICardView} from './ViewData'
import CardCollection from '../Model/Cards/CardCollection';
import {Card} from '../Model/Cards/Card'
import {ScoreIndex, HoldIndex} from '../Model/SolitaireCollections'

 export function model_collection_from_pile_name(name: PileName, collections : SolitaireCollections): CardCollection {
    if (name === "deck") {
        return collections.deck();
    }
    if (name === "turned") {
        return collections.turned();
    }
    if (name === "hold0") {
        return collections.hold(0);
    }
    if (name === "hold1") {
        return collections.hold(1);
    }
    if (name === "hold2") {
        return collections.hold(2);
    }
    if (name === "hold3") {
        return collections.hold(3);
    }
    if (name === "hold4") {
        return collections.hold(4);
    }
    if (name === "hold5") {
        return collections.hold(5);
    }
    if (name === "hold6") {
        return collections.hold(6);
    }
    if (name === "score0") {
        return collections.score(0);
    }
    if (name === "score1") {
        return collections.score(0);
    }
    if (name === "score2") {
        return collections.score(0);
    }
    if (name === "score3") {
        return collections.score(0);
    }
    throw Error("invalid pile name");
}

export function model_card_from_view_card(viewCard: ICardView, collections : SolitaireCollections) : Card {
    let found = collections.deck().find(viewCard.suit, viewCard.face);
    if (found !== null) {
        return found;
    }
    found = collections.turned().find(viewCard.suit, viewCard.face);
    if (found !== null) {
        return found;
    }
    for (const i of all_hold_indices()) {
        found = collections.hold(i).find(viewCard.suit, viewCard.face);
        if (found !== null) {
            return found;
        }
    }
    for (const i of all_score_indices()) {
        found = collections.score(i).find(viewCard.suit, viewCard.face);
        if (found !== null) {
            return found;
        }
    }
    throw Error("cannot find model card from view card");
}

export function all_hold_indices() : HoldIndex[] {
    return [0, 1, 2, 3, 4, 5, 6];
}

export function all_score_indices() : ScoreIndex[] {
    return [0, 1, 2, 3];
}

export function view_pile_from_model_pile(modelCollection: CardCollection, collections : SolitaireCollections): PileName {
    if (modelCollection=== collections.deck()) {
        return "deck";
    }
    if (modelCollection === collections.turned()) {
        return "turned";
    }
    if (modelCollection === collections.hold(0)) {
        return "hold0";
    }
    if (modelCollection === collections.hold(1)) {
        return "hold1";
    }
    if (modelCollection === collections.hold(2)) {
        return "hold2";
    }
    if (modelCollection === collections.hold(3)) {
        return "hold3";
    }
    if (modelCollection === collections.hold(4)) {
        return "hold4";
    }
    if (modelCollection === collections.hold(5)) {
        return "hold5";
    }
    if (modelCollection === collections.hold(6)) {
        return "hold6";
    }
    if (modelCollection === collections.score(0)) {
        return "score0";
    }
    if (modelCollection === collections.score(1)) {
        return "score1";
    }
    if (modelCollection === collections.score(2)) {
        return "score2";
    }
    if (modelCollection === collections.score(3)) {
        return "score3";
    }

    
    throw Error("cannot find view pile from model pile");
}