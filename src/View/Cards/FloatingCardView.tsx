import * as React from 'react'
import '../Cards.css'
import {ICardView} from '../../ViewModel/Cards/ViewModelData'
import {IFloatingCard} from '../../ViewModel/Cards/ViewModelData'

interface IFloatingCardViewProps {
    card: IFloatingCard,   
    cardStyles: any
}

export default class FloatingCardView extends React.Component<IFloatingCardViewProps, any>{
    
    public render(): JSX.Element {     
        
        return (
            <section style={this.drag_style(this.props.card)} className="Dragging">
             {this.render_moving_card(this.props.card.card, true)}
            
            </section>
        );
    }

    private drag_style(card: IFloatingCard) {
        return {
            left: card.box.left + "px",
            top: card.box.top + "px",
            transform: "scale(" + card.box.scaleX + ", " + card.box.scaleY + ")"
        };
    }

    private render_moving_card(card: ICardView, isTop: boolean): JSX.Element  {
        if (isTop) {        
            return ( <section style={this.props.cardStyles.front(card)}/>);
        }
        return ( <section style={this.props.cardStyles.piled(card)}/>  );
    }

}