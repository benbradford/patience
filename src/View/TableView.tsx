import * as React from 'react'
import {IModelViewData, ICardView, PileName, view_pile_from_view_card, hold_index_from_pilename} from '../ModelView/ModelViewData'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import PileViews from './PileViews'
import {cardWidthValue, cardLengthValue, previewSize} from  './CardRenderer'
import CardDragView from './CardDragView'
import CardAnimationView from './CardAnimationView'

export interface IMoveDestination {
    pile: PileName;
    box: ClientRect | null; 
}

interface IMoveData {
    card: ICardView | null;
    destinations: IMoveDestination[];
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
    private dragView = React.createRef<CardDragView>();

    private lastMouseX : number = 0;
    private lastMouseY : number = 0;
    private mouseOffsetX: number = 0;
    private mouseOffsetY: number = 0;

    private dragFrom: ClientRect | null = null;
    
    private interval : NodeJS.Timer;
    
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
                    <PileViews ref={this.pileViews} deck={this.state.modelView.deck} hold={this.state.modelView.hold} turned={this.state.modelView.turned} moving={this.state.moving} score={this.state.modelView.score} onDeckClick={this.onDeckClick} onStartDrag={this.onStartDrag} />
                    <CardDragView ref={this.dragView} card={this.state.moving.card} isDragged={this.state.moving.isDragged} modelView={this.state.modelView} cardX={this.lastMouseX + this.mouseOffsetX} cardY={this.lastMouseY + this.mouseOffsetY}/>
                    <CardAnimationView ref={this.animationView} modelView={this.state.modelView} />
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

    private onDeckClick = () => {
        if (this.modelView.next_card() && this.state.moving.card === null) {
            this.update_state_no_moving();
        }
    }

    private move_destinations(card: ICardView): IMoveDestination[] {
        const destinationPiles = this.modelView.valid_move_to_destinations(card);
        const dests : IMoveDestination[] = [];
        for (const p of destinationPiles) {
            const holdRef = this.pileViews.current;
            if (holdRef !== null) {
                dests.push({pile: p, box: holdRef.box_for(p)});
            }            
        }
        return dests;
    }

    private onStartDrag = (c: ICardView, box: ClientRect) => {
        if (this.state.moving.card) {
            return;
        }
        this.dragFrom = box;
        this.mouseOffsetX = (box.left - this.lastMouseX);
        this.mouseOffsetY= (box.top - this.lastMouseY);
        
        const dests = this.move_destinations(c);
        const data: ITableData = {
            modelView: this.state.modelView, 
            moving: {card: c, destinations: dests, isDragged: true}
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
                    destinations: this.state.moving.destinations,
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
            
            this.modelView.move_card_to(card, winning.pile );
            if (winning.box) {
                this.startAnimation(card, winning.box, winning.pile);
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
        const dmaxX = dminX + cardWidthValue;
        const dmaxY = dminY + cardLengthValue;
        
        let highestCoverage = 0;
        let winningPile: IMoveDestination | null = null;

        for (const dest of this.state.moving.destinations) {
            
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

        if (dminX > box.left + cardWidthValue || dmaxX < box.left || dminY > box.top + cardLengthValue || dmaxY < box.top) {
            return -1;
        }

        let left = dminX;
        let right = box.left + cardWidthValue;
        if (box.left > dminX) {
            left = box.left;
            right = dmaxX;
        }

        let top = dminY;
        let bottom = box.top + cardLengthValue;
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
            this.startAnimation(card, this.dragFrom, card.pileName);
        } else {
            this.reset_drag();
        }
    }
    private startAnimation(card: ICardView, box: ClientRect, pile: PileName) {
        
        if (this.animationView.current && this.dragView.current) {
            this.state.moving.card = card;
            this.state.moving.isDragged = false;
            const x = this.lastMouseX + this.mouseOffsetX;
            const y = this.lastMouseY + this.mouseOffsetY;
           
            const destX = box.left;
            let destY = box.top;
            
            if (hold_index_from_pilename(pile)) {
                const destPile = view_pile_from_view_card(card, this.state.modelView);
                if (destPile.cards.length > 0) {
                    destY +=  previewSize; 
                }           
            }
            this.animationView.current.start_animation(card, x, y, destX, destY, this.onAnimationEnd);
        } else {
            this.reset_drag();
        }
    }

    private onAnimationEnd = () => {
        this.reset_drag();
    }
    
    private update_state_no_moving() {
        if (this.state && this.state.moving && this.state.moving.card !== null && this.state.moving.isDragged === false) {
            const movingData: ITableData = {
                modelView: this.modelView.table_data(), 
                moving: {card: this.state.moving.card, destinations: this.state.moving.destinations, isDragged: false}
            };
    
            this.setState(movingData);
        }
        const data: ITableData = {
            modelView: this.modelView.table_data(), 
            moving: {card: null, destinations: [], isDragged: false}
        };

        this.setState(data);
    }
}