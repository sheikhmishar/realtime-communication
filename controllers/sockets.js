const { log } = console
const {
  getClientSocketCount,
  addClientSocket,
  removeClientSocket,
  findClientSocketByUsername
} = require('../models/ClientSocket')

/** @typedef {SocketIO.Socket & {username:String}} Socket */

/**
 * @param {Socket} socket
 * @param {String} username
 */
const establishSocket = (socket, username) => {
  if (findClientSocketByUsername(username))
    return socket.emit('validate', false)

  socket.emit('validate', true)
  socket.broadcast.emit('join', username)
  socket.username = username
  addClientSocket(socket)
  const clientSocketCount = getClientSocketCount()
  log(`Joined ${socket.id} ${username} Total users: ${clientSocketCount}`)
}

/** @param {Socket} socket */
const destroySocket = socket => {
  if (!socket.username) return

  socket.broadcast.emit('leave', socket.username)
  removeClientSocket(socket.id)
  socket.removeAllListeners()
  socket.disconnect(true)
  const socketCount = getClientSocketCount()
  log(`Left ${socket.id} ${socket.username} Total users: ${socketCount}`)
}

/** @param {Socket} socket */
const handleNewSocketConnection = socket => {
  socket.on('username', username => establishSocket(socket, username))
  socket.on('disconnect', () => destroySocket(socket))
  socket.on('message', message => socket.broadcast.emit('message', message))
}

/** @param {Socket} socket */
const onWatchSocketConnection = socket => log('visited', socket.client.id)

/**
 * @param {SocketIO.Server} io
 * @param {import("fs").PathLike} viewsDir
 */
const setupSocket = (io, viewsDir) => {
  io.of('/chat').on('connection', handleNewSocketConnection)

  if (process.env.NODE_ENV !== 'production') {
    io.of('/watch').on('connection', onWatchSocketConnection)
    require('fs').watch(viewsDir, { recursive: true }, () =>
      io.of('/watch').emit('refresh')
    )
  }
}

module.exports = { setupSocket }
