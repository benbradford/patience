import * as React from 'react'
import './Cards.css'
import {ICardView, ICardCollectionViewData} from '../ViewModel/Cards/ViewModelData'
import {make_refs} from './Cards/ReactUtil'
import ICardStyles from '../ViewModel/Cards/ICardStyles'
import CardBox from '../ViewModel/Cards/CardBox'
import {make_card_box} from './Cards/ReactUtil'

interface IHoldPileProps {
    className: any;
    key: any; 
    ref: React.RefObject<HoldPileView>;
    cardStyles: ICardStyles;
    pile: ICardCollectionViewData;
    hasFloatingCards: boolean;
    onStartDrag: (c: ICardView, box: ClientRect) => void;
}

export default class HoldPileView extends React.Component<IHoldPileProps, any>{
    
    private readonly cardRefs = make_refs<HTMLElement>(13);
    
    public render(): JSX.Element {     
        return (
            <section>
              {this.render_cards()}
            </section>
        );
    }

    public box_for_pile(): ClientRect | null {       
        let index = this.props.pile.cards.length - 1;
        if (index < 0) {
            index = 0;
        }
        const r = this.cardRefs[index].current;
        if (r === null) {
            return null;
        }
        return r.getBoundingClientRect();
    }

    public box_for_card(card: ICardView): ClientRect | null {
        for (let i = 0; i < this.props.pile.cards.length; ++i) {
            if (card.suit === this.props.pile.cards[i].suit && card.face === this.props.pile.cards[i].face) {
                const r = this.cardRefs[i].current;
                if (r === null) {
                    return null;
                }
                return r.getBoundingClientRect();
            }
        }
        return null;
    }

    public static_box(cardIndex: number): CardBox {
        const cardView = this.cardRefs[0].current;
        if (cardView) {
            const box = make_card_box(cardView.getBoundingClientRect());
            box.set_position(box.left(), box.top() + (this.props.cardStyles.previewSize * cardIndex))
            return box;
        }
        throw new Error("cannot get box");
    }

    private render_cards() {
        if (this.props.pile.cards.length === 0 ) {
            return this.render_empty(this.cardRefs[0]);
        }
        return (<section className="PileDiv"> {this.props.pile.cards.map( (card: ICardView, i: number) => this.render_card(card, i))} </section>);
    }
    private render_card(card: ICardView, index: number) {
        let s = this.props.cardStyles.front(card);
        const callback = () =>{ this.onClick(card, index); };

        if (index < this.props.pile.cards.length-1 ) {
             s = this.props.cardStyles.piled(card);
        } 

        return (       
            <section style={s} onMouseDown={callback} key={index} ref={this.cardRefs[index]}/>      
        );   
    }

    private render_empty(cardRef: React.RefObject<HTMLElement>) {  
        return (
            <section>
             <div className="PileDiv">
                <section style={this.props.cardStyles.empty()} ref={cardRef} />
             </div>
            </section>
        )
    }

    private onClick = (card: ICardView, index: number): void => {
        if (this.props.hasFloatingCards || card.turned === false) {
            return;
        }

        const r = this.cardRefs[index].current;
        if (r === null) {
            return;
        }
        const box = r.getBoundingClientRect();
      
        this.props.onStartDrag(card, box);
    
    }

}