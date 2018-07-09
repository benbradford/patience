import * as React from 'react'
import {IModelViewData, ICardView} from '../ModelView/Cards/ModelViewData'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import PileViews from './PileViews'
import FloatingCardView from './FloatingCardView'
import CardAnimationView from './CardAnimationView'
import DefaultCardStyles from './DefaultCardStyles'

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
    
    private interval : NodeJS.Timer;
    private destinations: IMoveDestination[];

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
        let card = this.state.moving.card;
        if (card === null) {
            this.reset_drag();

            return;
        }
        
        const winning = this.winning_pile();
        if (winning ) {
            
            this.modelView.move_card_to(card, winning.pileIndex );
            card = this.modelView.view_card(card, winning.pileIndex);
            if (winning.box && card) {
                this.startAnimation(card, winning.box, winning.pileIndex);
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
            this.startAnimation(card, this.dragFrom, card.pileIndex);
        } else {
            this.reset_drag();
        }
    }
    private startAnimation(card: ICardView, box: ClientRect, pileIndex: number) {
        
        if (this.animationView.current) {
            this.state.moving.card = card;
            this.state.moving.isDragged = false;
            const x = this.lastMouseX + this.mouseOffsetX + window.scrollX;
            const y = this.lastMouseY + this.mouseOffsetY + window.scrollY;
           
            const destX = box.left;
            let destY = box.top;
            
            if (pileIndex > 1 && pileIndex < 9) {
                const destPile = this.modelView.hold()[pileIndex - 2];
                if (destPile.cards.length > 0) {
                    destY +=  this.cardStyles.previewSize; 
                }           
            }
            this.animationView.current.start_animation(card, x, y, destX + window.scrollX, destY + window.scrollY, this.onAnimationEnd);
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