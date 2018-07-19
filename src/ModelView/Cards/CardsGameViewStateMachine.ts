import CardsGameViewState from './CardsGameViewState'

export default class CardsGameViewStateMachine {

    private states: CardsGameViewState[] = [];

    public current() {
        return this.states[this.states.length-1];
    }

    public move_to(state: CardsGameViewState) {
        if (this.states.length === 0) {
            this.push(state);
        } else {
            this.states[this.states.length - 1] = state;
        }
    }

    public push(state: CardsGameViewState) {
        if (this.states.length > 0) {
            this.current().pushed_on();
        }
        this.states.push(state);
    }

    public pop() {
        if (this.states.length > 1) {
            this.states[this.states.length-2].popped_in();            
        }
        this.states.pop();
    }
}