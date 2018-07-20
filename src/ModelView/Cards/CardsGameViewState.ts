import CardsGameViewStateMachine from './CardsGameViewStateMachine'
import CardBox from './CardBox'
import {ICardView} from './ModelViewData'

export default abstract class CardsGameViewState {

    private machine: CardsGameViewStateMachine;

    constructor(machine: CardsGameViewStateMachine) {
        this.machine = machine;
    }

    /* tslint:disable:no-empty */
    public on_start_drag(c: ICardView, box: CardBox): void { }
    public on_mouse_move(x: number, y: number): boolean { return false; } // return true to update state
    public on_mouse_up(x: number, y: number): void { }
    public on_mouse_leave(): void { }
    public pushed_on() {}
    public popped_in() {}

    protected state_machine(): Readonly<CardsGameViewStateMachine> {
        return this.machine;
    }
}