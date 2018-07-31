import ICardTicker from './ICardTicker'

export default class CardTickManager {
    private tickers: ICardTicker[] = [];
    private toDelete: ICardTicker[] = [];

    public add(ticker: ICardTicker) {
        this.tickers.push(ticker);
    }

    public remove(ticker: ICardTicker) {
        this.toDelete.push(ticker);
        
    }

    public tick() {
        this.remove_to_delete();
        for (const ticker of this.tickers) {
            ticker.tick();
        }
    }

    private remove_to_delete() {
        for (const del of this.toDelete) {
            for (let i = 0; i < this.tickers.length; ++i) {
                if (this.tickers[i] === del) {
                    this.tickers.splice(i, 1);
                    break;
                }
            }
        }
        this.toDelete = [];
    }
}