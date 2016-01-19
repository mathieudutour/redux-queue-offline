import { middleware, QUEUE_ACTION, ONLINE } from '../src/';
import { spy } from 'sinon';
import { INITIAL_STATE } from '../src/initialState';

describe('queue middleware', () => {
  let next;
  let dispatch;
  let foobar;
  let promise;
  let state;

  beforeEach(() => {
    next = spy();
    state = {...INITIAL_STATE};
    dispatch = function d(action) {
      const store = { dispatch: d, getState: () => { return {offlineQueue: state}; } };
      return middleware()(store)(next)(action);
    };
    foobar = { foo: 'bar' };
    promise = {url: '/api', method: 'GET'};
  });

  it('dispatches action when online', () => {
    dispatch({
      type: 'ACTION_TYPE',
      payload: {
        promise
      },
      meta: {
        queueIfOffline: true
      }
    });

    expect(next.calledOnce).to.be.true;

    expect(next.firstCall.args[0]).to.deep.equal({
      type: 'ACTION_TYPE',
      payload: {
        promise
      },
      meta: {
        queueIfOffline: true
      }
    });
  });

  it('dispatches QUEUE action and normal action without payload.promise when offline', () => {
    state.isOnline = false;
    dispatch({
      type: 'ACTION_TYPE',
      payload: {
        promise
      },
      meta: {
        queueIfOffline: true
      }
    });

    expect(next.calledTwice).to.be.true;

    expect(next.firstCall.args[0]).to.deep.equal({
      type: QUEUE_ACTION,
      payload: {
        type: 'ACTION_TYPE',
        payload: {
          promise
        },
        meta: {
          queueIfOffline: true,
          skipOptimist: true
        }
      }
    });

    expect(next.secondCall.args[0]).to.deep.equal({
      type: 'ACTION_TYPE',
      payload: {},
      meta: {
        queueIfOffline: true
      }
    });
  });

  it('dispatches queued actions on ONLINE action', () => {
    state.queue = [{
      type: 'ACTION_TYPE'
    }];
    dispatch({
      type: ONLINE
    });

    expect(next.calledTwice).to.be.true;

    expect(next.firstCall.args[0]).to.deep.equal({
      type: ONLINE
    });

    expect(next.secondCall.args[0]).to.deep.equal({
      type: 'ACTION_TYPE'
    });
  });

  it('ignores non-promises', () => {
    dispatch(foobar);
    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.equal(foobar);

    dispatch({ type: 'ACTION_TYPE', payload: foobar });
    expect(next.calledTwice).to.be.true;
    expect(next.secondCall.args[0]).to.deep.equal({
      type: 'ACTION_TYPE',
      payload: foobar
    });
  });

  it('ignores non-"queueIfOffline" action', () => {
    state.isOnline = false;
    dispatch({
      type: 'ACTION_TYPE',
      payload: {
        promise: foobar
      }
    });

    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0]).to.deep.equal({
      type: 'ACTION_TYPE',
      payload: {
        promise: foobar
      }
    });
  });
});
