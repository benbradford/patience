import * as React from 'react'
import './Cards.css'
import {IPileView, ICardView} from '../ModelView/Cards/ModelViewData'
import {make_refs} from './Cards/ReactUtil'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import FloatingCards from '../ModelView/Cards/FloatingCards'
import ICardStyles from '../ModelView/Cards/ICardStyles'

interface IScorePileViews {
    ref: React.RefObject<ScorePileViews>;
    cardStyles: ICardStyles; 
    modelView: SolitaireModelView; 
    floatingCards: FloatingCards;
    onStartDrag: (c: ICardView, box: ClientRect) => void;
}

export default class ScorePileViews extends React.Component<IScorePileViews, any>{
    
    private readonly cardRefs = make_refs<HTMLElement>(4);

    public render(): JSX.Element {       
        return (
            <section>
                <div className="PileDiv" />
                {this.props.modelView.score().map( (pile: IPileView, index: number) => this.render_card(pile, index))}
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
        if (pile.cards.length === 0 || (pile.cards.length === 1 && this.props.floatingCards.find(pile.cards[0]))) {
            return this.render_empty(this.cardRefs[index])
        }

        let card = pile.cards[pile.cards.length-1];
        if (this.props.floatingCards.find(card)) {
            card = pile.cards[pile.cards.length-2];
        }
        const callback = () =>{ this.onClick(card, index); };
        return ( <div className="PileDiv"> <section style={this.props.cardStyles.front(card)} key={index} ref={this.cardRefs[index]} onMouseDown={callback} /> </div> );   
    }

    private render_empty(cardRef: React.RefObject<HTMLElement>) {  
        return (
            <section>
             <div className="PileDiv">
                <section style={this.props.cardStyles.empty()} key={0} ref={cardRef} />
             </div>
            </section>
        )
    }

    private onClick = (card: ICardView, index: number): void => {
        if (this.props.floatingCards.has_any()) {
            return;
        }

        const cardRef = this.cardRefs[index].current;
        if (cardRef === null) {
            return;
        }
        const box = cardRef.getBoundingClientRect();

        this.props.onStartDrag(card, box);
    }

}