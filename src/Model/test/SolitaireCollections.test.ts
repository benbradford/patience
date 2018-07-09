import SolitaireCollections from '../SolitaireCollections'

it('can access collections', () => {
    const collections = new SolitaireCollections();
   
    for (let i : number = 0; i < 7; ++i) {
        const hold = collections.hold(i);
        expect(collections.is_hold(hold)).toBeTruthy();
    }

    expect(collections.is_hold(collections.hold(8))).toBeFalsy();
    expect(collections.is_hold(collections.hold(-1))).toBeFalsy();

    for (let i : number = 0; i < 4; ++i) {
        const hold = collections.hold(i);
        expect(collections.is_hold(hold)).toBeTruthy();
    }

    expect(collections.is_score(collections.score(4))).toBeFalsy();
    expect(collections.is_score(collections.score(-1))).toBeFalsy();
});