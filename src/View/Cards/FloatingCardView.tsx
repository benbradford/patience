import * as React from 'react'
import '../Cards.css'
import {ICardView} from '../../ViewModel/Cards/ViewModelData'
import ViewModelDataSync from '../../ViewModel/Cards/ViewModelDataSync'
import FloatingCard from '../../ViewModel/Cards/FloatingCard'

interface IFloatingCardViewProps {
    card: FloatingCard,   
    cardStyles: any,
    viewModelDataSync: ViewModelDataSync;
}

export default class FloatingCardView extends React.Component<IFloatingCardViewProps, any>{
    
    public render(): JSX.Element {     
        
        const currentCard = this.props.card.current();
        if (currentCard === null) {
            return ( <p/> );
        }
        const cards = this.props.viewModelDataSync.collect_all_cards_above(currentCard);
        
        return (
            <section style={this.drag_style(this.props.card)} className="Dragging">
             {cards.map( (card: ICardView, i: number) => this.render_moving_card(card, i === 0, i === cards.length-1))}
            
            </section>
        );
    }

    private drag_style(card: FloatingCard) {
        return {
            left: card.pos_x() + "px",
            top: card.pos_y() + "px",
            transform: "scale(" + card.scale_x() + ", 1)"
        };
    }

    private render_moving_card(card: ICardView, isFirst: boolean, isTop: boolean): JSX.Element  {

        if (isTop) {
            
            return ( <section style={this.props.cardStyles.front(card)}/>);
        }
        return ( <section style={this.props.cardStyles.piled(card)}/>  );
    }

}