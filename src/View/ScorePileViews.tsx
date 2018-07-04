import * as React from 'react'
import './Cards.css'
import {front_style, render_empty} from  './CardRenderer'
import {IPileView} from '../ModelView/ModelViewData'
import {ScoreIndex} from '../Model/SolitaireCollections' // :TODO: importing from model?

export default class ScorePileViews extends React.Component<any, any>{
    
    private readonly cardRefs: Array<React.RefObject<HTMLElement>> = [
        React.createRef<HTMLElement>(),
        React.createRef<HTMLElement>(),
        React.createRef<HTMLElement>(),
        React.createRef<HTMLElement>()
    ];

    public render(): JSX.Element {     
        
        return (
            <section>
                <div className="PileDiv" />
                {this.props.score.map( (pile: IPileView, index: number) => this.render_card(pile, index))}
            </section>
        );
       
    }

    public box(index: ScoreIndex): ClientRect | null {
        
        const r = this.cardRefs[index].current;
        if (r === null) {
            return null;
        }
        return r.getBoundingClientRect();
    }
   
    private render_card(pile: IPileView, index: number): JSX.Element  {
        if (pile.cards.length === 0 || (pile.cards.length === 1 && pile.cards[0] === this.props.movingCard)) {
            return render_empty(this.cardRefs[index])
        }

        let card = pile.cards[pile.cards.length-1];
        if (card === this.props.movingCard) {
            card = pile.cards[pile.cards.length-2];
        }
        return ( <div className="PileDiv"> <section style={front_style(card)} ref={this.cardRefs[index]}  /> </div> );   
    }

}