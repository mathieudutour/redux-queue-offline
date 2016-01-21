redux-queue-offline
=============

[![build status](https://img.shields.io/travis/mathieudutour/redux-queue-offline/master.svg?style=flat-square)](https://travis-ci.org/mathieudutour/redux-queue-offline)
[![npm version](https://img.shields.io/npm/v/redux-queue-offline.svg?style=flat-square)](https://www.npmjs.com/package/redux-queue-offline)

Queue actions when offline and dispatch them when getting back online.

Working nicely together with [redux-optimist-promise](https://github.com/mathieudutour/redux-optimist-promise).

```js
npm install --save redux-queue-offline
```

## Usage

### Step 1: combine your reducers with the `offlineQueue` reducer

#### `reducers/index.js`

```js
import { reducer as offlineQueue } from 'redux-queue-offline';
import { combineReducers } from 'redux';
import todos from './todos';
import status from './status';

export default optimist(combineReducers({
  offlineQueue,
  todos,
  status
}));
```

## Step 2: Use the offlineQueue middleware

First, import the middleware creator and include it in `applyMiddleware` when creating the Redux store. **You need to call it as a function (See later why on configuration section below):**

```js
import { middleware as offlineQueueMiddleware } from 'redux-queue-offline';

composeStoreWithMiddleware = applyMiddleware(
  offlineQueueMiddleware()
)(createStore);

```

When used with an async middleware, `offlineQueueMiddleware` need to be place before it.

### Step 3: Mark your actions to be queued with the `queueIfOffline` meta key

```js
store.dispatch({
  type: 'ADD_TODO',
  payload: {
    text,
    promise: {url: '/api/todo', method: 'POST', data: text}
  },
  meta: {
    queueIfOffline: true
  }
});
```

When the app is offline, the following actions will be dispatch:

```js
{                                // no need to worry about this one though
  type: 'redux-queue-offline/QUEUE_ACTION',
  payload: {
    type: 'ADD_TODO',
    payload: {
      text,
      promise: {url: '/api/todo', method: 'POST', data: text}
    },
    meta: {
      queueIfOffline: true
    }
  }
}


{
  type: 'ADD_TODO',
  payload: {
    text                       // notice that the `promise` has disappear
  },
  meta: {
    queueIfOffline: true
  }
}
```

Once getting back online, the following action will be dispatch:

```js
{
  type: 'ADD_TODO',
  payload: {
    text,
    promise: {url: '/api/todo', method: 'POST', data: text}
  },
  meta: {
    skipOptimist: true,       // useful not to apply the optimist update twice
    queueIfOffline: true
  }
}
```


### Step 4: Fire `ONLINE` and `OFFLINE` action when changing

The state of the app (online or offline) is stored in the state. To update it, dispatch the `ONLINE` or `OFFLINE` actions.

```js
import { ONLINE, OFFLINE } from 'redux-queue-offline';

dispatch({ type: ONLINE });

dispatch({ type: OFFLINE });
```

You can use the NetworkListener [high order component](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775) from [redux-queue-offline-listener](https://github.com/mathieudutour/redux-queue-offline-listener) to wrap the redux Provider and automatically dispatch the ONLINE and OFFLINE action when listening to `window.on('online')` and `window.on('online')`.

```js
import NetworkListener from 'redux-queue-offline-listner';
import { Provider } from 'react-redux';

const NetworkListenerProvider = NetworkListener(Provider);

ReactDOM.render(
  <NetworkListenerProvider store={store}>
    <MyRootComponent />
  </NetworkListenerProvider>,
  rootEl
)
```

## Configuration

You can configure the name of the reducer (default to `offlineQueue`) and the field being deleted from the action when offline (default to `payload.promise`).

```js
import { middleware as offlineQueueMiddleware } from 'redux-queue-offline';

composeStoreWithMiddleware = applyMiddleware(
  offlineQueueMiddleware('myOfflineQueueReducerName', 'payload.thunk')
)(createStore);

```

## Gotcha

DO NOT DISPATCH A PROMISE DIRECTLY (otherwise, queuing will be useless). Do use a middleware to transform a descriptive object (`{url: '/api/todo', method: 'POST', data: text}`) to a proper promise.

## License

  MIT
