import {IViewModelData, ICardCollectionViewData, IFloatingCard} from './Cards/ViewModelData'

export function deck_pile(data: IViewModelData): ICardCollectionViewData {
    return data.piles[0];
}

export function turned_pile(data: IViewModelData) {
    return data.piles[1];
}

export function hold_pile(data: IViewModelData, index: number) {
    return data.piles[2 + index];
}

export function score_pile(data: IViewModelData, index: number) {
    return data.piles[10 + index];
}

export function hold_piles(data: IViewModelData) {
    const piles: ICardCollectionViewData[] = [];
    for (let i = 0; i < 7; ++i) {
        piles.push(hold_pile(data, i));
    }
    return piles;
}

export function score_piles(data: IViewModelData) {
    const piles: ICardCollectionViewData[] = [];
    for (let i = 0; i < 4; ++i) {
        piles.push(score_pile(data, i));
    }
    return piles;
}

export function floating_cards(data: IViewModelData): IFloatingCard[]{
    return data.floating;
}

