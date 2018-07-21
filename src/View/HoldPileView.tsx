import * as React from 'react'
import './Cards.css'
import {ICardView, IPileView} from '../ModelView/Cards/ModelViewData'
import {make_refs} from './Cards/ReactUtil'
import FloatingCards from '../ModelView/Cards/FloatingCards'
import ICardStyles from '../ModelView/Cards/ICardStyles'

interface IHoldPileProps {
    className: any;
    key: any; 
    ref: React.RefObject<HoldPileView>;
    cardStyles: ICardStyles;
    pile: IPileView;
    floatingCards: FloatingCards;
    onStartDrag: (c: ICardView, box: ClientRect) => void;
}

export default class HoldPileView extends React.Component<IHoldPileProps, any>{
    
    private readonly cardRefs = make_refs<HTMLElement>(13);
    private renderedFront = false;
    
    public render(): JSX.Element {     
        this.renderedFront = false;
        return (
            <section>
              {this.render_cards()}
            </section>
        );
    }

    public box(): ClientRect | null {
        
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

    private render_cards() {
        if (this.props.pile.cards.length === 0 ) {
            return this.render_empty(this.cardRefs[0]);
        }
        return (<section className="PileDiv"> {this.props.pile.cards.map( (card: ICardView, i: number) => this.render_card(card, i))} </section>);
    }
    private render_card(card: ICardView, index: number) {

        if (this.renderedFront === true) {
            return ( <p/> );
        }
        if (this.props.floatingCards.find(this.props.pile.cards[0])) {
            this.renderedFront = true;
            return this.render_empty(this.cardRefs[0]);
        }

        if (this.props.floatingCards.find(card)) {
            this.renderedFront = true;
            return ( <p/> );
        }

        let s = this.props.cardStyles.piled(card);
        const callback = () =>{ this.onClick(card, index); };

        if (card === this.props.pile.cards[this.props.pile.cards.length-1] || (index < this.props.pile.cards.length-1 && this.props.floatingCards.find(this.props.pile.cards[index+1]))) {
             s = this.props.cardStyles.front(card);
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
        if (this.props.floatingCards.has_any() || card.turned === false) {
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