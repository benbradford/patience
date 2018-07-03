import * as React from 'react'
import './Cards.css'
import { IPileView, PileName, hold_index_from_pilename } from '../ModelView/ViewData';
import HoldPileView from './HoldPileView';
import DeckView from './DeckView'

export default class PileViews extends React.Component<any, any>{
    
    private readonly pileRef : Array<React.RefObject<HoldPileView>> = [
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>() ,
        React.createRef<HoldPileView>()       
    ];
    
    public render(): JSX.Element {     
        const piles : IPileView[] = this.props.hold;
        return (
            <section>
                <DeckView deck={this.props.deck} turned={this.props.turned} moving={this.props.moving} onDeckClick={this.props.onDeckClick} onTurnClick={this.props.onStartDrag} /> 
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                {piles.map((pile: IPileView, index: number) => this.render_pile(pile, index))} 
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

    private render_pile(pile: IPileView, index: number) {
        const r = this.pileRef[index];
        if (r === null) {
            return ( <p/> );
        }
        return (  
            <HoldPileView ref={r} pile={pile} index={index} className="PileDiv" moving={this.props.moving} onPileClick={this.props.onStartDrag} />
        );
    }
}