import * as React from 'react'

import {IAnimationRequest} from '../../ViewModel/Cards/ViewModelData'

import styled, {keyframes} from 'styled-components'

import '../Cards.css'

interface ICardAnimationsViewProps {
     animationRequests: IAnimationRequest[];
     cardStyles: any;
}

export default class CardAnimationsView extends React.Component<ICardAnimationsViewProps, any>{
    
    public render(): JSX.Element { 
        if (this.props.animationRequests === null) {
            return <p/>
        }
        return (
            <section>
             {this.props.animationRequests.map( (request: IAnimationRequest) => this.render_animation(request))}
            </section>
        );
    }

    private render_animation(request: IAnimationRequest) {

        const from = {x: request.from.left(), y: request.from.top() };
        const to = {x: request.to.left(), y: request.to.top() };
        const rotate = keyframes`
            0%   {transform: translate(${from.x}px, ${from.y}px);}
            100%  {transform: translate(${to.x}px, ${to.y}px);}
        `;
        const MyAnimation = styled.section`
            animation : ${rotate} 0.15s linear
            animation-fill-mode: forwards
            ${this.props.cardStyles.front(request.card)}
            position: absolute
        `; 
        return ( <section className="Dragging" >
                    <MyAnimation/>
                </section>
        );
    }

}