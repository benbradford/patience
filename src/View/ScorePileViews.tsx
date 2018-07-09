import * as React from 'react'
import './Cards.css'
import {IPileView, ICardView} from '../ModelView/Cards/ModelViewData'

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

    public box(index: number): ClientRect | null {   
        const r = this.cardRefs[index].current;
        if (r === null) {
            return null;
        }
        return r.getBoundingClientRect();
    }
   
    private render_card(pile: IPileView, index: number): JSX.Element  {
        if (pile.cards.length === 0 || (pile.cards.length === 1 && pile.cards[0] === this.props.movingCard)) {
            return this.render_empty(this.cardRefs[index])
        }

        let card = pile.cards[pile.cards.length-1];
        if (card === this.props.movingCard) {
            card = pile.cards[pile.cards.length-2];
        }
        const callback = () =>{ this.onClick(card, index); };
        return ( <div className="PileDiv"> <section style={this.props.cardStyles.front(card)} ref={this.cardRefs[index]} onMouseDown={callback} /> </div> );   
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
        if (this.props.movingCard!== null) {
            return;
        }

        const cardRef = this.cardRefs[index].current;
        if (cardRef === null) {
            return;
        }
        const box = cardRef.getBoundingClientRect();

        this.props.onScoreClick(card, box);
    }

}