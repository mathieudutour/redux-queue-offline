import test from 'ava'
import { reducer, QUEUE_ACTION, ONLINE, OFFLINE } from '../src/' // eslint-disable-line
import { INITIAL_STATE } from '../src/initialState'

test('return initial state when no state is given', (t) => {
  const nextState = reducer()

  t.same(nextState, INITIAL_STATE)
})

test('add action to the queue on QUEUE_ACTION', (t) => {
  const state = INITIAL_STATE
  const nextState = reducer(state, {
    type: QUEUE_ACTION,
    payload: {
      type: 'ACTION_TYPE'
    }
  })

  t.same(nextState, {
    isOnline: true,
    queue: [
      {
        type: 'ACTION_TYPE'
      }
    ]
  })
})

test('change isOnline status to `false` on OFFLINE action', (t) => {
  const state = {isOnline: true}
  const nextState = reducer(state, {
    type: OFFLINE
  })

  t.same(nextState, {
    isOnline: false
  })
})

test('change isOnline status to `true` and empty queue on ONLINE action', (t) => {
  const state = {isOnline: false, queue: [{ type: 'ACTION_TYPE' }]}
  const nextState = reducer(state, {
    type: ONLINE
  })

  t.same(nextState, {
    isOnline: true,
    queue: []
  })
})
