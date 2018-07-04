import * as React from 'react'
import './Cards.css'
import { IPileView, PileName, hold_index_from_pilename, score_index_from_pilename } from '../ModelView/ModelViewData';
import HoldPileView from './HoldPileView';
import ScorePileViews from './ScorePileViews';
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

    private readonly scoresRef = React.createRef<ScorePileViews>(); 
    
    public render(): JSX.Element {     
        const piles : IPileView[] = this.props.hold;
        return (
            <section>
                <ScorePileViews ref={this.scoresRef} score={this.props.score} onClick={this.props.startDrag} movingCard={this.props.moving.card} />    
                <DeckView deck={this.props.deck} turned={this.props.turned} moving={this.props.moving} onDeckClick={this.props.onDeckClick} onTurnClick={this.props.onStartDrag} /> 
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                {piles.map((pile: IPileView, index: number) => this.render_pile(pile, index))} 
            </section>
        );
    }

    public box_for(name: PileName): ClientRect | null{
        const index = hold_index_from_pilename(name);
        if (index !== null) {         
            const r = this.pileRef[index];
            if (r === null || r.current === null) {
                
                return null;
            }
            return r.current.box();
        }
        const scoreIndex = score_index_from_pilename(name);
        if (scoreIndex !== null) {
            const scores = this.scoresRef.current;
            if (scores) {
                return scores.box(scoreIndex);
            }
        }
        return null;
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