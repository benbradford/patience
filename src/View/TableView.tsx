import * as React from 'react'
import {IViewModelData, ICardView} from '../ViewModel/Cards/ViewModelData'
import SolitaireViewModel from '../ViewModel/SolitaireViewModel'
import PileViews from './PileViews'
import DefaultCardStyles from './DefaultCardStyles'
import FloatingCardsView from './Cards/FloatingCardsView'
import MouseController from '../ViewModel/Cards/MouseController'
import {make_card_box} from './Cards/ReactUtil'

import CardBox from '../ViewModel/Cards/CardBox'

export default class TableView extends React.Component<{}, IViewModelData> {

    private viewModel: SolitaireViewModel;
    private pileViews = React.createRef<PileViews>();
    private cardStyles: DefaultCardStyles = new DefaultCardStyles();

  
    private interval : NodeJS.Timer;

    constructor(props: any, context: any) {
        super(props, context);
        const stateUpdater = (data: IViewModelData): void => {this.setState(data); };
        this.viewModel = new SolitaireViewModel(this.cardStyles, this.boxFor);
        this.viewModel.register_state_change_listener(stateUpdater);
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
                    <PileViews ref={this.pileViews} cardStyles={this.cardStyles} viewModel={this.viewModel} floatingCards={this.viewModel.floating_cards()} onDeckClick={this.onDeckClick} onStartDrag={this.onStartDrag} />                 
                    <FloatingCardsView floatingCards={this.viewModel.floating_cards()} cardStyles={this.cardStyles} viewModelDataSync={this.viewModel.data_sync()} />
                    
                </div>
            </section>
        );
    }

    private render_undo() {  
        return ( <p> <button disabled={!this.should_enable_undo_button()} onClick={this.onClickUndo}> UNDO </button>  </p>);
    }

    private update() {
        this.viewModel.tick();
    }

    private onStartDrag = (c: ICardView, box: ClientRect) => {
        const cardBox = make_card_box(box);
        this.viewModel.on_start_drag(c, cardBox);
    }

    private handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
        this.viewModel.on_mouse_move(MouseController.lastMouseX, MouseController.lastMouseY);
    }
    
    private handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
        MouseController.lastMouseX = event.clientX + window.scrollX;
        MouseController.lastMouseY = event.clientY + window.scrollY;
        this.viewModel.on_mouse_up(MouseController.lastMouseX, MouseController.lastMouseY);
    }

    private handleMouseLeave = () => {
        this.viewModel.on_mouse_leave();
    }

    private onDeckClick = () => {
        this.viewModel.click_deck();
    }

    private should_enable_undo_button() {
        return this.viewModel.should_enable_undo_button();
    }

    private onClickUndo =() => {   
        this.viewModel.undo();
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