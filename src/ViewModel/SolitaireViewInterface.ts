
import {IViewModelData, ICardView} from './Cards/ViewModelData'
import CardBox from './Cards/CardBox'
import ViewModelDataSync from './Cards/ViewModelDataSync'

export default abstract class  SolitaireViewInterface {
    
    public abstract register_state_change_listener( listener: (data: IViewModelData) => void): void;
    public abstract initialise_table(): void;
    public abstract tick(): void;
    public abstract should_enable_undo_button(): boolean;
    public abstract undo(): void; 
    public abstract on_mouse_leave(): void;
    public abstract click_deck(): void;
    public abstract on_start_drag (c: ICardView, box: CardBox): void;
    public abstract on_mouse_move(x: number, y: number): void;
    public abstract on_mouse_up(x: number, y: number): void;

    // this can be removed once we have floating cards in viewData
    public abstract data_sync(): ViewModelDataSync;
};