import CardProxy from "../../ModelView/Cards/CardProxy";
import CardsGameViewStateMachine from './CardsGameViewStateMachine'

export default abstract class CardsGameViewState {

    private machine: CardsGameViewStateMachine;

    constructor(machine: CardsGameViewStateMachine) {
        this.machine = machine;
    }

    public floating_card(): CardProxy | null {
        return null;
    }
    /* tslint:disable:no-empty */
    public on_mouse_down(x: number, y: number): void { }
    public on_mouse_move(x: number, y: number): void { }
    public on_mouse_up(x: number, y: number): void { }
    public pushed_on() {}
    public popped_in() {}

    protected move_to(state: CardsGameViewState) {
        this.machine.move_to(state);
    }

    protected push(state: CardsGameViewState) {
        this.machine.push(state);
    }

    protected pop() {
        this.machine.pop();
    }
}