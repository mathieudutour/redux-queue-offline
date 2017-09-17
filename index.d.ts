declare module 'redux-queue-offline' {
  import {Middleware} from 'redux'
  export const ONLINE: string
  export const OFFLINE: string
  export const QUEUE_ACTION: string
  export function middleware(stateName?: string, asyncPayloadFields?: string[]): Middleware
  export function reducer(state?: {
      [x: string]: any;
      queue: any[];
      isOnline: boolean;
    }, action?: {
      type: any
    }): {
      queue: any[];
      isOnline: boolean;
    }
}
