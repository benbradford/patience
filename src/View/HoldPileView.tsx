import * as React from 'react'
import './Cards.css'
import {ICardView} from '../ModelView/ModelViewData'
import {piled_style, front_style, cardWidth, cardLength} from  './CardRenderer'

export default class HoldPileView extends React.Component<any, any>{
    
    private readonly cardRefs: Array<React.RefObject<HTMLElement>> = [React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>()];

    private renderedFront = false;
    public render(): JSX.Element {     
        this.renderedFront = false;
        return (
            <div className="PileDiv">
              {this.props.pile.cards.map( (card: ICardView, i: number) => this.render_card(card, i))}
             </div>
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

    private render_card(card: ICardView, index: number) {

        if (this.props.pile.cards.length === 0 || (index === 0 && this.props.pile.cards[0] === this.props.moving.card)) {
           return this.render_empty();
        }

        if (this.renderedFront || card === this.props.moving.card) {
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

    private render_empty() {
        const emptyStyle = {
            width: cardWidth,
            height: cardLength,
            borderColor: "black",
            border: "solid"

        };

        return (
            <section>
             <div className="PileDiv">
                <section style={emptyStyle} ref={this.cardRefs[0]} />
             </div>
            </section>
        )
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