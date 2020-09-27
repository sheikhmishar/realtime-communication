const { deepStrictEqual, ok } = require('assert')
const socketIoClient = require('socket.io-client')
const {} = require('./sockets')

describe('Controller: sockets', () => {
  /** @type {SocketIOClient.Socket} */
  let socket

  before(
    () =>
      (socket = socketIoClient.connect('ws://localhost:5000/chat', {
        path: '/sock'
      }))
  )

  describe('Method: sum', () =>
    it('should return 4', () => deepStrictEqual(2 + 2, 4)))

  describe('Connect to socket', () => {
    it('should return socket object', () => {
      // console.log(socket)
      ok(true)
    })
    it('should connect', () => {
      // console.log(socket)
      ok(true)
    })
    it('should fail', () => {
      socket.disconnect(true)
      ok(!(2 === 1))
      // console.log(socket)
    })
  })

  after(() => socket.disconnect(true))
})
