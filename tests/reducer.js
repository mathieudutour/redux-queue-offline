import { reducer, QUEUE_ACTION, ONLINE, OFFLINE } from '../src/';
import { INITIAL_STATE } from '../src/initialState';

describe('queue reducer', () => {
  it('return initial state when no state is given', () => {
    const nextState = reducer();

    expect(nextState).to.deep.equal(INITIAL_STATE);
  });

  it('add action to the queue on QUEUE_ACTION', () => {
    const state = INITIAL_STATE;
    const nextState = reducer(state, {
      type: QUEUE_ACTION,
      payload: {
        type: 'ACTION_TYPE'
      }
    });

    expect(nextState).to.deep.equal({
      isOnline: true,
      queue: [
        {
          type: 'ACTION_TYPE'
        }
      ]
    });
  });

  it('change isOnline status to `false` on OFFLINE action', () => {
    const state = {isOnline: true};
    const nextState = reducer(state, {
      type: OFFLINE
    });

    expect(nextState).to.deep.equal({
      isOnline: false
    });
  });

  it('change isOnline status to `true` and empty queue on ONLINE action', () => {
    const state = {isOnline: false, queue: [{ type: 'ACTION_TYPE' }]};
    const nextState = reducer(state, {
      type: ONLINE
    });

    expect(nextState).to.deep.equal({
      isOnline: true,
      queue: []
    });
  });
});
