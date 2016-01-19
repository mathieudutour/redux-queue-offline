import { INITIAL_STATE } from './initialState';
import { QUEUE_ACTION, ONLINE, OFFLINE } from './actions';

export default function reducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
  case QUEUE_ACTION:
    return {...state, queue: state.queue.concat(action.payload)};
  case ONLINE:
    return {queue: [], isOnline: true};
  case OFFLINE:
    return {...state, isOnline: false};
  default: return state;
  }
}
