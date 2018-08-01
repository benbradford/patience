import * as React from 'react'
import './Cards.css'
import {ICardView, IViewModelData, ICardCollectionViewData} from '../ViewModel/Cards/ViewModelData'
import HoldPileView from './HoldPileView';
import ScorePileViews from './ScorePileViews';
import DeckView from './DeckView'
import {make_refs} from './Cards/ReactUtil'
import ICardStyles from '../ViewModel/Cards/ICardStyles'
import {hold_piles, score_piles, deck_pile, turned_pile} from '../ViewModel/SolitaireCardCollectionsViewModel'

interface IPileViewsProps {
    ref: React.RefObject<PileViews>;
    cardStyles: ICardStyles; 
    viewModelData: IViewModelData;
    onDeckClick: () => void;
    onStartDrag: (c: ICardView, box: ClientRect) => void;
}
export default class PileViews extends React.Component<IPileViewsProps, any> {
    
    private readonly pileRef = make_refs<HoldPileView>(7);
    private readonly scoresRef = React.createRef<ScorePileViews>(); 
    private readonly turnedRef = React.createRef<HTMLElement>();
    private readonly deckRef = React.createRef<HTMLElement>();
    
    public render(): JSX.Element {     
        const piles = hold_piles(this.props.viewModelData);
        const score: ICardCollectionViewData[] = score_piles(this.props.viewModelData);
        return (
            <section>
                <ScorePileViews ref={this.scoresRef} cardStyles={this.props.cardStyles} hasFloatingCards={this.has_floating_cards()} scorePiles={score} onStartDrag={this.props.onStartDrag} />    
                <section className="BetweenScoreAndDeck">&nbsp;</section>
                <DeckView cardStyles={this.props.cardStyles} deckRef={this.deckRef} turnedRef={this.turnedRef} key={1} hasFloatingCards={this.has_floating_cards()}  onDeckClick={this.props.onDeckClick} onStartDrag={this.props.onStartDrag} deck={deck_pile(this.props.viewModelData)} turned={turned_pile(this.props.viewModelData)} /> 
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                {piles.map((pile: ICardCollectionViewData, index: number) => this.render_pile(pile, index))} 
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

    private render_pile(pile: ICardCollectionViewData, index: number) {
        const r = this.pileRef[index];
        if (r === null) {
            return ( <p/> );
        }
        return (  
            <HoldPileView className="PileDiv" key={index} ref={r} cardStyles={this.props.cardStyles} hasFloatingCards={this.has_floating_cards()} pile={pile} onStartDrag={this.props.onStartDrag} />
        );
    }

    private has_floating_cards() {
        return this.props.viewModelData.floating.length > 0;
    }
}