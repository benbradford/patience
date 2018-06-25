import DeckMaker from './Cards/DeckMaker'
import CardShuffler from './Cards/CardShuffler'

export default class CardManipulator {

    private deckMaker : DeckMaker;
    private shuffler : CardShuffler;

    constructor(deckMaker : DeckMaker, shuffler : CardShuffler) {
        this.deckMaker = deckMaker;
        this.shuffler = shuffler;
    }

    public deck_maker() : DeckMaker {
        return this.deckMaker;
    }

    public card_shuffler() : CardShuffler {
        return this.shuffler;
    }
}