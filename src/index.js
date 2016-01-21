import * as actions from './actions'
import middleware from './middleware'
import reducer from './reducer'

module.exports = {
  ONLINE: actions.ONLINE,
  OFFLINE: actions.OFFLINE,
  QUEUE_ACTION: actions.QUEUE_ACTION,
  middleware,
  reducer
}
