
import CardActionExecutor from '../CardActionExecutor'
import FakeCardCommand from './FakeCardCommand'
import CardAction from '../CardAction'

it('GIVEN command that will execute WHEN executing THEN does execute and cannot redo', () => {
    const command : FakeCardCommand = new FakeCardCommand();
    const ex = new CardActionExecutor();
    const action = new CardAction(command);
    
    ex.attempt(action);

    expect(command.value()).toEqual(1);
    expect(ex.can_redo()).toBeFalsy();
    expect(ex.can_undo()).toBeTruthy();
});

it('GIVEN command that will not execute WHEN executing THEN does not execute and cannot undo or redo', () => {
    const command : FakeCardCommand = new FakeCardCommand();
    const ex = new CardActionExecutor();
    const action = new CardAction(command);
    
    command.shouldExecute = false;
    ex.attempt(action);

    expect(command.value()).toEqual(0);
    expect(ex.can_redo()).toBeFalsy();
    expect(ex.can_undo()).toBeFalsy();
});

it('GIVEN command that will execute WHEN executing several times THEN does execute and can be undone', () => {
    const command : FakeCardCommand = new FakeCardCommand();
    const ex = new CardActionExecutor();
    const action = new CardAction(command);
    
    for (let i = 0; i < 10; ++i) {
        ex.attempt(action);
        expect(command.value()).toEqual(i+1);
    }

    let undone = 10;
    while (ex.can_undo()) {
        ex.undo();
        --undone;
        expect(command.value()).toEqual(undone);
    }

    while (ex.can_redo()) {
        ex.redo();
        ++undone;
        expect(command.value()).toEqual(undone);
    }
});

it('GIVEN some undos WHEN adding a new execute THEN cannot redo', () => {
    const command : FakeCardCommand = new FakeCardCommand();
    const ex = new CardActionExecutor();
    const action = new CardAction(command);
    
    for (let i = 0; i < 10; ++i) {
        ex.attempt(action);
        expect(command.value()).toEqual(i+1);
    }

    let undone = 10;
    while (undone > 5 {
        ex.undo();
        --undone;
        expect(command.value()).toEqual(undone);
    }

    ex.attempt(action);
    expect(ex.can_redo()).toBeFalsy();
})

