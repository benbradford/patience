import * as React from 'react'
import './Cards.css'
import {ICardView, ICardCollectionViewData} from '../ViewModel/Cards/ViewModelData'
import {make_refs} from './Cards/ReactUtil'
import ICardStyles from '../ViewModel/Cards/ICardStyles'

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