import * as React from 'react'
import './Cards.css'
import { ICardPile } from '../ModelView/ViewData';
import HoldPileView from './HoldPileView';

export default class HoldPileViews extends React.Component<any, any>{
    
    public render(): JSX.Element {     
        const piles : ICardPile[] = this.props.hold;
        return (
            <section>
                {piles.map((pile: ICardPile, index: number) => this.render_pile(pile, index))} 
            </section>
        );
    }

    private render_pile(pile: ICardPile, index: number) {
        return (  
            <HoldPileView pile={pile} index={index} className="PileDiv" />
        );
    }
}