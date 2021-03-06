import * as React from 'react'
import {IViewModelData, ICardView} from '../ViewModel/Cards/ViewModelData'
import SolitaireViewModel from '../ViewModel/SolitaireViewModel'
import PileViews from './PileViews'
import DefaultCardStyles from './DefaultCardStyles'
import FloatingCardsView from './Cards/FloatingCardsView'
import MouseController from '../ViewModel/Cards/MouseController'
import {make_card_box} from './Cards/ReactUtil'
import CardBox from '../ViewModel/Cards/CardBox'
import SolitaireViewInterface from '../ViewModel/SolitaireViewInterface'
import { floating_cards } from '../ViewModel/SolitaireCardCollectionsViewModel';
import BoxFinder from '../ViewModel/Cards/BoxFinder';
import CardAnimationsView from './Cards/CardAnimationsView'

export default class TableView extends React.Component<{}, IViewModelData> {

    private viewInterface: SolitaireViewInterface;

    private pileViews = React.createRef<PileViews>();
    private cardStyles: DefaultCardStyles = new DefaultCardStyles();
    private interval : NodeJS.Timer;
    private pauseTimer: number = 0;

    constructor(props: any, context: any) {
        super(props, context);
        const stateUpdater = (data: IViewModelData): void => {this.setState(data); if (data.animationRequests.length > 0) { this.pauseTimer = 30; }};
        this.viewInterface = new SolitaireViewModel(this.cardStyles, new BoxFinder(this.boxForPile, this.boxForCard, this.staticBox));
        this.viewInterface.register_state_change_listener(stateUpdater);
    }
   
    public componentDidMount() {
       this.viewInterface.initialise_table();
       this.interval = setInterval(() => this.update(), 1);
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
                 <CardAnimationsView animationRequests={this.state.animationRequests} cardStyles={this.cardStyles}  /> 
                <div onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onMouseLeave={this.handleMouseLeave} className="Table">  
                    
                    {this.render_undo()}
                    <PileViews ref={this.pileViews} cardStyles={this.cardStyles} viewModelData={this.state} onDeckClick={this.onDeckClick} onStartDrag={this.onStartDrag} />                 
                    <FloatingCardsView cardStyles={this.cardStyles} floatingCards={floating_cards(this.state)} />
                    
                </div>

               
            </section>
        );
    }

    private render_undo() {  
        return ( <p> <button disabled={!this.should_enable_undo_button()} onClick={this.onClickUndo}> UNDO </button>  </p>);
    }

    private update() {
        if (this.pauseTimer > 0) {
            --this.pauseTimer;
            if (this.pauseTimer === 0) {
                this.viewInterface.update_state();
            }
        }
        this.viewInterface.tick();
    }

    private onStartDrag = (c: ICardView, box: ClientRect) => {
        if (this.pauseTimer > 0) {
            return;
        }
        const cardBox = make_card_box(box);
        this.viewInterface.on_start_drag(c, cardBox);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
        this.viewInterface.on_mouse_move(MouseController.lastMouseX, MouseController.lastMouseY);
    }
    
    private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
        this.viewInterface.on_mouse_up(MouseController.lastMouseX, MouseController.lastMouseY);
    }

    private handleMouseLeave = () => {
        this.viewInterface.on_mouse_leave();
    }

    private onDeckClick = () => {
        if (this.pauseTimer > 0) {
            return;
        }
        this.viewInterface.click_deck();
    }

    private should_enable_undo_button() {
        return this.pauseTimer === 0 && this.viewInterface.should_enable_undo_button();
    }

    private onClickUndo =() => {  
        if (this.pauseTimer > 0) {
            return;
        }
        this.viewInterface.undo();
    }

    private boxForPile = (pileIndex: number): CardBox | null => {
        if (this.pileViews.current) {
            const box = this.pileViews.current.box_for_pile(pileIndex);
            if (box) {
                return make_card_box(box);
            }
        }
        return null;
    }

    private boxForCard = (card: ICardView): CardBox => {
        if (this.pileViews.current) {
            const box = this.pileViews.current.box_for_card(card);
            if (box) {
                return make_card_box(box);
            }
        }
        throw new Error("cannot get box for card");
    }

    private staticBox = (pileIndex: number, cardIndex: number): CardBox => {
        if (this.pileViews.current) {
            return this.pileViews.current.static_box(pileIndex, cardIndex);
        }
        throw new Error("no pileviews");
    }
}