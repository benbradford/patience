import * as React from 'react'
import './Cards.css'
import {ICard} from '../ModelView/ViewData'
import {piled_style, front_style, cardWidth, cardLength} from './Renderer'

export default class HoldPileView extends React.Component<any, any>{
    
    private cardRefs = [React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>()];

    private renderedFront = false;
    public render(): JSX.Element {     
        this.renderedFront = false;
        return (
            <div className="PileDiv">
              {this.props.pile.cards.map( (card: ICard, i: number) => this.render_card(card, i))}
             </div>

        );
    }

    private render_card(card: ICard, index: number) {

        if (this.props.pile.cards.length === 0 || (index === 0 && this.props.pile.cards[0] === this.props.moving.card)) {
            const emptyStyle = {
                width: cardWidth,
                height: cardLength,
                borderColor: "black",
                border: "solid"
    
            };

            return (
                <section>
                 <div className="PileDiv">
                    <section style={emptyStyle} />
                 </div>
                </section>
            )
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

    private onClick = (card: ICard, index: number, event: React.MouseEvent<HTMLDivElement>): void => {
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