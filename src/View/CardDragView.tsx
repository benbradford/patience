import * as React from 'react'
import './Cards.css'
import {front_style, piled_style, } from  './CardRenderer'
import {collect_all_cards_above} from '../ModelView/ModelViewData'
import {ICardView} from '../ModelView/ModelViewData'

export default class CardDragView extends React.Component<any, any>{
    
    public render(): JSX.Element {     
        
        if (this.props.card === null || this.props.isDragged === false) {
            return ( <p/> );
        }

        const cards = collect_all_cards_above(this.props.card, this.props.modelView);
        
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