import * as React from 'react'
import './Cards.css'
import {ICardView} from '../ModelView/ModelViewData'
import {piled_style, front_style, render_empty} from  './CardRenderer'

export default class HoldPileView extends React.Component<any, any>{
    
    private readonly cardRefs: Array<React.RefObject<HTMLElement>> = [React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>()];

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
            return render_empty(this.cardRefs[0]);
        }
        return (<div className="PileDiv"> {this.props.pile.cards.map( (card: ICardView, i: number) => this.render_card(card, i))} </div>);
    }
    private render_card(card: ICardView, index: number) {

        if (this.renderedFront === true) {
            return ( <p/> );
        }
        if (this.props.pile.cards[0] === this.props.moving.card) {
            this.renderedFront = true;
            return render_empty(this.cardRefs[0]);
        }

        if (card === this.props.moving.card) {
            this.renderedFront = true;
            return ( <p/> );
        }

        let s = piled_style(card);
        const callback = (event: React.MouseEvent<HTMLDivElement>) =>{ this.onClick(card, index, event); };

        if (card === this.props.pile.cards[this.props.pile.cards.length-1] || (index < this.props.pile.cards.length-1 && this.props.pile.cards[index+1] === this.props.moving.card)) {
             s = front_style(card);
        } 

        return (       
            <tr>
                <section style={s} onMouseDown={callback} ref={this.cardRefs[index]}/> 
            </tr>
        );
        
    }

    private onClick = (card: ICardView, index: number, event: React.MouseEvent<HTMLDivElement>): void => {
        if (this.props.moving.card !== null) {
            return;
        }

        if (card.turned === false) {
            return;
        }

        const r = this.cardRefs[index].current;
        if (r === null) {
            return;
        }
        const box = r.getBoundingClientRect();
        const offsetX = (box.left - event.clientX);
        const offsetY = (box.top - event.clientY);

        this.props.onPileClick(card, offsetX, offsetY);
    
    }

}