import test from 'ava'
import { middleware, QUEUE_ACTION, ONLINE } from '../src/' // eslint-disable-line
import { spy } from 'sinon'
import { INITIAL_STATE } from '../src/initialState'

test.beforeEach((t) => {
  t.context.next = spy()
  t.context.state = {...INITIAL_STATE}
  t.context.dispatch = function d (action) {
    const store = { dispatch: d, getState: () => { return {offlineQueue: t.context.state} } }
    return middleware()(store)(t.context.next)(action)
  }
  t.context.foobar = { foo: 'bar' }
  t.context.promise = {url: '/api', method: 'GET'}
})

test('dispatches action when online', (t) => {
  t.context.dispatch({
    type: 'ACTION_TYPE',
    payload: {
      promise: t.context.promise
    },
    meta: {
      queueIfOffline: true
    }
  })

  t.true(t.context.next.calledOnce)

  t.same(t.context.next.firstCall.args[0], {
    type: 'ACTION_TYPE',
    payload: {
      promise: t.context.promise
    },
    meta: {
      queueIfOffline: true
    }
  })
})

test('dispatches QUEUE action and normal action without payload.promise when offline', (t) => {
  t.context.state.isOnline = false
  t.context.dispatch({
    type: 'ACTION_TYPE',
    payload: {
      promise: t.context.promise
    },
    meta: {
      queueIfOffline: true
    }
  })

  t.true(t.context.next.calledTwice)

  t.same(t.context.next.firstCall.args[0], {
    type: QUEUE_ACTION,
    payload: {
      type: 'ACTION_TYPE',
      payload: {
        promise: t.context.promise
      },
      meta: {
        queueIfOffline: true,
        skipOptimist: true
      }
    }
  })

  t.same(t.context.next.secondCall.args[0], {
    type: 'ACTION_TYPE',
    payload: {},
    meta: {
      queueIfOffline: true
    }
  })
})

test('dispatches queued actions on ONLINE action', (t) => {
  t.context.state.queue = [{
    type: 'ACTION_TYPE'
  }]
  t.context.dispatch({
    type: ONLINE
  })

  t.true(t.context.next.calledTwice)

  t.same(t.context.next.firstCall.args[0], {
    type: ONLINE
  })

  t.same(t.context.next.secondCall.args[0], {
    type: 'ACTION_TYPE'
  })
})

test('ignores non-promises', (t) => {
  t.context.dispatch(t.context.foobar)
  t.true(t.context.next.calledOnce)
  t.same(t.context.next.firstCall.args[0], t.context.foobar)

  t.context.dispatch({ type: 'ACTION_TYPE', payload: t.context.foobar })
  t.true(t.context.next.calledTwice)
  t.same(t.context.next.secondCall.args[0], {
    type: 'ACTION_TYPE',
    payload: t.context.foobar
  })
})

test('ignores non-"queueIfOffline" action', (t) => {
  t.context.state.isOnline = false
  t.context.dispatch({
    type: 'ACTION_TYPE',
    payload: {
      promise: t.context.foobar
    }
  })

  t.true(t.context.next.calledOnce)
  t.same(t.context.next.firstCall.args[0], {
    type: 'ACTION_TYPE',
    payload: {
      promise: t.context.foobar
    }
  })
})
