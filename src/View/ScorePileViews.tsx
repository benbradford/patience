import * as React from 'react'
import './Cards.css'
import {ICardCollectionViewData, ICardView} from '../ViewModel/Cards/ViewModelData'
import {make_refs} from './Cards/ReactUtil'
import ICardStyles from '../ViewModel/Cards/ICardStyles'

interface IScorePileViews {
    ref: React.RefObject<ScorePileViews>;
    cardStyles: ICardStyles; 
    scorePiles: ICardCollectionViewData[];
    hasFloatingCards: boolean;
    onStartDrag: (c: ICardView, box: ClientRect) => void;
}

export default class ScorePileViews extends React.Component<IScorePileViews, any>{
    
    private readonly cardRefs = make_refs<HTMLElement>(4);

    public render(): JSX.Element {       
        return (
            <section>
                <div className="PileDiv" />
                {this.props.scorePiles.map( (pile: ICardCollectionViewData, index: number) => this.render_card(pile, index))}
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
   
    private render_card(pile: ICardCollectionViewData, index: number): JSX.Element  {
        if (pile.cards.length === 0 ) {
            return this.render_empty(this.cardRefs[index])
        }

        const card = pile.cards[pile.cards.length-1];
        
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
        if (this.props.hasFloatingCards) {
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