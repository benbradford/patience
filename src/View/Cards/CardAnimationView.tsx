import * as React from 'react'
import '../Cards.css'
import FloatingCardView from './FloatingCardView'
import {ICardView} from '../../ModelView/Cards/ModelViewData'
import CardAnimator from './Animation/CardAnimator'
import {CardAnimatorTickResult} from './Animation/CardAnimator'

export default class CardAnimationView extends React.Component<any, any>{
    
    private animator: CardAnimator | null = null;

    private card: ICardView | null = null;
    private onAnimEnd: ()=>void | null;

    public render(): JSX.Element {   
        if (this.card === null || this.animator === null) {

           return ( <p/> );
        }  
        return ( <FloatingCardView cardStyles={this.props.cardStyles} card={this.card} enabled={true} modelViewDataSync={this.props.modelViewDataSync} cardX={this.animator.card_data().cardX} cardY={this.animator.card_data().cardY} scaleX={this.animator.card_data().scaleX}/> );
    }

    public start_animation(card: ICardView, animator: CardAnimator, onAnimEnd: ()=>void) {
        this.card = card;
        this.animator = animator;
        this.onAnimEnd = onAnimEnd;
    }

    public update() { 
        if (this.animator) {
            const result = this.animator.tick();
            if (result === CardAnimatorTickResult.completed) {
                this.onAnimEnd();
                this.card = null;
                this.animator = null;
            }
        }
    }

    public is_animating(): boolean {
        return this.animator !== null;
    }

}

