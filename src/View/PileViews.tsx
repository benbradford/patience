import * as React from 'react'
import './Cards.css'
import { IPileView } from '../ModelView/Cards/ModelViewData';
import HoldPileView from './HoldPileView';
import ScorePileViews from './ScorePileViews';
import DeckView from './DeckView'
import {make_refs, make_card_box} from './Cards/ReactUtil'
import IBoxFinder from './IBoxFinder'
import CardBox from '../ModelView/Cards/CardBox'

export default class PileViews extends React.Component<any, any> implements IBoxFinder {
    
    private readonly pileRef = make_refs<HoldPileView>(7);
    private readonly scoresRef = React.createRef<ScorePileViews>(); 
    private readonly turnedRef = React.createRef<HTMLElement>();
    private readonly deckRef = React.createRef<HTMLElement>();
    
    public render(): JSX.Element {     
        const piles : IPileView[] = this.props.hold;
        return (
            <section>
                <ScorePileViews ref={this.scoresRef} cardStyles={this.props.cardStyles} score={this.props.score} onClick={this.props.startDrag} movingCard={this.props.movingCard} onScoreClick={this.props.onStartDrag} />    
                <section className="BetweenScoreAndDeck">&nbsp;</section>
                <DeckView cardStyles={this.props.cardStyles} deckRef={this.deckRef} turnedRef={this.turnedRef} key={1} deck={this.props.deck} turned={this.props.turned} movingCard={this.props.movingCard} onDeckClick={this.props.onDeckClick} onTurnClick={this.props.onStartDrag} /> 
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                {piles.map((pile: IPileView, index: number) => this.render_pile(pile, index))} 
            </section>
        );
    }

    public box_for(pileIndex: number): CardBox | null {
        const holdIndex = pileIndex - 2;
        const scoreIndex = pileIndex - 10;
        
        if (pileIndex === 0 && this.deckRef.current) {
            return make_card_box(this.deckRef.current.getBoundingClientRect());
        } else if (pileIndex === 1 && this.turnedRef.current) {
            // turned pile
            return make_card_box(this.turnedRef.current.getBoundingClientRect());
        } else if (holdIndex >=0 && holdIndex < 7) {
            const r = this.pileRef[holdIndex];
            if (r === null || r.current === null) {
                    
                return null;
            }
            const b = r.current.box();
            if (b) {
                return make_card_box(b);
            }
        } else if (scoreIndex >=0 && scoreIndex < 4) {
            const scores = this.scoresRef.current;
            if (scores) {
                const b = scores.box(scoreIndex);
                if (b) {
                    return make_card_box(b);
                }
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
            <HoldPileView key={index} ref={r} cardStyles={this.props.cardStyles} pile={pile} index={index} className="PileDiv" movingCard={this.props.movingCard} onPileClick={this.props.onStartDrag} />
        );
    }
}