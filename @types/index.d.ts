import express from 'express'
import socketIo from 'socket.io'
import socketIoClient from 'socket.io-client'

declare global {
  namespace SocketIO {
    export interface Socket {
      username: String
    }
  }
  namespace Express {
    export interface ErrorRequestHandler extends express.ErrorRequestHandler {}
    export interface Request {
      username: SocketIO.Socket
    }
    export interface Response {
      username: SocketIO.Socket
    }
  }
  export interface Window {
    io: SocketIOClientStatic
  }
}

// declare module 'express-serve-static-core' {
//     export interface Request {
//         prop: any;
//     }
//  }
