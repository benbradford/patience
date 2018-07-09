import * as React from 'react'
import './Cards.css'
import {front_style, piled_style, } from  './CardRenderer'
import {ICardView} from '../ModelView/Cards/ModelViewData'

export default class FloatingCardView extends React.Component<any, any>{
    
    public render(): JSX.Element {     
        
        if (this.props.card === null || this.props.enabled === false) {
            return ( <p/> );
        }

        const cards = this.props.modelViewDataSync.collect_all_cards_above(this.props.card);
        
        return (
            <section style={this.drag_style()} className="Dragging">
             {cards.map( (card: ICardView, i: number) => this.render_moving_card(card, i === 0, i === cards.length-1))}
            
            </section>
        );
    }

    private drag_style() {
        return {
            left: this.props.cardX + "px",
            top: this.props.cardY + "px",
        };
    }

    private render_moving_card(card: ICardView, isFirst: boolean, isTop: boolean): JSX.Element  {

        if (isTop) {
            
            return ( <section style={front_style(card)}/>);
        }
        return ( <section style={piled_style(card)}/>  );
    }

}