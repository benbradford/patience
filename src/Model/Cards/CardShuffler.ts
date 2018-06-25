import {Card} from './Card'

export default class CardShuffler {

    public shuffle(cards : Card[]) {
        for (let i = 0; i < cards.length-1; ++i) {	
			const ran : number = i + (Math.floor(Math.random() * (cards.length - i)));
			const tmp : Card = cards[i];
			cards[i] = cards[ran];
			cards[ran] = tmp;
		}
    }
}