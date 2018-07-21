import * as React from 'react'
import {IModelViewData, ICardView} from '../ModelView/Cards/ModelViewData'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import PileViews from './PileViews'
import DefaultCardStyles from './DefaultCardStyles'
import CardTickManager from '../ModelView/Cards/CardTickManager'
import AnimationController from '../ModelView/AnimationController'
import FloatingCardsView from './Cards/FloatingCardsView'
import FloatingCards from '../ModelView/Cards/FloatingCards'
import CardsGameViewStateMachine from '../ModelView/Cards/CardsGameViewStateMachine'
import MouseController from '../ModelView/Cards/MouseController'
import {make_card_box} from './Cards/ReactUtil'
import StateFactory from '../ModelView/States/StateFactory'
import DragToEvaluator from '../ModelView/Cards/DragToEvaluator';
import CardBox from '../ModelView/Cards/CardBox'
import FloatingCard from '../ModelView/Cards/FloatingCard'

interface ITableData {
    modelView: IModelViewData;
}

export default class TableView extends React.Component<{}, ITableData> {

    private modelView = new SolitaireModelView();
    private pileViews = React.createRef<PileViews>();
    private cardStyles: DefaultCardStyles = new DefaultCardStyles();
    private floatingCards = new FloatingCards();
    private tickManager = new CardTickManager();
    private animationController: AnimationController;
    private stateMachine = new CardsGameViewStateMachine();
    private stateFactory: StateFactory;

    private interval : NodeJS.Timer;

    constructor(props: any, context: any) {
        super(props, context);
        this.animationController = new AnimationController(this.modelView, this.cardStyles, this.updateState);
        this.tickManager.add(this.animationController);
        const drag = new DragToEvaluator(this.cardStyles,  this.boxFor, this.modelView);
        this.stateFactory = new StateFactory(this.stateMachine, this.floatingCards, this.modelView,drag, this.animationController);

        this.stateMachine.move_to(this.stateFactory.make_idle_state());
    }
   
    public componentDidMount() {
       this.updateState();
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
                    {this.render_undo()}
                    <PileViews ref={this.pileViews} cardStyles={this.cardStyles} modelView={this.modelView} floatingCards={this.floatingCards} onDeckClick={this.onDeckClick} onStartDrag={this.onStartDrag} />                 
                    <FloatingCardsView floatingCards={this.floatingCards} cardStyles={this.cardStyles} modelViewDataSync={this.modelView.data_sync()} />
                    
                </div>
            </section>
        );
    }

    private update() {
        this.tickManager.tick();
    }

    private boxFor = (pileIndex: number): CardBox | null => {
        if (this.pileViews.current) {
            const box = this.pileViews.current.box_for(pileIndex);
            if (box) {
                return make_card_box(box);
            }
        }
        return null;
    }

    private onDeckClick = () => {
        if (this.floatingCards.has_any() === false) {
            const result = this.modelView.next_card();
            const currentPileViews = this.pileViews.current;
            if (result && currentPileViews) {
                if (result.destPileIndex === 0) {
                    this.updateState();
                } else {
                    const pileBox = currentPileViews.box_for(1);
                    const fromBox = currentPileViews.box_for(0);
                    if (pileBox && fromBox) {
                        const x = fromBox.left + window.scrollX + this.cardStyles.cardWidthValue/2;
                        const y = fromBox.top + window.scrollY;
                        const floatingCard = new FloatingCard(result.card, x, y, 1, this.modelView.data_sync());
                        this.floatingCards.add(floatingCard);
                        const state = this.stateFactory.make_anim_state(floatingCard, pileBox, 1, x, y, true, 0.5);
                        this.stateMachine.move_to(state);
                    }
                }
            }
        }
    }

    private onStartDrag = (c: ICardView, box: ClientRect) => {
        const cardBox = make_card_box(box);
        this.stateMachine.current().on_start_drag(c, cardBox);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
        if (this.stateMachine.current().on_mouse_move(MouseController.lastMouseX, MouseController.lastMouseY)) {
            this.updateState();
        }     
    }
    
    private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
        this.stateMachine.current().on_mouse_up(MouseController.lastMouseX, MouseController.lastMouseY);
    }

    private handleMouseLeave = () => {
        this.stateMachine.current().on_mouse_leave();
    }

    private render_undo() {  
        return ( <p> <button disabled={!this.should_enable_undo_button()} onClick={this.onClickUndo}> UNDO </button>  </p>);
    }

    private should_enable_undo_button() {
        return this.modelView.can_undo() && this.floatingCards.has_any() === false;
    }

    private onClickUndo =() => {   
        const result = this.modelView.undo();
        if (result && this.pileViews.current) {
             const boxFrom = this.pileViews.current.box_for(result.startPileIndex);
            const boxTo = this.pileViews.current.box_for(result.destPileIndex);
            if (boxFrom && boxTo) {
                const x = boxFrom.left + window.scrollX;
                const y = boxFrom.top + window.scrollY;
                const floatingCard = new FloatingCard(result.card, x, y, 1, this.modelView.data_sync());
                this.floatingCards.add(floatingCard);
                const state = this.stateFactory.make_anim_state(floatingCard, boxTo, result.destPileIndex, x, y, result.destPileIndex === 0, 1.0);     
                this.stateMachine.move_to(state);
            }
        }
    }

    private updateState = ()=> {
        const data: ITableData = {
            modelView: this.modelView.table_data()
        };
        this.setState(data);
    }

}