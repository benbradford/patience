import {ICardView} from '../ViewModel/Cards/ViewModelData'
import {cardImages} from './CardImages'
import ICardStyles from '../ViewModel/Cards/ICardStyles'

const emptyCard = [
    require('../Asset/organic-tiles.png')
];

export default class DefaultCardStyles implements ICardStyles {

    public readonly cardWidthValue = 100;
    public readonly cardLengthValue = 140;
    public readonly previewSize = this.cardLengthValue / 6;

    public readonly cardWidth = this.cardWidthValue + "px";
    public readonly cardLength = " " + this.cardLengthValue + "px";
    public readonly cardBackgroundSize = (this.cardWidthValue + 4) + "px " + (this.cardLengthValue + 4) + "px";
    public readonly previewLength = " " + (this.previewSize) +"px";

    public empty(): any {
        return this.card_style(emptyCard, this.cardLength);
    }
    
    public piled(card : ICardView): any {
       return this.card_style(this.card_image(card), this.previewLength);
    }
    
    public front(card : ICardView): any {
        return this.card_style(this.card_image(card), this.cardLength);
    }

    private card_style(img: any, length: string) {  
        return {
            width: this.cardWidth,
            height: length,
            backgroundSize: this.cardBackgroundSize,
            backgroundPosition: "-2px -2px",
            backgroundImage: "url(" + img + ")",
            padding:"0",
            margin:"0",
            lineHeight:"0",
            borderColor:"black",
            borderSize:"0.1px",
            borderStyle:"ridge",
            borderWidth: "thin",
            backgroundOrigin:"content-box"
        };     
    }

    private card_image(card : ICardView) {
        if (card.turned === false) {
            return cardImages[52];
        }
        let indexStart = 0;
        if (card.suit === 1) {
            indexStart = 13;
        } else if (card.suit === 3) {
            indexStart = 26;
        } else if (card.suit === 0) {
            indexStart = 39;
        }
        return cardImages[indexStart + card.face];
    }
}


