import del from 'key-del';
import { INITIAL_STATE } from './initialState';
import { QUEUE_ACTION, ONLINE } from './actions';

let STATE_NAME = 'offlineQueue';
let ASYNC_PAYLOAD_FIELD = 'payload.promise';

export default function middleware(stateName = STATE_NAME, asyncPayloadField = ASYNC_PAYLOAD_FIELD) {
  STATE_NAME = stateName;
  ASYNC_PAYLOAD_FIELD = asyncPayloadField;
  return ({ getState, dispatch }) => next => action => {

    const state = (getState() || {})[STATE_NAME] || INITIAL_STATE;

    const { isOnline, queue } = state;

    // check if it's a direct action for us
    if (action.type === ONLINE) {
      next(action);
      queue.forEach(actionInQueue => dispatch(actionInQueue));
      return {};
    }

    const shouldQueue = (action.meta || {}).queueIfOffline;

    // check if we don't need to queue the action
    if (isOnline || !shouldQueue) {
      return next(action);
    }

    let actionToQueue = {
      type: action.type,
      payload: {...action.payload},
      meta: {
        ...action.meta,
        skipOptimist: true
      }
    };

    if (action.meta.skipOptimist) { // if it's a action which was in the queue already
      return next({
        type: QUEUE_ACTION,
        payload: actionToQueue
      });
    }

    dispatch({
      type: QUEUE_ACTION,
      payload: actionToQueue
    });

    const actionToDispatchNow = del(action, ASYNC_PAYLOAD_FIELD);

    return next(actionToDispatchNow);
  };
}
