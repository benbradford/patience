import * as React from 'react'
import './Cards.css'
import { ICardPile, PileName, hold_index_from_pilename } from '../ModelView/ViewData';
import HoldPileView from './HoldPileView';

export default class HoldPileViews extends React.Component<any, any>{
    
    private pileRef : Array<React.RefObject<HoldPileView>> = [
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>()       
    ];
    
    public render(): JSX.Element {     
        const piles : ICardPile[] = this.props.hold;
        return (
            <section>
                {piles.map((pile: ICardPile, index: number) => this.render_pile(pile, index))} 
            </section>
        );
    }

    public box_for(name: PileName) {
        const index = hold_index_from_pilename(name);
        if (index === null) {
            return null;
        }
        const r = this.pileRef[index];
        if (r === null || r.current === null) {
            return null;
        }
        return r.current.box();
    }

    private render_pile(pile: ICardPile, index: number) {
        const r = this.pileRef[index];
        if (r === null) {
            return ( <p/> );
        }
        return (  
            <HoldPileView ref={r} pile={pile} index={index} className="PileDiv" moving={this.props.moving} onPileClick={this.props.onPileClick} />
        );
    }
}