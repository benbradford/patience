import * as React from 'react'
import {IModelViewData, ICardView} from '../ModelView/Cards/ModelViewData'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import PileViews from './PileViews'
import FloatingCardView from './Cards/FloatingCardView'
import CardAnimationView from './Cards/CardAnimationView'
import DefaultCardStyles from './DefaultCardStyles'
import SimpleLerpCardAnimator from './Cards/Animation/SimpleLerpCardAnimator'

interface IMoveDestination {
    pileIndex: number;
    box: ClientRect | null; 
}

interface IMoveData {
    card: ICardView | null;
    isDragged: boolean;
}

interface ITableData {
    modelView: IModelViewData;
    moving: IMoveData;
}

export default class TableView extends React.Component<{}, ITableData> {
    private modelView = new SolitaireModelView();
    private pileViews = React.createRef<PileViews>();
    private animationView = React.createRef<CardAnimationView>();
    private cardStyles: DefaultCardStyles = new DefaultCardStyles();
    private lastMouseX : number = 0;
    private lastMouseY : number = 0;
    private mouseOffsetX: number = 0;
    private mouseOffsetY: number = 0;
    
    private dragFrom: ClientRect | null = null;
    private destinations: IMoveDestination[];

    private interval : NodeJS.Timer;
   // private isAutoCompleting: boolean = false;
    
    public componentDidMount() {
       this.update_state_no_moving();
       this.interval = setInterval(() => this.update(), 10);
    }
    
    public  componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render(): JSX.Element {     
        if (this.state === null) {
            return ( <p/> );
        }
        return (
            <section>
                <div onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseLeave} className="Table">   
                    <PileViews ref={this.pileViews} cardStyles={this.cardStyles} deck={this.modelView.deck()} hold={this.modelView.hold()} turned={this.modelView.turned()} moving={this.state.moving} score={this.modelView.score()} onDeckClick={this.onDeckClick} onStartDrag={this.onStartDrag} />                 
                    <FloatingCardView cardStyles={this.cardStyles} card={this.state.moving.card} enabled={this.state.moving.isDragged} modelViewDataSync={this.modelView.data_sync()} cardX={this.lastMouseX + this.mouseOffsetX + window.scrollX} cardY={this.lastMouseY + this.mouseOffsetY + window.scrollY}/>
                    <CardAnimationView ref={this.animationView} cardStyles={this.cardStyles} modelViewDataSync={this.modelView.data_sync()} />
                    {this.render_undo()}
                </div>
            </section>
        );
    }

    private update() {
        if (this.animationView.current) {
            if (this.animationView.current.is_animating()) {
                this.animationView.current.update();
                this.setState(this.state);
            }
        }
    }
/*
    private auto_complete_button() {
        if (this.modelView.can_auto_complete() === false) {
            return ( <p/> );
        }
        return ( <button onClick={this.onAutoCompleteClick}>AutoComplete</button> );
    }

    private onAutoCompleteClick = () => {
        this.isAutoCompleting = true;
    }
*/
    private onDeckClick = () => {

        if (this.state.moving.card === null) {
            const result = this.modelView.next_card();
            const currentPileViews = this.pileViews.current;
            if (result && currentPileViews) {
                if (result.destPileIndex === 0) {
                    this.update_state_no_moving();
                } else {
                    const pileBox = currentPileViews.box_for(1);
                    const fromBox = currentPileViews.box_for(0);
                    if (pileBox && fromBox) {
                        this.start_animation(result.card, pileBox, 1, fromBox.left + window.scrollX + this.cardStyles.cardWidthValue/2, fromBox.top + window.scrollY, true, 0.5);
                    }
                }
            }
        }
    }

    private render_undo() {
        
        return ( <p> <br/><br/> <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                <button disabled={!this.modelView.can_undo()} onClick={this.onClickUndo}> UNDO </button>  </p>);
    }

    private onClickUndo =() => {
        
        const result = this.modelView.undo();
        if (result && this.pileViews.current) {
            // const boxFrom = this.pileViews.current.box_for(result.startPileIndex);
            // const boxTo = this.pileViews.current.box_for(result.destPileIndex);
            // this.start_animation(result.card, box, result.destPileIndex, x, y, result.turn);
            this.update_state_no_moving();
        }
    
    }

    private move_destinations(card: ICardView): IMoveDestination[] {
        const destinationPiles = this.modelView.valid_move_to_destinations(card);
        const dests : IMoveDestination[] = [];
        const holdRef = this.pileViews.current;
        for (const p of destinationPiles) {
            if (holdRef !== null) {
                dests.push({pileIndex: p, box: holdRef.box_for(p)});
            }            
        }
        return dests;
    }

    private onStartDrag = (c: ICardView, box: ClientRect) => {
        if (this.state.moving.card) {
            return;
        }
        this.dragFrom = box;
        this.mouseOffsetX = (box.left - this.lastMouseX) - 14;
        this.mouseOffsetY= (box.top - this.lastMouseY) - 8;
        
        this.destinations = this.move_destinations(c);
        const data: ITableData = {
            modelView: this.state.modelView, 
            moving: {card: c, isDragged: true}
        };
        this.setState(data);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        this.lastMouseX = event.clientX + window.scrollX;
        this.lastMouseY = event.clientY + window.scrollY;
        
        if (this.state.moving.card !== null && this.state.moving.isDragged === true) {
            const data: ITableData = {
                modelView: this.state.modelView, 
                moving: {
                    card: this.state.moving.card, 
                    isDragged: true
                }
            };
            this.setState(data);
        }
    }
    
    private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        this.lastMouseX = event.clientX + window.scrollX;
        this.lastMouseY = event.clientY + window.scrollY;
        if (this.state.moving.isDragged === false) {
            return;
        }
        const card = this.state.moving.card;
        if (card === null) {
            this.reset_drag();

            return;
        }
        
        const winning = this.winning_pile();
        if (winning ) {
            
            const anim = this.modelView.move_card_to(card, winning.pileIndex ); // have this return an animation action?
            if (winning.box && anim) {
                const x = this.lastMouseX + this.mouseOffsetX + window.scrollX;
                const y = this.lastMouseY + this.mouseOffsetY + window.scrollY;
           
                this.start_animation(anim.card, winning.box, anim.destPileIndex, x, y, false);
            } else {
                this.reset_drag();
            }

        } else {
            this.revert_animation();
        }
    }

    private winning_pile() : IMoveDestination | null {
        const dminX = this.lastMouseX + this.mouseOffsetX;
        const dminY = this.lastMouseY + this.mouseOffsetY;
        const dmaxX = dminX + this.cardStyles.cardWidthValue;
        const dmaxY = dminY + this.cardStyles.cardLengthValue;
        
        let highestCoverage = 0;
        let winningPile: IMoveDestination | null = null;

        for (const dest of this.destinations) {
            
            const coverage = this.check_overlap(dest.box, dminX, dminY, dmaxX, dmaxY);
            if (coverage > highestCoverage) {
                winningPile = dest;
                highestCoverage = coverage;
            }
        }
        const returnCoverage = this.check_overlap(this.dragFrom, dminX, dminY, dmaxX, dmaxY);
        if (returnCoverage > highestCoverage) {
            return null;
        }
        return winningPile;
    }

    private check_overlap(box: ClientRect | null, dminX: number, dminY: number, dmaxX: number, dmaxY: number): number {
        if (box === null) {
            return -1;
        }

        if (dminX > box.left + this.cardStyles.cardWidthValue || dmaxX < box.left || dminY > box.top + this.cardStyles.cardLengthValue || dmaxY < box.top) {
            return -1;
        }

        let left = dminX;
        let right = box.left + this.cardStyles.cardWidthValue;
        if (box.left > dminX) {
            left = box.left;
            right = dmaxX;
        }

        let top = dminY;
        let bottom = box.top + this.cardStyles.cardLengthValue;
        if (box.top > dminY) {
            top = box.top;
            bottom = dmaxY;
        }

        return(right-left) * (bottom-top);
    }

    private handleMouseLeave = () => {
        if (this.state.moving.card && this.state.moving.isDragged === true) {
            this.revert_animation();
        }
    }

    private reset_drag() {
        if (this.state.moving.card === null) {
            return;
        }
        this.dragFrom = null;
        this.update_state_no_moving();
    }

    private revert_animation() {
        const card = this.state.moving.card;
        if (card && this.dragFrom) {
            const x = this.lastMouseX + this.mouseOffsetX + window.scrollX;
            const y = this.lastMouseY + this.mouseOffsetY + window.scrollY;
           
            this.start_animation(card, this.dragFrom, card.pileIndex, x, y, false);
        } else {
            this.reset_drag();
        }
    }
    private start_animation(card: ICardView, box: ClientRect, pileIndex: number, fromX: number, fromY: number, turn: boolean, speed: number = 1) {
        
        if (this.animationView.current) {
            this.state.moving.card = card;
            this.state.moving.isDragged = false;
            
            const destX = box.left;
            let destY = box.top;
            
            if (pileIndex > 1 && pileIndex < 9) {
                const destPile = this.modelView.hold()[pileIndex - 2];
                if (destPile.cards.length > 0) {
                    destY +=  this.cardStyles.previewSize; 
                }           
            }
            const animator = new SimpleLerpCardAnimator({cardX:fromX, cardY:fromY, scaleX:1}, destX + window.scrollX, destY + window.scrollY, turn, speed);
            this.animationView.current.start_animation(card, animator, this.onAnimationEnd);
        } else {
            this.reset_drag();
        }
    }

    private onAnimationEnd = () => {
        this.reset_drag();
    }
    
    private update_state_no_moving() {
        const data: ITableData = {
            modelView: this.modelView.table_data(), 
            moving: {card: null, isDragged: false}
        };

        this.setState(data);
    }
}