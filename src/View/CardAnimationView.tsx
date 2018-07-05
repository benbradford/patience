import * as React from 'react'
import './Cards.css'
import CardDragView from './CardDragView'
import {ICardView} from '../ModelView/ModelViewData'

export default class CardAnimationView extends React.Component<any, any>{
    
    private isAnimating = false;
    private animX = 0;
    private animY = 0;
    private card: ICardView | null = null;
    private destX = 0;
    private destY = 0;
    private fromX = 0;
    private fromY = 0;
    private moveTime = 0;
    private onAnimEnd: ()=>void | null;

    public render(): JSX.Element {   
        if (this.isAnimating === false) {

           return ( <p/> );

        }  
        return ( <CardDragView card={this.card} isDragged={true} modelView={this.props.modelView} cardX={this.animX} cardY={this.animY}/> );
    }

    public start_animation(card: ICardView, fromX: number, fromY: number, destX: number, destY: number, onAnimEnd: ()=>void) {
        this.isAnimating = true;
        this.onAnimEnd = onAnimEnd;
        this.fromX = fromX;
        this.fromY = fromY;
        this.animX = fromX
        this.animY = fromY;
        this.card = card;
        this.destX = destX;
        this.destY = destY;
        this.moveTime = 0;
    }

    public update() {
        if (this.isAnimating === false ) {
            return;
        }
        this.moveTime+=1;
        let delta = this.moveTime / 10;
        if (this.moveTime >= 10) {
            this.isAnimating = false;
            delta = 10;
            this.onAnimEnd();
        }
        this.animX = this.fromX + (this.destX - this.fromX) * delta;
        this.animY = this.fromY + (this.destY - this.fromY) * delta;
    }

    public is_animating(): boolean {
        return this.isAnimating;
    }

}

