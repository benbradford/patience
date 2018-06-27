import SolitaireCollections from '../SolitaireCollections'
import {HoldIndex, ScoreIndex} from '../SolitaireCollections'

it('can access collections', () => {
    const collections = new SolitaireCollections();
   
    for (let i : HoldIndex = 0; i < 7; ++i) {
        const hold = collections.hold(i as HoldIndex);
        expect(collections.is_hold(hold)).toBeTruthy();
    }

    expect(collections.is_hold(collections.hold(8 as HoldIndex))).toBeFalsy();
    expect(collections.is_hold(collections.hold(-1 as HoldIndex))).toBeFalsy();

    for (let i : ScoreIndex = 0; i < 4; ++i) {
        const hold = collections.hold(i as ScoreIndex);
        expect(collections.is_hold(hold)).toBeTruthy();
    }

    expect(collections.is_score(collections.score(4 as ScoreIndex))).toBeFalsy();
    expect(collections.is_score(collections.score(-1 as ScoreIndex))).toBeFalsy();
});