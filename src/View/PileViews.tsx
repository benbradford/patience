import * as React from 'react'
import './Cards.css'
import {IPileView, ICardView} from '../ModelView/Cards/ModelViewData'
import HoldPileView from './HoldPileView';
import ScorePileViews from './ScorePileViews';
import DeckView from './DeckView'
import {make_refs} from './Cards/ReactUtil'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import FloatingCards from '../ModelView/Cards/FloatingCards'
import ICardStyles from './ICardStyles';

interface IPileViewsProps {
    ref: React.RefObject<PileViews>;
    cardStyles: ICardStyles; 
    modelView: SolitaireModelView; 
    floatingCards: FloatingCards;
    onDeckClick: () => void;
    onStartDrag: (c: ICardView, box: ClientRect) => void;
}
export default class PileViews extends React.Component<IPileViewsProps, any> {
    
    private readonly pileRef = make_refs<HoldPileView>(7);
    private readonly scoresRef = React.createRef<ScorePileViews>(); 
    private readonly turnedRef = React.createRef<HTMLElement>();
    private readonly deckRef = React.createRef<HTMLElement>();
    
    public render(): JSX.Element {     
        const piles : IPileView[] = this.props.modelView.hold();
        return (
            <section>
                <ScorePileViews ref={this.scoresRef} cardStyles={this.props.cardStyles} modelView={this.props.modelView} floatingCards={this.props.floatingCards} onStartDrag={this.props.onStartDrag} />    
                <section className="BetweenScoreAndDeck">&nbsp;</section>
                <DeckView cardStyles={this.props.cardStyles} deckRef={this.deckRef} turnedRef={this.turnedRef} key={1} modelView={this.props.modelView} floatingCards={this.props.floatingCards} onDeckClick={this.props.onDeckClick} onStartDrag={this.props.onStartDrag} /> 
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                {piles.map((pile: IPileView, index: number) => this.render_pile(pile, index))} 
            </section>
        );
    }

    public box_for(pileIndex: number): ClientRect | null {
        const holdIndex = pileIndex - 2;
        const scoreIndex = pileIndex - 10;
        
        if (pileIndex === 0 && this.deckRef.current) {
            return this.deckRef.current.getBoundingClientRect();
        } else if (pileIndex === 1 && this.turnedRef.current) {
            // turned pile
            return this.turnedRef.current.getBoundingClientRect();
        } else if (holdIndex >=0 && holdIndex < 7) {
            const r = this.pileRef[holdIndex];
            if (r === null || r.current === null) {
                    
                return null;
            }
            return r.current.box();
           
        } else if (scoreIndex >=0 && scoreIndex < 4) {
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
            <HoldPileView className="PileDiv" key={index} ref={r} cardStyles={this.props.cardStyles} pile={pile} floatingCards={this.props.floatingCards} onStartDrag={this.props.onStartDrag} />
        );
    }
}