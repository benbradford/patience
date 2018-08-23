import * as React from 'react'
import './Cards.css'
import {ICardView, IViewModelData, ICardCollectionViewData} from '../ViewModel/Cards/ViewModelData'
import HoldPileView from './HoldPileView';
import ScorePileViews from './ScorePileViews';
import DeckView from './DeckView'
import {make_refs} from './Cards/ReactUtil'
import ICardStyles from '../ViewModel/Cards/ICardStyles'
import {hold_piles, score_piles, deck_pile, turned_pile} from '../ViewModel/SolitaireCardCollectionsViewModel'
import CardBox from '../ViewModel/Cards/CardBox'
import {make_card_box} from './Cards/ReactUtil'

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

    public box_for_pile(pileIndex: number): ClientRect | null {
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
            return r.current.box_for_pile();
           
        } else if (scoreIndex >=0 && scoreIndex < 4) {
            const scores = this.scoresRef.current;
            if (scores) {
                return scores.box_for_pile(scoreIndex);
                
            }
        }
        
        return null;
    }

    public box_for_card(card: ICardView): ClientRect | null {
        const holdIndex = card.pileIndex  - 2;
        const scoreIndex = card.pileIndex  - 10;

        if (card.pileIndex === 0 && this.deckRef.current) {
            return this.deckRef.current.getBoundingClientRect();
        } else if (card.pileIndex === 1 && this.turnedRef.current) {
            // turned pile
            return this.turnedRef.current.getBoundingClientRect();
        }  else if (holdIndex >=0 && holdIndex < 7) {
            const r = this.pileRef[holdIndex];
            if (r.current ) {
                return r.current.box_for_card(card);
            }
        } else if (scoreIndex >=0 && scoreIndex < 4) {
            const scores = this.scoresRef.current;
            if (scores) {   
                return scores.box_for_card(card);
            }
        }
        return null;
    }

    public static_box(pileIndex: number, cardIndex: number): CardBox {
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
                    
                throw new Error("cannot find hold pile");
            }
            return r.current.static_box(cardIndex);
           
        } else if (scoreIndex >=0 && scoreIndex < 4) {
            const scores = this.scoresRef.current;
            if (scores) {
                const box = scores.box_for_pile(scoreIndex)
                if (box) {
                    return make_card_box(box);
                }     
            }
        }

        throw new Error("cannot find pile");
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