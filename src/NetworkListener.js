import React from 'react'
import { ONLINE, OFFLINE } from './actions'

export const NetworkListener = Provider => React.createClass({
  componentDidMount () {
    if (window && window.addEventListener) {
      window.addEventListener('online', this._onlineListener)
      window.addEventListener('offline', this._onlineListener)
    }
  },
  componentDidUnmount () {
    if (window && window.removeEventListener) {
      window.removeEventListener('online', this._onlineListener)
      window.removeEventListener('offline', this._onlineListener)
    }
  },
  render () {
    return <Provider {...this.props} />
  },
  _onlineListener () {
    this.props.store.dispatch({
      type: ONLINE
    })
  },
  _offlineListener () {
    this.props.store.dispatch({
      type: OFFLINE
    })
  }
})
