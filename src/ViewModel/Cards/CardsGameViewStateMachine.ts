import CardsGameViewState from './CardsGameViewState'

export default class CardsGameViewStateMachine {

    private states: CardsGameViewState[] = [];

    public current() {
        return this.states[this.states.length-1];
    }

    public move_to(state: CardsGameViewState) {
        if (this.states.length === 0) {
            this.states.push(state);
        } else {
            this.states[this.states.length - 1] = state;
        }
    }

}