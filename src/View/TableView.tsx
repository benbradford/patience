import * as React from 'react'
import {IViewModelData, ICardView} from '../ViewModel/Cards/ViewModelData'
import SolitaireViewModel from '../ViewModel/SolitaireViewModel'
import PileViews from './PileViews'
import DefaultCardStyles from './DefaultCardStyles'
import CardTickManager from '../ViewModel/Cards/CardTickManager'
import AnimationController from '../ViewModel/AnimationController'
import FloatingCardsView from './Cards/FloatingCardsView'
import FloatingCards from '../ViewModel/Cards/FloatingCards'
import CardsGameViewStateMachine from '../ViewModel/Cards/CardsGameViewStateMachine'
import MouseController from '../ViewModel/Cards/MouseController'
import {make_card_box} from './Cards/ReactUtil'
import StateFactory from '../ViewModel/States/StateFactory'
import DragToEvaluator from '../ViewModel/Cards/DragToEvaluator';
import CardBox from '../ViewModel/Cards/CardBox'

export default class TableView extends React.Component<{}, IViewModelData> {

    private viewModel = new SolitaireViewModel();
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
        const stateUpdater = (data: IViewModelData): void => {this.setState(data); };
        this.viewModel.register_state_change_listener(stateUpdater);
        this.animationController = new AnimationController(this.viewModel, this.cardStyles);
        this.tickManager.add(this.animationController);
        const drag = new DragToEvaluator(this.cardStyles,  this.boxFor, this.viewModel);
        this.stateFactory = new StateFactory(this.stateMachine, this.floatingCards, this.viewModel,drag, this.animationController, this.boxFor);
        this.stateMachine.move_to(this.stateFactory.make_idle_state());
    }
   
    public componentDidMount() {
       this.viewModel.initialise_table();
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
                    <PileViews ref={this.pileViews} cardStyles={this.cardStyles} viewModel={this.viewModel} floatingCards={this.floatingCards} onDeckClick={this.onDeckClick} onStartDrag={this.onStartDrag} />                 
                    <FloatingCardsView floatingCards={this.floatingCards} cardStyles={this.cardStyles} viewModelDataSync={this.viewModel.data_sync()} />
                    
                </div>
            </section>
        );
    }

    private render_undo() {  
        return ( <p> <button disabled={!this.should_enable_undo_button()} onClick={this.onClickUndo}> UNDO </button>  </p>);
    }

    private update() {
        this.tickManager.tick();
    }

    private onStartDrag = (c: ICardView, box: ClientRect) => {
        const cardBox = make_card_box(box);
        this.stateMachine.current().on_start_drag(c, cardBox);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
        this.stateMachine.current().on_mouse_move(MouseController.lastMouseX, MouseController.lastMouseY);
    }
    
    private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
        this.stateMachine.current().on_mouse_up(MouseController.lastMouseX, MouseController.lastMouseY);
    }

    private handleMouseLeave = () => {
        this.stateMachine.current().on_mouse_leave();
    }

    private onDeckClick = () => {
        if (this.floatingCards.has_any() === false) {
            this.stateMachine.move_to(this.stateFactory.make_deck_click_state());
        }
    }

    private should_enable_undo_button() {
        return this.viewModel.can_undo() && this.floatingCards.has_any() === false;
    }

    private onClickUndo =() => {   
        this.stateMachine.move_to(this.stateFactory.make_undo_state());
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
}