/// <reference types="redux" />

export = ReduxQueueOffline

declare namespace ReduxQueueOffline {
  export const ONLINE: string
  export const OFFLINE: string
  export const QUEUE_ACTION: string
  export function middleware(stateName?: string, asyncPayloadFields?: string[]): Redux.Middleware
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
