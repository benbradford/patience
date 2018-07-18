import * as React from 'react'
import {IModelViewData} from '../ModelView/Cards/ModelViewData'
import SolitaireModelView from '../ModelView/SolitaireModelView'
import PileViews from './PileViews'
import FloatingCardView from './Cards/FloatingCardView'
import CardAnimationView from './Cards/CardAnimationView'
import DefaultCardStyles from './DefaultCardStyles'
import DragController from './DragController'

interface ITableData {
    modelView: IModelViewData;
}

export default class TableView extends React.Component<{}, ITableData> {

    private modelView = new SolitaireModelView();
    private pileViews = React.createRef<PileViews>();
    private animationView = React.createRef<CardAnimationView>();
    private cardStyles: DefaultCardStyles = new DefaultCardStyles();
    private dragController: DragController;

    private interval : NodeJS.Timer;

    constructor(props: any, context: any) {
        super(props, context);
        
        this.dragController = new DragController(this.modelView, this.cardStyles, this.animationView, this.pileViews, this.updateState);
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
                <div onMouseMove={this.dragController.handleMouseMove} onMouseUp={this.dragController.handleMouseUp} onMouseLeave={this.dragController.handleMouseLeave} className="Table">   
                    <PileViews ref={this.pileViews} cardStyles={this.cardStyles} deck={this.modelView.deck()} hold={this.modelView.hold()} turned={this.modelView.turned()} movingCard={this.dragController.floating_card()} score={this.modelView.score()} onDeckClick={this.onDeckClick} onStartDrag={this.dragController.onStartDrag} />                 
                    <FloatingCardView cardStyles={this.cardStyles} card={this.dragController.floating_card()} enabled={this.dragController.is_dragged()} modelViewDataSync={this.modelView.data_sync()} cardX={this.dragController.lastMouseX + this.dragController.mouseOffsetX + window.scrollX} cardY={this.dragController.lastMouseY + this.dragController.mouseOffsetY + window.scrollY}/>
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

    private onDeckClick = () => {
        if (this.dragController.is_dragged() === false) {
            const result = this.modelView.next_card();
            const currentPileViews = this.pileViews.current;
            if (result && currentPileViews) {
                if (result.destPileIndex === 0) {
                    this.updateState();
                } else {
                    const pileBox = currentPileViews.box_for(1);
                    const fromBox = currentPileViews.box_for(0);
                    if (pileBox && fromBox) {
                        this.dragController.animationController.start_animation(result.card, pileBox, 1, fromBox.left + window.scrollX + this.cardStyles.cardWidthValue/2, fromBox.top + window.scrollY, true, 0.5);
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
             const boxFrom = this.pileViews.current.box_for(result.startPileIndex);
            const boxTo = this.pileViews.current.box_for(result.destPileIndex);
            if (boxFrom && boxTo) {
                this.dragController.animationController.start_animation(result.card, boxTo, result.destPileIndex, boxFrom.left, boxFrom.top, result.turn);
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